import { Module } from '@nestjs/common';
import { AwsCognitoService } from './cognito.service';

@Module({
  providers: [AwsCognitoService],
  exports: [AwsCognitoService],
})
export class AwsCognitoModule { }
