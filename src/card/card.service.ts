import { Injectable } from '@nestjs/common';
import { Card } from './card.interface';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CardService {
  constructor(private database: DatabaseService) {}

  getCards(): Promise<Card[]> {
    return Promise.resolve(this.database.getCards());
  }

  findCard(cardNumber: number): Promise<Card> {
    const cards = this.database.getCards();
    const card = cards.find((card) => card.number == cardNumber);
    return Promise.resolve(card);
  }
}
