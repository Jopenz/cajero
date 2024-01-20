import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './account/account.controller';
import { CardController } from './card/card.controller';
import { AuthModule } from './auth/auth.module';
import { CardService, Database } from './card/card.service';
import { AccountService } from './account/account.service';

@Module({
  imports: [AuthModule, Database],
  controllers: [AppController, AccountController, CardController],
  providers: [AppService, Database, CardService, AccountService],
})
export class AppModule {}
