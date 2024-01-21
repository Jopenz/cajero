import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './account/account.controller';
import { CardController } from './card/card.controller';
import { AuthModule } from './auth/auth.module';
import { CardService } from './card/card.service';
import { Database } from './database/database.service';
import { AccountService } from './account/account.service';
import { ClientController } from './client/client.controller';
import { ClientService } from './client/client.service';

@Module({
  imports: [AuthModule],
  controllers: [
    AppController,
    AccountController,
    CardController,
    ClientController,
  ],
  providers: [AppService, CardService, Database, AccountService, ClientService],
})
export class AppModule {}
