import { Injectable } from '@nestjs/common';
import { Account, Movements } from './account.interface';
import { ClientService } from '../client/client.service';
import dayjs from 'dayjs';

@Injectable()
export class AccountService {
  constructor(private clientService: ClientService) {}

  async getMovements(iban: string): Promise<Movements[]> {
    const client = await this.clientService.getClientByIban(iban);

    const account = client.accounts.find((account) => account.iban == iban);

    if (!account) {
      throw new Error('Account not found');
    }

    return Promise.resolve(account.movements);
  }

  async getMoney(
    cardNumber: number,
    pin: number,
    amount: number,
  ): Promise<Account> {
    const client = await this.clientService.getClient(cardNumber, pin);

    if (!client) {
      throw new Error('Client not found');
    }

    const card = client.cards.find((card) => card.number == cardNumber);

    if (card.configuration.dailyLimit < amount) {
      throw new Error('Daily limit exceeded');
    }

    const account = client.accounts.find(
      (account) => account.iban == card.account,
    );

    const daily = await account.movements.reduce((args, movement) => {
      const movementDate = dayjs();
      if (dayjs().isSame(movementDate, 'day') && movement.amount < 0) {
        return args + movement.amount;
      }
      return args;
    }, 0);

    if (daily + amount > card.configuration.dailyLimit) {
      throw new Error('Daily limit exceeded');
    }

    if (card.type === 'debit' && account.balance < amount) {
      throw new Error('Not enough money');
    } else if (
      card.type === 'credit' &&
      card.limit &&
      account.balance + card.limit < amount
    ) {
      throw new Error('Not enough money');
    }

    account.balance -= amount;

    account.movements.push({
      date: new Date().toISOString(),
      amount: -amount,
      description: 'Remove',
    });

    return Promise.resolve(account);
  }
}
