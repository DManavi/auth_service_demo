import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';

import * as EventsLogger from './events/logger';

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

    // DM: API configuration is configured to work behind a reverse proxy.
    // This requires the application to trust the proxy and to use the X-Forwarded-For header to get the client's IP address.
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

  providers: [EventsLogger.Provider],
})
export class AppModule {}
