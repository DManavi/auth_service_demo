import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';

import { SharedModule } from './shared.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    /* internal modules */
    EventEmitterModule.forRoot({
      global: true,
      wildcard: true,
    }),

    // DM: This throttler uses memory to store the rate limiting information.
    // which means that if the application restarts, the rate limiting information is lost.
    // And the rate limiting information is not shared between multiple instances of the application.
    // If you want to share the rate limiting information between multiple instances of the application,
    // you can use a Redis store (I couldn't find a good implementation and implementing is out of this demo project scope).
    ThrottlerModule.forRoot({
      throttlers: [
        {
          // 50 requests per second
          name: 'registration',
          ttl: 1000,
          limit: 50,
        },
        {
          // 100 requests per second
          name: 'authentication',
          ttl: 1000,
          limit: 100,
        },
      ],
    }),

    /* shared modules */
    SharedModule,

    /* feature modules */
    UserModule,
  ],
})
export class AppModule {}
