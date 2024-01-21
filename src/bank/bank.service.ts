import { Injectable } from '@nestjs/common';
import { Bank } from 'src/client/client.interface';
import { Database } from '../database/database.service';

@Injectable()
export class BankService {
  constructor(private database: Database) {}

  async getBank(bic: string): Promise<Bank> {
    const banks = await this.database.getBanks();

    const bank = banks.find((bank) => bank.bic == bic);

    if (bank) {
      return Promise.resolve(bank);
    }
    return Promise.reject(null);
  }

  getBanks(): Promise<Bank[]> {
    return Promise.resolve([]);
  }
}
