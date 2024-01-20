import { Account } from 'src/account/account.interface';
import { Card } from 'src/card/card.interface';

export interface Client {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  accounts: Account[];
  cards: Card[];
}
