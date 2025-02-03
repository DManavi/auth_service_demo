import * as User from '../domain/user';

import { BaseEvent } from './base';

const name = 'users.on-user-creation-failed';

class OnUserCreationFailed<T extends Error> extends BaseEvent {
  /**
   * The user that it was attempted to create.
   */
  user: User.Model;

  /**
   * The error that occurred.
   */
  error: T;

  static unmarshal<T extends Error>(
    data: OnUserCreationFailed<T>
  ): OnUserCreationFailed<T> {
    return Object.assign(new OnUserCreationFailed(), data);
  }
}

export { OnUserCreationFailed as Model, name };
