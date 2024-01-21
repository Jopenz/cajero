import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { BankService } from './bank/bank.service';
import { ConfigModule } from '@nestjs/config';
import { HashMiddleware } from './hash/hash.middleware';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [
    AppController,
    AccountController,
    CardController,
    ClientController,
  ],
  providers: [
    AppService,
    CardService,
    Database,
    AccountService,
    ClientService,
    BankService,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(HashMiddleware)
  //     .forRoutes(CardController)
  //     .apply(HashMiddleware)
  //     .forRoutes(AccountController)
  //     .apply(HashMiddleware)
  //     .forRoutes(ClientController);
  // }
  // Para produccion se debe usar el middleware convierte el pin en hash
}
