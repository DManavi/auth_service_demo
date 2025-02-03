import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';
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
  @MinLength(1)
  @MaxLength(255) // DM: Password length is limited to 255 characters.
  password: string;
}

export class User implements UserDomain.Model {
  id: string;
  username: string;
  status: UserDomain.Status;

  static createInstanceFromDomain(user: UserDomain.Model): User {
    const plain = instanceToPlain(user);

    // DM: this is where domain to DTO mapping happens
    // we can use pick or omit from lodash to filter out unwanted fields

    return plainToInstance(User, plain);
  }
}

export type CreateSuccessfulResponse = SuccessfulResponse<User>;
