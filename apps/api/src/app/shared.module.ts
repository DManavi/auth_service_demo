import { Module } from '@nestjs/common';

/* Providers */
/*    shared */
import * as Clock from '#libs/util-misc/clock';

@Module({
  providers: [Clock.Provider],
  exports: [Clock.Provider],
})
export class SharedModule {}
