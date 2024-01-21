import { get, cloneDeep } from 'lodash';
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
    const clientService = TestBed.create(ClientService).compile();
    database = clientService.unitRef.get(Database);

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
    const mockAClients: Client[] = data.clients;
    database.getClients.mockResolvedValue(mockAClients);
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

  it('Money - Get Money', async () => {
    const mockAClients: Client[] = data.clients;
    database.getClients.mockResolvedValue(mockAClients);

    const newAccount = await controller.getMoney(123456789, 1234, 30);

    expect(database.getClients).toHaveBeenCalled();
    expect(newAccount.balance).toEqual(1970);
    expect(newAccount.movements.length).toEqual(3);
    expect(
      newAccount.movements[newAccount.movements.length - 1].amount,
    ).toEqual(-30);
  });
});
