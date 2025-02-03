import { cloneDeep } from 'lodash';

enum Status {
  /**
   * User is enabled and can log in.
   */
  Enabled = 'enabled',

  /**
   * User is disabled and cannot log in.
   */
  Disabled = 'disabled',
}

class User {
  /**
   * Unique identifier of the user.
   */
  id: string;

  /**
   * Username of the user (unique).
   */
  username: string;

  /**
   * Status of the user.
   */
  status: Status;

  static unmarshal(data: User): User {
    return Object.assign(new User(), cloneDeep(data));
  }
}

export { User as Model, Status };
