import { Injectable } from '@nestjs/common';
import { GetMoney, Movements, Transfer } from './account.interface';
import { ClientService } from '../client/client.service';
import { BankService } from '../bank/bank.service';
import dayjs from 'dayjs';
import { Client } from 'src/client/client.interface';

@Injectable()
export class AccountService {
  constructor(
    private clientService: ClientService,
    private bankService: BankService,
  ) {}

  async getMovements(cardNumber: number, pin: number): Promise<Movements[]> {
    const client = await this.clientService.getClient(cardNumber, pin);

    if (!client) {
      throw new Error('Client not found');
    }

    const card = client.cards.find((card) => card.number == cardNumber);

    if (card.blocked) {
      throw new Error('Card blocked.');
    }

    const account = client.accounts.find(
      (account) => account.iban == card.account,
    );

    return Promise.resolve(account.movements);
  }

  async getMoney(
    cardNumber: number,
    pin: number,
    amount: number,
    bank: string,
  ): Promise<GetMoney> {
    const client = await this.clientService.getClient(cardNumber, pin);
    let commissions = (amount * client.bank.commissions.withdrawal) / 100;
    let amountWithCommission = amount + commissions;

    if (bank !== client.bank.bic) {
      //Is not the same bank - apply other commissions
      const otherBank = await this.bankService.getBank(bank);

      if (!otherBank) {
        throw new Error('Bank not found');
      }

      commissions = (amount * otherBank.commissions.withdrawalForeign) / 100;
      amountWithCommission = amount + commissions;
    }

    if (!client) {
      throw new Error('Client not found');
    }

    const card = client.cards.find((card) => card.number == cardNumber);

    if (card.blocked) {
      throw new Error('Card blocked.');
    }

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

    if (
      card.configuration.dailyLimit - (Math.abs(daily) + amountWithCommission) <
      0
    ) {
      throw new Error('Daily limit exceeded');
    }

    if (card.type === 'debit') {
      if (account.balance < amountWithCommission) {
        throw new Error('Not enough money');
      } else {
        account.balance -= amountWithCommission;
      }
    } else if (card.type === 'credit' && card.limit) {
      const montly = await account.movements.reduce((args, movement) => {
        const movementDate = dayjs();
        if (dayjs().isSame(movementDate, 'month') && movement.amount < 0) {
          return args + movement.amount;
        }
        return args;
      }, 0);

      if (account.balance + card.limit < amountWithCommission + montly) {
        throw new Error('Not enough money');
      } else {
        let newBalence = account.balance - amountWithCommission;
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
      date: dayjs().format('YYYY-MM-DD').toString(),
      amount: -amount,
      commission: commissions,
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
    bank: string,
  ): Promise<GetMoney> {
    const client = await this.clientService.getClient(cardNumber, pin);

    if (!client) {
      throw new Error('Client not found');
    }

    const card = client.cards.find((card) => card.number == cardNumber);

    if (card.blocked) {
      throw new Error('Card blocked.');
    }

    const account = client.accounts.find(
      (account) => account.iban == card.account,
    );

    if (account.bank !== bank) {
      throw new Error('The deposit is not available for this bank.');
    }

    account.balance += amount;

    account.movements.push({
      date: dayjs().format('YYYY-MM-DD').toString(),
      amount: amount,
      commission: 0,
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

  async transfer(
    cardNumber: number,
    pin: number,
    amount: number,
    iban: string,
  ): Promise<Transfer> {
    const client = await this.clientService.getClient(cardNumber, pin);
    const receptor = await this.clientService.getClientByIban(iban);

    if (!client) {
      throw new Error('Client not found');
    }

    const card = client.cards.find((card) => card.number == cardNumber);

    if (card.blocked) {
      throw new Error('Card blocked.');
    }

    const account = client.accounts.find(
      (account) => account.iban == card.account,
    );

    let commissions = (amount * client.bank.commissions.transfer) / 100;
    let amountWithCommission = amount + commissions;

    if (client.bank.bic !== receptor.bank.bic) {
      //Is not the same bank - apply other commissions
      commissions = (amount * client.bank.commissions.transferForeign) / 100;
      amountWithCommission = amount + commissions;
    }

    if (account.balance < amountWithCommission) {
      throw new Error('Not enough money');
    } else {
      account.balance -= amountWithCommission;
    }

    account.movements.push({
      date: dayjs().format('YYYY-MM-DD').toString(),
      amount: -amount,
      commission: commissions,
      description: 'Transfer',
    });

    const receptorAccount = receptor.accounts.find(
      (account) => account.iban == iban,
    );

    receptorAccount.balance += amount;

    receptorAccount.movements.push({
      date: dayjs().format('YYYY-MM-DD').toString(),
      amount: amount,
      commission: 0,
      description: 'Transfer',
    });

    const result: Transfer = {
      from: account.iban,
      to: receptorAccount.iban,
      amount: amount,
      description: 'Transfer',
      date: dayjs().format('YYYY-MM-DD').toString(),
      balance: account.balance,
      movements: account.movements,
    };

    return Promise.resolve(result);
  }
}
