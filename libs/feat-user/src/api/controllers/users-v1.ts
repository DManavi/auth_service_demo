import { Body, Controller, Post } from '@nestjs/common';

import * as UserManagement from '../../providers/user-management';
import { ApiVersion } from '../shared/api-version';
import * as DTO from '../dto/users-v1';
import * as DatabaseConnectionCircuitBreaker from '../../guards/database-connection-circuit-breaker';

@Controller({ path: 'users', version: ApiVersion.V1 })
@DatabaseConnectionCircuitBreaker.RequiresConnection(['users'])
export class UserManagementController {
  constructor(protected readonly userManagement: UserManagement.Provider) {}

  @Post()
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
}
