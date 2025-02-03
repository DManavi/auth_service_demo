import { randomUUID } from 'node:crypto';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Clock } from '#libs/util-misc/clock';
import * as assert from '#libs/util-misc/assert';

import * as User from '../domain/user';
import * as OnUserCreationFailedEvent from '../events/on-user-creation-failed';
import * as OnUserCreatedEvent from '../events/on-user-created';
import * as OnUserStatusEvent from '../events/on-user-status-changed';

import { UserRepository } from './user-repository';
import { PasswordPolicy } from './password-policy';
import { CredentialsRepository } from './credentials-repository';

@Injectable()
export class UserManagement {
  constructor(
    /* external dependencies */
    protected readonly eventEmitter: EventEmitter2,
    protected readonly clock: Clock,

    /* internal dependencies */
    protected readonly userRepository: UserRepository,
    protected readonly credentialsRepository: CredentialsRepository,
    protected readonly passwordPolicy: PasswordPolicy
  ) {}

  protected async getUserByIdOrFail({
    userId,
  }: {
    userId: string;
  }): Promise<User.Model> {
    const user = await this.userRepository.findById({ id: userId });
    assert.isDefined(user, new NotFoundException(`User ${userId} not found`));

    return user;
  }

  async create({
    newUser,
  }: {
    newUser: { username: string; password: string };
  }): Promise<User.Model> {
    // ensure username is unique
    assert.isFalse(
      await this.userRepository.usernameExists({ username: newUser.username }),
      new ConflictException(`Username ${newUser.username} already exists`)
    );

    // create a user domain object
    const user = User.Model.unmarshal({
      id: randomUUID(),

      username: newUser.username,
      status: User.Status.Enabled,
    });

    // validate password
    try {
      await this.passwordPolicy.validatePassword({
        user,
        password: newUser.password,
      });
    } catch (err) {
      // unknown error instance
      if (err instanceof Error === false) {
        throw err;
      }

      // this is a password rule violation
      throw new BadRequestException(err.message);
    }

    // store user and credentials (in a transaction)
    try {
      // save user in the database (and get the saved user back)
      await this.userRepository.save({ user });

      // save user credentials (separate repository for security reasons)
      await this.credentialsRepository.save({
        user,
        password: newUser.password,
      });

      // notify the success
      this.eventEmitter.emit(
        OnUserCreatedEvent.name,
        OnUserCreatedEvent.Model.unmarshal({
          timestamp: this.clock.currentDate(),

          user,
        })
      );
    } catch (err) {
      // notify the failure
      this.eventEmitter.emit(
        OnUserCreationFailedEvent.name,
        OnUserCreationFailedEvent.Model.unmarshal({
          timestamp: this.clock.currentDate(),

          user,
          error: err as Error,
        })
      );

      throw new InternalServerErrorException();
    }

    // return the created user
    return user;
  }

  /* The methods below are demonstration of how business logic should be written */

  async disable({ userId }: { userId: string }): Promise<User.Model> {
    const user = await this.getUserByIdOrFail({ userId });

    user.status = User.Status.Disabled;
    await this.userRepository.save({ user });

    this.eventEmitter.emit(
      OnUserStatusEvent.name,
      OnUserStatusEvent.Model.unmarshal({
        timestamp: this.clock.currentDate(),

        username: user.username,
        status: user.status,
      })
    );

    return user;
  }

  async enable({ userId }: { userId: string }): Promise<User.Model> {
    const user = await this.getUserByIdOrFail({ userId });

    user.status = User.Status.Enabled;
    await this.userRepository.save({ user });

    this.eventEmitter.emit(
      OnUserStatusEvent.name,
      OnUserStatusEvent.Model.unmarshal({
        timestamp: this.clock.currentDate(),

        username: user.username,
        status: user.status,
      })
    );

    return user;
  }
}
