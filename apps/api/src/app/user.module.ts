import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { createClient } from 'redis';
import { get as env } from 'env-var';

import { SharedModule } from './shared.module';

/* Controllers */
import { HealthController } from '#libs/feat-user/api/controllers/health';
import { UsersController } from '#libs/feat-user/api/controllers/users-v1';

/* Providers */
/*    feat-users */
import * as CredentialsRepository from '#libs/feat-user/providers/credentials-repository';
import * as DatabaseHealth from '#libs/feat-user/providers/database-health';
import * as UsersRepository from '#libs/feat-user/providers/users-repository';
import * as PasswordPolicy from '#libs/feat-user/providers/password-policy';
import * as PasswordPolicyRule from '#libs/feat-user/providers/password-policy-rules';
import * as UserManagement from '#libs/feat-user/providers/user-management';
import * as UserAuthentication from '#libs/feat-user/providers/user-authentication';

@Module({
  imports: [TerminusModule, SharedModule],

  providers: [
    /* configuration */
    {
      provide: CredentialsRepository.configKey,
      useFactory: async (): Promise<CredentialsRepository.Config> => {
        const redisClient = createClient({
          url: env('APP_USER_CREDENTIALS_REPOSITORY_REDIS_URL')
            .required()
            .asUrlString(),
        });

        // connect to the Redis server
        await redisClient.connect();

        return {
          redisClient,
        };
      },
    },
    {
      provide: UsersRepository.configKey,
      useFactory: async (): Promise<UsersRepository.Config> => {
        const redisClient = createClient({
          url: env('APP_USER_USERS_REPOSITORY_REDIS_URL')
            .required()
            .asUrlString(),
        });

        // connect to the Redis server
        await redisClient.connect();

        return {
          redisClient,
        };
      },
    },

    // database
    CredentialsRepository.Provider,
    UsersRepository.Provider,
    DatabaseHealth.Provider,

    // password policy
    PasswordPolicyRule.PersonalInformationRule,
    PasswordPolicy.Provider,

    // high-level services
    UserManagement.Provider,
    UserAuthentication.Provider,
  ],

  controllers: [
    /* internal controllers */
    HealthController,

    /* feature controllers */
    UsersController,
  ],
})
export class UserModule {}
