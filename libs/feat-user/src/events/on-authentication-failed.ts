import { BaseEvent } from './base';

const name = 'users.on-authentication-failed';

enum Reason {
  /**
   * The user was not found.
   */
  UserNotFound = 'user_not_found',

  /**
   * The credentials provided is invalid.
   */
  InvalidCredentials = 'invalid_credentials',

  /**
   * The user is disabled.
   */
  UserDisabled = 'user_disabled',
}

class OnAuthenticationFailed extends BaseEvent {
  /**
   * The username of the user that failed to authenticate.
   */
  username: string;

  /**
   * The reason why the authentication failed.
   */
  reason: Reason;

  static unmarshal(data: OnAuthenticationFailed): OnAuthenticationFailed {
    return Object.assign(new OnAuthenticationFailed(), data);
  }
}

export { OnAuthenticationFailed as Model, Reason, name };
