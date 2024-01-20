import { Controller, Post, Put, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('card')
@Controller('card')
export class CardController {
  @Post('block')
  block(): string {
    return 'block';
  }

  @Post('unblock')
  unblock(): string {
    return 'unblock';
  }

  @Post('remove')
  remove(): string {
    return 'remove';
  }

  @Post('change_pin')
  changePin(): string {
    return 'change_pin';
  }

  @Post('configuration')
  configuration(): string {
    return 'configuration';
  }

  @Get('configuration')
  getConfiguration(): string {
    return 'get_configuration';
  }
}
