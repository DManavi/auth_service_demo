import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';

import { SuccessfulResponse } from '#libs/util-api/response';

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
  @MinLength(1)
  @MaxLength(255) // DM: Password length is limited to 255 characters.
  password: string;
}

export type AuthenticateResponse = SuccessfulResponse;
