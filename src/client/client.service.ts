import { Injectable } from '@nestjs/common';
import { Database } from '../database/database.service';
import { Client } from './client.interface';
import { get, find, some } from 'lodash';

@Injectable()
export class ClientService {
  constructor(private database: Database) {}

  async getClients(): Promise<Client[]> {
    return await this.database.getClients();
  }

  async getClient(cardNumber: number, pin): Promise<Client> {
    const clients = await this.database.getClients();
    const client = find(clients, (client) => {
      return some(client.cards, (card) => {
        return card.number === cardNumber && card.pin === pin;
      });
    });
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }

  async getClientByIban(iban: string): Promise<Client> {
    const clients = await this.database.getClients();
    const client = find(clients, (client) => {
      return some(client.accounts, (account) => {
        return account.iban === iban;
      });
    });
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }
}
