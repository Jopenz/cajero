import { Injectable } from '@nestjs/common';
import { Card } from './card.interface';

@Injectable()
export class CardService {
  getCards(): Promise<Card[]> {
    return Promise.resolve([]);
  }

  findCard(cardNumber: number): Promise<Card> {
    return Promise.resolve(null);
  }
}
