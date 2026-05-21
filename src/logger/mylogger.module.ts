import { Module } from '@nestjs/common'
import { MyLogger } from 'logger/mylogger.service'

@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class MyLoggerModule {}
