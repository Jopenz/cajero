import { Injectable } from '@nestjs/common';

const database = {
  clients: [
    {
      id: 1,
      name: 'John Doe',
      account: ['DE89370400440532013000', 'DE89370400440532013001'],
      cards: [123456789, 123456788],
    },
    {
      id: 2,
      name: 'Jane Doe',
      account: ['DE89370400440532013002'],
      cards: [123456787],
    },
  ],

  accounts: [
    {
      iban: 'DE89370400440532013000',
      balance: 100,
      currency: 'EUR',
      bank: 'DEUTDEDB',
      movements: [
        {
          date: '2020-01-01',
          description: 'Salary',
          amount: 1000,
        },
        {
          date: '2020-01-02',
          description: 'Rent',
          amount: -500,
        },
        {
          date: '2020-01-03',
          description: 'Transfer',
          amount: -100,
        },
      ],
    },
    {
      iban: 'DE89370400440532013001',
      balance: 200,
      currency: 'EUR',
      bank: 'DEUTDEDB',
      movements: [
        {
          date: '2020-01-01',
          description: 'Salary',
          amount: 1000,
        },
        {
          date: '2020-01-02',
          description: 'Rent',
          amount: -500,
        },
      ],
    },
    {
      iban: 'DE89370400440532013002',
      balance: 300,
      currency: 'EUR',
      bank: 'HYVEDEMM',
      movements: [
        {
          date: '2020-01-01',
          description: 'Salary',
          amount: 1000,
        },
        {
          date: '2020-01-02',
          description: 'Rent',
          amount: -500,
        },
      ],
    },
  ],
  cards: [
    {
      number: 123456789,
      type: 'debit',
      pin: 1234,
      blocked: false,
      configuration: {
        language: 'en',
        currency: 'USD',
        dailyLimit: 500,
      },
    },
    {
      number: 123456788,
      type: 'debit',
      pin: 1234,
      blocked: false,
      configuration: {
        language: 'en',
        currency: 'USD',
        dailyLimit: 500,
      },
    },
    {
      number: 123456787,
      type: 'debit',
      pin: 1234,
      blocked: false,
      configuration: {
        language: 'en',
        currency: 'USD',
        dailyLimit: 500,
      },
    },
  ],
  bank: [
    {
      name: 'Deutsche Bank',
      bic: 'DEUTDEDB',
      country: 'Germany',
    },
    {
      name: 'Commerzbank',
      bic: 'COBADEFF',
      country: 'Germany',
    },
    {
      name: 'UniCredit Bank',
      bic: 'HYVEDEMM',
      country: 'Germany',
    },
  ],
};

@Injectable()
export class DatabaseService {
  getClients() {
    return database.clients;
  }

  getAccounts() {
    return database.accounts;
  }

  getCards() {
    return database.cards;
  }

  getBank() {
    return database.bank;
  }
}
