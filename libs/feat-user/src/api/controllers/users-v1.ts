import { Body, Controller, Post } from '@nestjs/common';

import { UserManagement } from '../../providers/user-management';
import { ApiVersion } from '../shared/api-version';
import * as DTO from '../dto/users-v1';

@Controller({ path: '/users', version: ApiVersion.V1 })
export class UserManagementController {
  constructor(protected readonly userManagement: UserManagement) {}

  @Post('/')
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
