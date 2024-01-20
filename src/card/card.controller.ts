import { Controller, Post, Put, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { Card } from './card.interface';

@ApiTags('card')
@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Post(':cardNumber')
  findCard(@Param('cardNumber') cardNumber: number): Promise<Card> {
    return this.cardService.findCard(cardNumber);
  }

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
