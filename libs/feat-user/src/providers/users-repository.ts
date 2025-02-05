import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { createClient } from 'redis';

import * as assert from '#libs/util-misc/assert';
import * as checks from '#libs/util-misc/type-check';

import * as User from '../domain/user';

const configKey = 'user.credentials-repository.config';

type Config = {
  /**
   * Redis client
   */
  redisClient: ReturnType<typeof createClient>;
};

type UserKeys = keyof User.Model;

@Injectable()
class UsersRepository {
  constructor(
    @Inject(configKey)
    protected readonly config: Config
  ) {}

  protected mappedKeys: Array<UserKeys> = ['id', 'username', 'status'] as const;

  protected getSetName({ userId }: { userId: string }): string {
    return `user:${userId}`;
  }

  protected getUsernameToIdKey({ username }: { username: string }): string {
    return `user:id-map:${username}`;
  }

  protected async getUserIdByUsername({
    username,
  }: {
    username: string;
  }): Promise<string | undefined> {
    const userIdMapKey = this.getUsernameToIdKey({ username });
    const userId = await this.config.redisClient.get(userIdMapKey);

    // if userId is not found, return undefined (not null)
    if (checks.isNullOrUndefined(userId) === true) {
      return undefined;
    }

    return userId;
  }

  async usernameExists({ username }: { username: string }): Promise<boolean> {
    const userId = await this.getUserIdByUsername({ username });
    return checks.isNullOrUndefined(userId) === false;
  }

  async findById({ id }: { id: string }): Promise<User.Model | undefined> {
    const userSetKey = this.getSetName({ userId: id });
    const userFields = await this.config.redisClient.hmGet(
      userSetKey,
      this.mappedKeys // get only the keys we need
    );

    assert.isTrue(
      userFields.length === this.mappedKeys.length,
      new NotFoundException(`User ${id} not found`)
    );

    // keys are in the same order as the mappedKeys
    return User.Model.createInstance(
      Object.fromEntries(
        this.mappedKeys.map((key, index) => [key, userFields[index]])
      ) as any
    );
  }

  async findByUsername({
    username,
  }: {
    username: string;
  }): Promise<User.Model | undefined> {
    const userId = await this.getUserIdByUsername({ username });

    // if userId is not found, return undefined
    if (checks.isNullOrUndefined(userId) === true) {
      return undefined;
    }

    // use the same method to find the user by id
    return await this.findById({ id: userId });
  }

  async save({ user }: { user: User.Model }): Promise<User.Model> {
    const userSetKey = this.getSetName({ userId: user.id });

    // store user data
    await this.config.redisClient.hSet(
      userSetKey,
      this.mappedKeys.map((key) => [key, user[key]]).flat()
    );

    // store username to id mapping
    const userIdMapKey = this.getUsernameToIdKey({ username: user.username });
    await this.config.redisClient.set(userIdMapKey, user.id);

    return user;
  }
}

export { UsersRepository as Provider, Config, configKey };
