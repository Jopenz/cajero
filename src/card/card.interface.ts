export interface Configurations {
  language?: string;
  currency?: string;
  dailyLimit?: number;
}

export interface Card {
  number: number;
  type: string;
  pin: number | string;
  blocked: boolean;
  account: string;
  limit?: number;
  configuration?: Configurations;
}
