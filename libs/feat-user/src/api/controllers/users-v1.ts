import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import * as UserAuthentication from '../../providers/user-authentication';
import * as UserManagement from '../../providers/user-management';
import { ApiVersion } from '../shared/api-version';
import * as DTO from '../dto/users-v1';
import * as DatabaseConnectionCircuitBreaker from '../../guards/database-connection-circuit-breaker';

@Controller({ path: 'users', version: ApiVersion.V1 })
export class UsersController {
  constructor(
    protected readonly userManagement: UserManagement.Provider,
    protected readonly userAuthentication: UserAuthentication.Provider
  ) {}

  @Post()
  @DatabaseConnectionCircuitBreaker.RequiresConnection(['users'])
  async create(
    @Body() payload: DTO.CreateRequestPayload
  ): Promise<DTO.CreateSuccessfulResponse> {
    // create a user with the provided username and password
    const user = await this.userManagement.create({
      newUser: {
        username: payload.username,
        password: payload.password,
      },
    });

    return {
      success: true,
      data: DTO.User.createInstanceFromDomain(user),
    };
  }

  @Post('authenticate')
  @HttpCode(200)
  @DatabaseConnectionCircuitBreaker.RequiresConnection(['credentials'])
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
