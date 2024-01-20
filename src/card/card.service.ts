import { Injectable } from '@nestjs/common';
import { Card } from './card.interface';

@Injectable()
export class Database {
  getCards(): Promise<Card[]> {
    return Promise.resolve([]);
  }
  findCard(cardNumber: number): Promise<Card> {
    return Promise.resolve({
      number: 123456789,
      type: 'debit',
      pin: 1234,
      blocked: false,
      configuration: {
        language: 'en',
        currency: 'USD',
        dailyLimit: 500,
      },
    });
  }
}

@Injectable()
export class CardService {
  constructor(private database: Database) {}

  getCards(): Promise<Card[]> {
    return this.database.getCards();
  }

  findCard(cardNumber: number): Promise<Card> {
    return this.database.findCard(cardNumber);
  }
}
