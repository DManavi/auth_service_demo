import { Controller, VERSION_NEUTRAL } from '@nestjs/common';

@Controller({ path: '/_health', version: VERSION_NEUTRAL })
export class HealthController {}
