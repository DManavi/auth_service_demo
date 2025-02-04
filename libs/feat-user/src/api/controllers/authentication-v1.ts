import { Body, Controller, Post } from '@nestjs/common';

import * as UserAuthentication from '../../providers/user-authentication';
import { ApiVersion } from '../shared/api-version';
import * as DTO from '../dto/authentication-v1';
import * as DatabaseConnectionCircuitBreaker from '../../guards/database-connection-circuit-breaker';

@Controller({ path: 'authentication', version: ApiVersion.V1 })
@DatabaseConnectionCircuitBreaker.RequiresConnection(['credentials'])
export class AuthenticationController {
  constructor(
    protected readonly userAuthentication: UserAuthentication.Provider
  ) {}

  @Post()
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
