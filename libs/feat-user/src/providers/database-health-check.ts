import { Inject, Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { HealthIndicatorResult } from '@nestjs/terminus';

import * as assert from '#libs/util-misc/assert';

import * as CredentialsRepository from './credentials-repository';
import * as UserRepository from './user-repository';

type ConnectionName = 'credentials' | 'users';

type ConnectionStatus = {
  /**
   * Determines if the client's underlying socket is open.
   */
  isOpen: boolean;

  /**
   * Determines if the client is ready to process commands.
   */
  isReady: boolean;

  /**
   * Determines if the client is healthy.
   */
  isHealthy: boolean;
};

@Injectable()
class DatabaseHealthCheck {
  protected readonly databaseConnections: Record<
    ConnectionName,
    ReturnType<typeof createClient>
  >;

  constructor(
    @Inject(CredentialsRepository.configKey)
    credentialsRepositoryConfig: CredentialsRepository.Config,

    @Inject(UserRepository.configKey)
    userRepositoryConfig: UserRepository.Config
  ) {
    this.databaseConnections = {
      credentials: credentialsRepositoryConfig.redisClient,
      users: userRepositoryConfig.redisClient,
    };
  }

  protected async checkRedisConnection({
    redisClient,
  }: {
    redisClient: ReturnType<typeof createClient>;
  }): Promise<ConnectionStatus> {
    return {
      isOpen: redisClient.isOpen,
      isReady: redisClient.isReady,

      isHealthy: redisClient.isOpen && redisClient.isReady,
    };
  }

  async getConnectionStatus({
    connectionName,
  }: {
    connectionName: ConnectionName;
  }): Promise<ConnectionStatus> {
    const redisClient = this.databaseConnections[connectionName];
    assert.isDefined(
      redisClient,
      `Unknown database connection name: ${connectionName}`
    );

    return this.checkRedisConnection({ redisClient });
  }

  async getDatabaseConnectionHealthIndicator({
    connectionName,
  }: {
    connectionName: ConnectionName;
  }): Promise<HealthIndicatorResult> {
    const connectionStatus = await this.getConnectionStatus({
      connectionName,
    });

    const isHealthy = connectionStatus.isOpen && connectionStatus.isReady;

    return {
      [connectionName]: {
        status: isHealthy ? 'up' : 'down',
        ...connectionStatus,
      },
    };
  }
}

export {
  DatabaseHealthCheck as Provider,
  ConnectionName as DatabaseConnectionName,
  ConnectionStatus as DatabaseStatus,
};
