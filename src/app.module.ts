import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './account/account.controller';
import { CardController } from './card/card.controller';
import { AuthModule } from './auth/auth.module';
import { CardService } from './card/card.service';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [AuthModule],
  controllers: [AppController, AccountController, CardController],
  providers: [AppService, CardService, DatabaseService],
})
export class AppModule {}
