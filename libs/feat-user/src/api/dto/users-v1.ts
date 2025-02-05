import {
  IsDefined,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { instanceToPlain, plainToInstance } from 'class-transformer';

import { SuccessfulResponse } from '#libs/util-api/response';

import * as UserDomain from '../../domain/user';

export class CreateRequestPayload {
  /**
   * The username of the user.
   */
  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(63) // DM: Username length is limited to 63 characters.
  username: string;

  /**
   * The password of the user.
   */
  @IsDefined()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  @Matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, {
    message: 'Password must contain at least one special character.',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least one digit.',
  })
  password: string;
}

export class User implements UserDomain.Model {
  /**
   * The ID of the user.
   */
  id: string;

  /**
   * The username of the user.
   */
  username: string;

  /**
   * The status of the user.
   */
  status: UserDomain.Status;

  static createInstanceFromDomain(user: UserDomain.Model): User {
    const plain = instanceToPlain(user);

    // DM: this is where domain to DTO mapping happens
    // we can use pick or omit from lodash to filter out unwanted fields
    // alternatively, we can use class-transformer (or other similar mapping libraries) to do the same

    return plainToInstance(User, plain);
  }
}

export type CreateSuccessfulResponse = SuccessfulResponse<User>;

export class AuthenticateRequestPayload {
  /**
   * The username of the user.
   */
  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(63) // DM: Username length is limited to 63 characters.
  username: string;

  /**
   * The password of the user.
   */
  @IsDefined()
  @IsString()
  password: string;
}

export type AuthenticateResponse = SuccessfulResponse;
