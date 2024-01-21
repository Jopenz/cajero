import { TestBed } from '@automock/jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card } from './card.interface';
import { Database } from '../database/database.service';
import * as data from '../database/database.json';
import { Client } from '../client/client.interface';
import { ClientService } from '../client/client.service';

describe('CardController', () => {
  let controller: CardController;
  let databaseClient: jest.Mocked<Database>;

  beforeEach(async () => {
    const mockClients: Client[] = data.clients;

    const clientService = TestBed.create(ClientService).compile();
    const cardService = TestBed.create(CardService).compile();
    databaseClient = clientService.unitRef.get(Database);
    databaseClient.getClients.mockResolvedValue(mockClients);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        { provide: ClientService, useValue: clientService.unit },
        { provide: CardService, useValue: cardService.unitRef },
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Card - Change Pin card not active (error)', async () => {
    const card: Card = await controller.changePin(4806239417031921, 1111, 4321);
    expect(databaseClient.getClients).toHaveBeenCalled();
    expect(card.pin).toEqual(1111);
  });

  it('Card - Active', async () => {
    const card: Card = await controller.block(4806239417031921, 4321);
    expect(databaseClient.getClients).toHaveBeenCalled();
    expect(card.blocked).toEqual(true);
  });

  it('Card - Inactive', async () => {
    const card: Card = await controller.unblock(4806239417031921, 4321);
    expect(databaseClient.getClients).toHaveBeenCalled();
    expect(card.blocked).toEqual(false);
  });

  it('Card - Active', async () => {
    const card: Card = await controller.block(4806239417031921, 4321);
    expect(databaseClient.getClients).toHaveBeenCalled();
    expect(card.blocked).toEqual(true);
  });

  it('Card - Change Pin', async () => {
    const card: Card = await controller.changePin(4806239417031921, 1111, 4321);
    expect(databaseClient.getClients).toHaveBeenCalled();
    expect(card.pin).toEqual(1111);
  });

  it('Card - Configuration', async () => {
    const card: Card = await controller.configuration(4806239417031921, {
      dailyLimit: 1000,
    });
    expect(databaseClient.getClients).toHaveBeenCalled();
    expect(card.configuration.dailyLimit).toEqual(1000);
  });

  it('Card - Configuration', async () => {
    expect(
      controller.configuration(4806239417031921, {
        dailyLimit: 7000,
      }),
    ).rejects.toThrow('Daily limit exceeded.');
  });
});
