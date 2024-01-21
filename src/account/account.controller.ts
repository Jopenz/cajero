import { Controller, Post, Put, Get, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Account, GetMoney, Movements } from './account.interface';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('movements/:iban')
  getMovements(iban: string): Promise<Movements[]> {
    return this.accountService.getMovements(iban);
  }

  @Post('money/:cardNumber')
  getMoney(
    @Param('cardNumber') cardNumber: number,
    @Param('pin') pin: number,
    @Param('amount') amount: number,
  ): Promise<GetMoney> {
    return this.accountService.getMoney(cardNumber, pin, amount);
  }

  @Put('deposit/:cardNumber')
  deposit(
    @Param('cardNumber') cardNumber: number,
    @Param('pin') pin: number,
    @Param('amount') amount: number,
  ): Promise<GetMoney> {
    return this.accountService.deposit(cardNumber, pin, amount);
  }

  @Post('iban')
  getIBAN(): string {
    return 'IBAN';
  }

  @Post('transfer')
  transfer(): string {
    return 'transfer';
  }
}
