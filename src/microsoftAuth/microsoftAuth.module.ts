import { Module } from '@nestjs/common';
import { MicrosoftAuthService } from './microsoftAuth.service';

@Module({
  imports: [],
  providers: [MicrosoftAuthService],
  exports: [MicrosoftAuthService]
})

export class MicrosoftAuthModule {}