import { Account } from 'src/account/account.interface';

export interface Configurations {
  language: string;
  currency: string;
  dailyLimit: number;
}

export interface Card {
  number: number;
  type: string;
  pin: number;
  blocked: boolean;
  configuration?: Configurations;
}
