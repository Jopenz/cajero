import { TestBed } from '@automock/jest';

import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Database } from '../database/database.service';
import * as data from '../database/database.json';

describe('ClientController', () => {
  let controller: ClientController;
  let service: ClientService;
  let database: jest.Mocked<Database>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ClientService).compile();

    service = unit;
    database = unitRef.get(Database);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [{ provide: ClientService, useValue: unit }],
    }).compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Clients - Get Client by Credit card number & pin', async () => {
    database.getClients.mockResolvedValue(data.clients);
    const client = await controller.getClient(123456789, 1234);

    expect(database.getClients).toHaveBeenCalled();
    expect(client.id).toEqual(1);
    expect(client.name).toEqual('John Doe');
    expect(2).toEqual(client.cards.length);
  });

  it('Clients - Get Client by IBAN', async () => {
    database.getClients.mockResolvedValue(data.clients);
    const client = await controller.getClientByIban('DE89370400440532013000');

    expect(database.getClients).toHaveBeenCalled();
    expect(client.id).toEqual(1);
    expect(client.name).toEqual('John Doe');
    expect(2).toEqual(client.cards.length);
  });
});
