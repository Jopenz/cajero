import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './account/account.controller';
import { CardController } from './card/card.controller';
import { AuthModule } from './auth/auth.module';
import { CardService, Database } from './card/card.service';
import { AccountService } from './account/account.service';
import { ClientService } from './client/client.service';
import { ClientController } from './client/client.controller';

@Module({
  imports: [AuthModule, Database],
  controllers: [AppController, AccountController, CardController, ClientController],
  providers: [AppService, Database, CardService, AccountService, ClientService],
})
export class AppModule {}
