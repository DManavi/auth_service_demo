import * as User from '../domain/user';

import { BaseEvent } from './base';

const name = 'users.on-user-status-changed';

class OnUserStatusChanged extends BaseEvent {
  /**
   * The username of the user that failed to authenticate.
   */
  username: string;

  /**
   * The new status of the user.
   */
  status: User.Status;

  static unmarshal(data: OnUserStatusChanged): OnUserStatusChanged {
    return Object.assign(new OnUserStatusChanged(), data);
  }
}

export { OnUserStatusChanged as Model, name };
