import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ServiceUnavailableException,
} from '@nestjs/common';
import { defaultTo, uniq } from 'lodash';

import * as DatabaseHealthCheck from '../providers/database-health-check';

const RequiresDatabaseConnection =
  Reflector.createDecorator<
    Array<DatabaseHealthCheck.DatabaseConnectionName>
  >();

@Injectable()
class DatabaseConnectionCircuitBreakerGuard implements CanActivate {
  constructor(
    protected readonly reflector: Reflector,

    protected readonly databaseHealthCheck: DatabaseHealthCheck.Provider
  ) {}

  protected getRequiredDatabaseConnectionNames(
    context: ExecutionContext
  ): Array<DatabaseHealthCheck.DatabaseConnectionName> {
    const providedValues = defaultTo(
      this.reflector.get(RequiresDatabaseConnection, context.getHandler()),
      []
    );

    // Ensure that the provided values are unique.
    return uniq(providedValues);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredDatabaseConnections =
      this.getRequiredDatabaseConnectionNames(context);

    // If the handler does not have the RequiresDatabaseConnection decorator, then
    // we can assume that the handler does not require a database connection.
    if (requiredDatabaseConnections.length === 0) {
      return true;
    }

    // iterate over each required database connection and check if it is healthy.
    for (const connectionName of requiredDatabaseConnections) {
      const connectionStatus =
        await this.databaseHealthCheck.getConnectionStatus({
          connectionName,
        });

      // If the connection is not healthy, then we should throw a ServiceUnavailableException (HTTP 503).
      if (connectionStatus.isHealthy !== true) {
        throw new ServiceUnavailableException();
      }
    }

    return true;
  }
}

export {
  DatabaseConnectionCircuitBreakerGuard as Guard,
  RequiresDatabaseConnection as RequiresConnection,
};
