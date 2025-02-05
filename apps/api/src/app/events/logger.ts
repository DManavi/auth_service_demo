import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import * as OnAuthenticationFailedEvent from '#libs/feat-user/events/on-authentication-failed';
import * as OnAuthenticationSucceededEvent from '#libs/feat-user/events/on-authentication-succeeded';
import * as OnUserCreatedEvent from '#libs/feat-user/events/on-user-created';
import * as OnUserCreationFailedEvent from '#libs/feat-user/events/on-user-creation-failed';
import * as OnUserStatusChangedEvent from '#libs/feat-user/events/on-user-status-changed';

@Injectable()
class EventsLogger {
  protected readonly logger: Logger = new Logger(EventsLogger.name);

  @OnEvent(OnAuthenticationFailedEvent.name)
  handleAuthenticationFailedEvent(event: OnAuthenticationFailedEvent.Model) {
    this.logger.debug(
      `Authentication failed for user ${event.username}`,
      JSON.stringify(event, null, 2)
    );
  }

  @OnEvent(OnAuthenticationSucceededEvent.name)
  handleAuthenticationSucceededEvent(
    event: OnAuthenticationSucceededEvent.Model
  ) {
    this.logger.debug(
      `Authentication succeeded for user ${event.username}`,
      JSON.stringify(event, null, 2)
    );
  }

  @OnEvent(OnUserCreatedEvent.name)
  handleUserCreatedEvent(event: OnUserCreatedEvent.Model) {
    this.logger.debug(
      `User created: ${event.user.username}`,
      JSON.stringify(event, null, 2)
    );
  }

  @OnEvent(OnUserCreationFailedEvent.name)
  handleUserCreationFailedEvent(event: OnUserCreationFailedEvent.Model) {
    this.logger.debug(
      `User creation failed: ${event.user.username}`,
      JSON.stringify(event, null, 2)
    );
  }

  @OnEvent(OnUserStatusChangedEvent.name)
  handleUserStatusChangedEvent(event: OnUserStatusChangedEvent.Model) {
    this.logger.debug(
      `User status changed: ${event.username} (${event.status})`,
      JSON.stringify(event, null, 2)
    );
  }
}

export { EventsLogger as Provider };
