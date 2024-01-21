import { Injectable } from '@nestjs/common';
import { Account } from 'src/account/account.interface';
import { Bank, Client } from 'src/client/client.interface';

@Injectable()
export class Database {
  getAccounts(): Promise<Account[]> {
    return Promise.resolve([]);
  }

  getClients(): Promise<Client[]> {
    return Promise.resolve([]);
  }

  getBanks(): Promise<Bank[]> {
    return Promise.resolve([]);
  }
}
