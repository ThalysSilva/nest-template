import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilterTreatment } from './common/filters/exceptionFilter';
import { LogModule } from './modules/global/logs/log.module';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './modules/global/db/prisma/prisma.module';
import { AuthenticationModule } from './modules/global/authentication/authentication.module';
import { MongoModule } from './modules/global/db/mongodb/mongo.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    LogModule,
    MongoModule,
    PrismaModule,
    UserModule,
    AuthenticationModule,
    ConfigModule.forRoot(),
    HttpModule.register({
      global: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilterTreatment,
    },
  ],
})
export class AppModule {}
