import { TestBed } from '@automock/jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card } from './card.interface';

describe('CardController', () => {
  let controller: CardController;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(CardService).compile();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
    }).compile();

    controller = module.get<CardController>(CardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should retrieve cats from the database', async () => {
    const mockCats: Card[] = [
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
    ];
  });
});
