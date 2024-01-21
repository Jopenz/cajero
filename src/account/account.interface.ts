import { Card } from 'src/card/card.interface';

export interface Movements {
  date: string;
  amount: number;
  commission: number;
  description: string;
}

export interface Account {
  iban: string;
  balance: number;
  currency: string;
  bank: string;
  movements: Movements[];
}

export interface GetMoney {
  iban: string;
  name: string;
  balance: number;
  card: Card;
  movements: Movements[];
}

export interface Transfer {
  from: string;
  to: string;
  amount: number;
  description: string;
  date: string;
  balance: number;
  movements: Movements[];
}
