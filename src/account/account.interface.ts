export interface Movements {
  date: string;
  amount: number;
  description: string;
}

export interface Account {
  iban: string;
  balance: number;
  currency: string;
  movements: Movements[];
}
