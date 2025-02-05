import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { SharedModule } from './shared.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    /* internal modules */
    EventEmitterModule.forRoot({
      global: true,
      wildcard: true,
    }),

    /* shared modules */
    SharedModule,

    /* feature modules */
    UserModule,
  ],
})
export class AppModule {}
