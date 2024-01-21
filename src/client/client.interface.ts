import { Account } from 'src/account/account.interface';
import { Card } from 'src/card/card.interface';

export interface Commission {
  transfer: number;
  transferSameBank: number;
}
export interface Bank {
  name: string;
  bic: string;
  country: string;
  commissions: Commission;
}

export interface Client {
  id: number;
  name: string;
  accounts: Account[];
  cards: Card[];
  bank: Bank;
}
