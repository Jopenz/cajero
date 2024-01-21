import { TestBed } from '@automock/jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Database } from '../database/database.service';
import * as data from '../database/database.json';
import { ClientService } from '../client/client.service';
import { Client } from '../client/client.interface';

describe('AccountController', () => {
  let controller: AccountController;
  let database: jest.Mocked<Database>;

  beforeEach(async () => {
    const mockAClients: Client[] = data.clients;
    const clientService = TestBed.create(ClientService).compile();
    database = clientService.unitRef.get(Database);
    database.getClients.mockResolvedValue(mockAClients);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        { provide: ClientService, useValue: clientService.unit },
        AccountService,
      ],
    }).compile();
    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Movements - Get Movements', async () => {
    const johnDoeMovements = await controller.getMovements(
      'DE89370400440532013000',
    );
    const juanPerezMovements = await controller.getMovements(
      'DE89370400440532013002',
    );
    expect(database.getClients).toHaveBeenCalled();
    expect(johnDoeMovements.length).toEqual(3);
    expect(johnDoeMovements[0].amount).toEqual(1000);
    expect(johnDoeMovements[0].description).toEqual('Salary');
    expect(johnDoeMovements[2].amount).toEqual(-100);
    expect(johnDoeMovements[2].description).toEqual('Transfer');

    expect(juanPerezMovements.length).toEqual(2);
    expect(juanPerezMovements[0].amount).toEqual(200);
    expect(juanPerezMovements[0].description).toEqual('Transfer');
  });

  it('Money - Get Money debit -30€ (success)', async () => {
    const result = await controller.getMoney(123456789, 1234, 30);
    expect(result.balance).toEqual(1970);
    expect(result.movements.length).toEqual(3);
    expect(result.movements[result.movements.length - 1].amount).toEqual(-30);
  });

  it('Money - Get Money credit -400€ (success)', async () => {
    const result = await controller.getMoney(123456788, 4567, 400);
    expect(result.balance).toEqual(0);
    expect(result.card.limit).toEqual(700);
    expect(result.movements.length).toEqual(4);
    expect(result.movements[result.movements.length - 1].amount).toEqual(-400);
  });

  it('Money - Get Money credit -500€ (success)', async () => {
    const result = await controller.getMoney(123456788, 4567, 500);
    expect(result.balance).toEqual(0);
    expect(result.card.limit).toEqual(200);
    expect(result.movements.length).toEqual(5);
    expect(result.movements[result.movements.length - 1].amount).toEqual(-500);
  });

  it('Money - Get Money credit -150€ (error)', async () => {
    expect(controller.getMoney(123456788, 4567, 150)).rejects.toThrow(
      'Daily limit exceeded',
    );
  });

  it('Money - Deposit 300€ (success)', async () => {
    const result = await controller.deposit(123456789, 1234, 300);
    expect(result.balance).toEqual(2270);
    expect(result.movements.length).toEqual(4);
    expect(result.movements[result.movements.length - 1].amount).toEqual(300);
  });
});
