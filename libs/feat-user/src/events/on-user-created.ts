import * as User from '../domain/user';

import { BaseEvent } from './base';

const name = 'users.on-user-created';

class OnUserCreated extends BaseEvent {
  /**
   * The user that was created.
   */
  user: User.Model;

  static unmarshal(data: OnUserCreated): OnUserCreated {
    return Object.assign(new OnUserCreated(), data);
  }
}

export { OnUserCreated as Model, name };
