import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import * as DatabaseHealth from '../../providers/database-health';

@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    protected readonly health: HealthCheckService,
    protected readonly databaseHealth: DatabaseHealth.Provider
  ) {}

  @Get()
  @HealthCheck()
  async healthCheck() {
    return this.health.check([
      () =>
        this.databaseHealth.getConnectionHealthIndicator({
          connectionName: 'users',
        }),
      () =>
        this.databaseHealth.getConnectionHealthIndicator({
          connectionName: 'credentials',
        }),
    ]);
  }
}
