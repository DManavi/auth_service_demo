import { Body, Controller, Post } from '@nestjs/common';

import { UserAuthentication } from '../../providers/user-authentication';
import { ApiVersion } from '../shared/api-version';
import * as DTO from '../dto/authentication-v1';

@Controller({ path: '/authentication', version: ApiVersion.V1 })
export class AuthenticationController {
  constructor(protected readonly userAuthentication: UserAuthentication) {}

  @Post('/')
  async authenticate(
    @Body() payload: DTO.AuthenticateRequestPayload
  ): Promise<DTO.AuthenticateResponse> {
    // This function either throws an exception or returns nothing.
    // DM: @dev: We can return a token or a session object here.
    await this.userAuthentication.authenticate({
      username: payload.username,
      password: payload.password,
    });

    return {
      success: true,
    };
  }
}
