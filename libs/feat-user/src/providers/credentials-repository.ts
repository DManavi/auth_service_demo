import { createHash } from 'node:crypto';

import { Injectable, Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createClient } from 'redis';
import { get as env } from 'env-var';

import * as checks from '#libs/util-misc/type-check';

import * as User from '../domain/user';

export const configKey = 'user.credentials-repository.config';

type Config = {
  /**
   * Redis client
   */
  redisClient: ReturnType<typeof createClient>;
};

const getConfig = registerAs(
  configKey,
  (): Config =>
    ({
      redisClient: createClient({
        url: env('APP__USER__CREDENTIAL_REPOSITORY__REDIS__CLIENT__URL')
          .required()
          .asUrlString(),
      }),
    } satisfies Config)
);

@Injectable()
export class CredentialsRepository {
  protected readonly passwordField: string = 'password';

  constructor(
    @Inject(getConfig.KEY)
    protected readonly config: Config
  ) {}

  protected getSetName({ userId }: { userId: string }): string {
    return `user:${userId}`;
  }

  protected async createPasswordHash({
    password,
  }: {
    password: string;
  }): Promise<string> {
    return createHash('SHA3-256').update(password).digest('hex');
  }

  protected async encryptPassword({
    password,
  }: {
    password: string;
  }): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async save({
    user,
    password,
  }: {
    user: User.Model;
    password: string;
  }): Promise<void> {
    const setName = this.getSetName({ userId: user.id });

    // create SHA-256 hash of the password to get a fixed-length string (64 characters)
    // https://www.npmjs.com/package/bcrypt#security-issues-and-concerns
    const passwordHash = await this.createPasswordHash({
      password: password,
    });

    const encryptedPasswordHash = await this.encryptPassword({
      password: passwordHash,
    });

    // store the safe password in the Redis database
    await this.config.redisClient.hSet(
      setName,
      this.passwordField,
      encryptedPasswordHash
    );
  }

  async validate({
    user,
    password,
  }: {
    user: User.Model;
    password: string;
  }): Promise<boolean> {
    const setName = this.getSetName({ userId: user.id });

    const storedPassword = await this.config.redisClient.hGet(
      setName,
      this.passwordField
    );

    if (checks.isNullOrUndefined(storedPassword) === true) {
      return false;
    }

    // create SHA-256 hash of the password to get a fixed-length string (64 characters)
    // https://www.npmjs.com/package/bcrypt#security-issues-and-concerns
    const passwordHash = await this.createPasswordHash({
      password,
    });

    // compare the password hash (unencrypted) with the stored password (encrypted)
    return await bcrypt.compare(passwordHash, storedPassword);
  }
}
