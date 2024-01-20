import { Controller, Post, Put, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('account')
@Controller('account')
export class AccountController {
  @Get('movements')
  getMovements(): string {
    return 'movements';
  }

  @Post('iban')
  getIBAN(): string {
    return 'IBAN';
  }

  @Post('transfer')
  transfer(): string {
    return 'transfer';
  }

  @Put('deposit')
  deposit(): string {
    return 'deposit';
  }
}
