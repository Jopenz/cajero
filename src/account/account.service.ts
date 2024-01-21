import { Injectable } from '@nestjs/common';
import { Account, GetMoney, Movements } from './account.interface';
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
  ): Promise<GetMoney> {
    const client = await this.clientService.getClient(cardNumber, pin);

    if (!client) {
      throw new Error('Client not found');
    }

    const card = client.cards.find((card) => card.number == cardNumber);

    const account = client.accounts.find(
      (account) => account.iban == card.account,
    );

    const daily = await account.movements.reduce((args, movement) => {
      const movementDate = dayjs(movement.date);
      if (dayjs().format('YYYY-MM-DD') === movementDate.format('YYYY-MM-DD')) {
        return args + movement.amount;
      }
      return args;
    }, 0);

    if (card.configuration.dailyLimit - (Math.abs(daily) + amount) < 0) {
      throw new Error('Daily limit exceeded');
    }

    if (card.type === 'debit') {
      if (account.balance < amount) {
        throw new Error('Not enough money');
      } else {
        account.balance -= amount;
      }
    } else if (card.type === 'credit' && card.limit) {
      const montly = await account.movements.reduce((args, movement) => {
        const movementDate = dayjs();
        if (dayjs().isSame(movementDate, 'month') && movement.amount < 0) {
          return args + movement.amount;
        }
        return args;
      }, 0);

      if (account.balance + card.limit < amount + montly) {
        throw new Error('Not enough money');
      } else {
        let newBalence = account.balance - amount;
        if (newBalence < 0) {
          account.balance = 0;
          if (card.limit + newBalence < 0) {
            throw new Error('Not enough credit money');
          } else {
            card.limit = card.limit + newBalence;
          }
        } else {
          account.balance = newBalence;
        }
      }
    }

    account.movements.push({
      date: new Date().toISOString(),
      amount: -amount,
      description: 'Remove',
    });

    const result: GetMoney = {
      iban: account.iban,
      name: client.name,
      balance: account.balance,
      movements: account.movements,
      card: card,
    };

    return Promise.resolve(result);
  }

  async deposit(
    cardNumber: number,
    pin: number,
    amount: number,
  ): Promise<GetMoney> {
    const client = await this.clientService.getClient(cardNumber, pin);

    if (!client) {
      throw new Error('Client not found');
    }

    const card = client.cards.find((card) => card.number == cardNumber);

    const account = client.accounts.find(
      (account) => account.iban == card.account,
    );

    account.balance += amount;

    account.movements.push({
      date: new Date().toISOString(),
      amount: amount,
      description: 'Deposit',
    });

    const result: GetMoney = {
      iban: account.iban,
      name: client.name,
      balance: account.balance,
      movements: account.movements,
      card: card,
    };

    return Promise.resolve(result);
  }
}
