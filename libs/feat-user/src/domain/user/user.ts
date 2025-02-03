import { cloneDeep } from 'lodash';
import { plainToInstance } from 'class-transformer';

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

  static createInstance(data: User): User {
    return plainToInstance(User, cloneDeep(data));
  }
}

export { User as Model, Status };
