import { TestBed } from '@automock/jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Database } from '../database/database.service';
import * as data from '../database/database.json';
import { ClientService } from '../client/client.service';
import { Bank, Client } from '../client/client.interface';
import { BankService } from '../bank/bank.service';

describe('AccountController', () => {
  let controller: AccountController;
  let databaseClient: jest.Mocked<Database>;
  let databaseBank: jest.Mocked<Database>;

  beforeEach(async () => {
    const mockClients: Client[] = data.clients;
    const mockBanks: Bank[] = data.banks;

    const clientService = TestBed.create(ClientService).compile();
    const bankService = TestBed.create(BankService).compile();

    databaseClient = clientService.unitRef.get(Database);
    databaseBank = bankService.unitRef.get(Database);

    databaseClient.getClients.mockResolvedValue(mockClients);
    databaseBank.getBanks.mockResolvedValue(mockBanks);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        { provide: ClientService, useValue: clientService.unit },
        { provide: BankService, useValue: bankService.unit },
        AccountService,
      ],
    }).compile();
    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Movements - Get Movements', async () => {
    const johnDoeMovements = await controller.getMovements(123456788, 4567);
    const juanPerezMovements = await controller.getMovements(123456787, 1234);
    expect(databaseClient.getClients).toHaveBeenCalled();

    expect(johnDoeMovements.length).toEqual(3);
    expect(johnDoeMovements[0].amount).toEqual(1000);
    expect(johnDoeMovements[0].description).toEqual('Salary');

    expect(johnDoeMovements[2].amount).toEqual(-100);
    expect(johnDoeMovements[2].description).toEqual('Transfer');

    expect(juanPerezMovements.length).toEqual(2);
    expect(juanPerezMovements[0].amount).toEqual(200);
    expect(juanPerezMovements[0].description).toEqual('Transfer');
  });

  it('Money - Get Money debit -300€ (error)', async () => {
    expect(
      controller.getMoney(4806239417031921, 4321, 300, 'CAIXESBB'),
    ).rejects.toThrow('Card blocked.');
  });

  it('Money - Get Money debit -30€ (success)', async () => {
    const result = await controller.getMoney(123456789, 1234, 30, 'DEUTDEDB');
    expect(result.balance).toEqual(1970);
    expect(result.movements.length).toEqual(3);
    expect(result.movements[result.movements.length - 1].amount).toEqual(-30);
  });

  it('Money - Get Money debit -50€ other Bank (success)', async () => {
    const result = await controller.getMoney(123456789, 1234, 50, 'HYVEDEMM');
    expect(result.balance).toEqual(1919);
    expect(result.movements.length).toEqual(4);
    expect(result.movements[result.movements.length - 1].amount).toEqual(-50);
    expect(result.movements[result.movements.length - 1].commission).toEqual(1);
  });

  it('Money - Get Money debit -320€ other Bank (success)', async () => {
    const result = await controller.getMoney(123456789, 1234, 320, 'HYVEDEMM');
    expect(result.balance).toEqual(1592.6);
    expect(result.movements.length).toEqual(5);
    expect(result.movements[result.movements.length - 1].amount).toEqual(-320);
    expect(result.movements[result.movements.length - 1].commission).toEqual(
      6.4,
    );
  });

  it('Money - Get Money credit -400€ (success)', async () => {
    const result = await controller.getMoney(123456788, 4567, 400, 'DEUTDEDB');
    expect(result.balance).toEqual(0);
    expect(result.card.limit).toEqual(700);
    expect(result.movements.length).toEqual(4);
    expect(result.movements[result.movements.length - 1].amount).toEqual(-400);
  });

  it('Money - Get Money credit -500€ (success)', async () => {
    const result = await controller.getMoney(123456788, 4567, 500, 'DEUTDEDB');
    expect(result.balance).toEqual(0);
    expect(result.card.limit).toEqual(200);
    expect(result.movements.length).toEqual(5);
    expect(result.movements[result.movements.length - 1].amount).toEqual(-500);
  });

  it('Money - Get Money credit -150€ (error)', async () => {
    expect(
      controller.getMoney(123456788, 4567, 150, 'DEUTDEDB'),
    ).rejects.toThrow('Daily limit exceeded');
  });

  it('Money - Deposit 300€ (success)', async () => {
    const result = await controller.deposit(123456789, 1234, 300, 'DEUTDEDB');
    expect(result.balance).toEqual(1892.6);
    expect(result.movements.length).toEqual(6);
    expect(result.movements[result.movements.length - 1].amount).toEqual(300);
  });

  it('Money - Deposit 100€ (error)', async () => {
    expect(
      controller.deposit(123456789, 1234, 100, 'HYVEDEMM'),
    ).rejects.toThrow('The deposit is not available for this bank.');
  });

  it('Tranfer - ', async () => {});
});
