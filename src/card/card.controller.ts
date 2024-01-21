import { Controller, Post, Put, Get, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { Card } from './card.interface';
import { ConfigurationsDTO } from './card.DTO';

@ApiTags('card')
@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Post('block/:cardNumber')
  block(
    @Param('cardNumber') cardNumber: number,
    @Param('pin') pin: number,
  ): Promise<Card> {
    return this.cardService.blockCard(cardNumber, pin);
  }

  @Post('unblock/:cardNumber')
  unblock(
    @Param('cardNumber') cardNumber: number,
    @Param('pin') pin: number,
  ): Promise<Card> {
    return this.cardService.unblockCard(cardNumber, pin);
  }

  @Post('change_pin/:cardNumber')
  changePin(
    @Param('cardNumber') cardNumber: number,
    @Param('newPin') newPin: number,
    @Param('oldPin') oldPin: number,
  ): Promise<Card> {
    return this.cardService.changePin(cardNumber, newPin, oldPin);
  }

  @Post('configuration/:cardNumber')
  configuration(
    @Param('cardNumber') cardNumber: number,
    @Body() config: ConfigurationsDTO,
  ): Promise<Card> {
    return this.cardService.configuration(cardNumber, config);
  }
}
