import { Injectable } from '@nestjs/common';
import { Card, Configurations } from './card.interface';
import { ClientService } from '../client/client.service';

@Injectable()
export class CardService {
  constructor(private clientService: ClientService) {}

  getCards(): Promise<Card[]> {
    return Promise.resolve([]);
  }

  findCard(cardNumber: number): Promise<Card> {
    return Promise.resolve(null);
  }

  blockCard(cardNumber: number, pin: number): Promise<Card> {
    return Promise.resolve(null);
  }

  unblockCard(cardNumber: number, pin: number): Promise<Card> {
    return Promise.resolve(null);
  }

  changePin(cardNumber: number, newPin: number, oldPin: number): Promise<Card> {
    return Promise.resolve(null);
  }

  configuration(cardNumber: number, config: Configurations): Promise<Card> {
    return Promise.resolve(null);
  }
}
