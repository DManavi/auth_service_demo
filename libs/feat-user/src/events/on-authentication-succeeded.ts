import { BaseEvent } from './base';

const name = 'users.on-authentication-succeeded';

class OnAuthenticationSucceeded extends BaseEvent {
  /**
   * The username of the user that failed to authenticate.
   */
  username: string;

  static unmarshal(data: OnAuthenticationSucceeded): OnAuthenticationSucceeded {
    return Object.assign(new OnAuthenticationSucceeded(), data);
  }
}

export { OnAuthenticationSucceeded as Model, name };
