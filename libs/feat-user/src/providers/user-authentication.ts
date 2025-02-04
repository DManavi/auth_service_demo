import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import * as typeChecks from '#libs/util-misc/type-check';
import * as assert from '#libs/util-misc/assert';
import { Clock } from '#libs/util-misc/clock';

import * as User from '../domain/user';
import * as OnAuthenticationFailed from '../events/on-authentication-failed';
import * as OnAuthenticationSucceeded from '../events/on-authentication-succeeded';

import * as UserRepository from './user-repository';
import * as CredentialsRepository from './credentials-repository';

@Injectable()
class UserAuthentication {
  constructor(
    /* external dependencies */
    protected readonly eventEmitter: EventEmitter2,
    protected readonly clock: Clock,

    /* internal dependencies */
    protected readonly userRepository: UserRepository.Provider,
    protected readonly credentialsRepository: CredentialsRepository.Provider
  ) {}

  protected async userExistenceCheck({
    user,
    username,
  }: {
    user?: User.Model;
    username: string;
  }): Promise<void> {
    // if user does not exist, emit a AuthenticationFailed event (with reason UserNotFound)
    if (typeChecks.isNullOrUndefined(user)) {
      this.eventEmitter.emit(
        OnAuthenticationFailed.name,

        OnAuthenticationFailed.Model.unmarshal({
          timestamp: this.clock.currentDate(),

          username,
          reason: OnAuthenticationFailed.Reason.UserNotFound,
        })
      );

      throw new UnauthorizedException();
    }
  }

  protected async checkUserStatus({
    user,
  }: {
    user?: User.Model;
  }): Promise<void> {
    assert.isDefined(user, 'User must be defined');

    const hasValidStatus = user.status === User.Status.Enabled;

    if (hasValidStatus !== true) {
      this.eventEmitter.emit(
        OnAuthenticationFailed.name,

        OnAuthenticationFailed.Model.unmarshal({
          timestamp: this.clock.currentDate(),

          username: user.username,
          reason: OnAuthenticationFailed.Reason.UserDisabled,
        })
      );

      throw new UnauthorizedException();
    }
  }

  protected async checkUserCredentials({
    user,
    password,
  }: {
    user?: User.Model;
    password: string;
  }): Promise<void> {
    assert.isDefined(user, 'User must be defined');

    // check if user can login (only enabled users can login)
    const hasValidCredentials = await this.credentialsRepository.validate({
      user,
      password,
    });

    if (hasValidCredentials !== true) {
      this.eventEmitter.emit(
        OnAuthenticationFailed.name,

        OnAuthenticationFailed.Model.unmarshal({
          timestamp: this.clock.currentDate(),

          username: user.username,
          reason: OnAuthenticationFailed.Reason.InvalidCredentials,
        })
      );

      throw new UnauthorizedException();
    }
  }

  async authenticate({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<void> {
    // fetch user by username
    const user = await this.userRepository.findByUsername({ username });

    const checks: Array<Function> = [
      // check if user exists
      this.userExistenceCheck.bind(this, { user, username }),

      // check if user has valid status
      this.checkUserStatus.bind(this, { user }),

      // check if user has valid credentials
      this.checkUserCredentials.bind(this, { user, password }),
    ];

    // run all checks
    for (const check of checks) {
      await check();
    }

    // emit success event
    this.eventEmitter.emit(
      OnAuthenticationSucceeded.name,

      OnAuthenticationSucceeded.Model.unmarshal({
        timestamp: this.clock.currentDate(),

        username,
      })
    );
  }
}

export { UserAuthentication as Provider };
