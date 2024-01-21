import { Controller, Post, Put, Get, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Account, GetMoney, Movements } from './account.interface';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('movements/:cardNumber')
  getMovements(
    @Param('cardNumber') cardNumber: number,
    @Param('pin') pin: number,
  ): Promise<Movements[]> {
    return this.accountService.getMovements(cardNumber, pin);
  }

  @Post('money/:cardNumber')
  getMoney(
    @Param('cardNumber') cardNumber: number,
    @Param('pin') pin: number,
    @Param('amount') amount: number,
    @Param('bank') bank: string,
  ): Promise<GetMoney> {
    return this.accountService.getMoney(cardNumber, pin, amount, bank);
  }

  @Put('deposit/:cardNumber')
  deposit(
    @Param('cardNumber') cardNumber: number,
    @Param('pin') pin: number,
    @Param('amount') amount: number,
    @Param('bank') bank: string,
  ): Promise<GetMoney> {
    return this.accountService.deposit(cardNumber, pin, amount, bank);
  }

  @Post('transfer')
  transfer(): string {
    return 'transfer';
  }
}
