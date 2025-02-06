import { Global, Module } from '@nestjs/common';
import { LogService } from './log.service';
import { MongoModule } from '../db/mongodb/mongo.module';
@Global()
@Module({
  imports: [MongoModule],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
