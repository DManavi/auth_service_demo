import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import * as DatabaseHealthCheck from '../../providers/database-health-check';

@Controller({ path: '_health', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    protected readonly health: HealthCheckService,
    protected readonly databaseHealthCheck: DatabaseHealthCheck.Provider
  ) {}

  @Get()
  @HealthCheck()
  async healthCheck() {
    return this.health.check([
      () =>
        this.databaseHealthCheck.getDatabaseConnectionHealthIndicator({
          connectionName: 'users',
        }),
      () =>
        this.databaseHealthCheck.getDatabaseConnectionHealthIndicator({
          connectionName: 'credentials',
        }),
    ]);
  }
}
