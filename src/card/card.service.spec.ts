import { Test, TestingModule } from '@nestjs/testing';
import { CardService, Database } from './card.service';
import { TestBed } from '@automock/jest';
import { Card } from './card.interface';
import { Logger } from '@nestjs/common';

describe('Card Service Unit Test', () => {
  let logger: jest.Mocked<Logger>;
  let service: CardService;
  let database: jest.Mocked<Database>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(CardService).compile();

    service = unitRef.get(CardService);
    database = unitRef.get(Database);
  });

  it('should be defined', async () => {
    const mockCard: Card[] = [
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
    database.getCards.mockResolvedValue(mockCard);

    const cats = await service.getCards();
    expect(logger.log).toHaveBeenCalledWith('Fetching all cards..');
    expect(database.getCards).toHaveBeenCalled();
    expect(cats).toEqual(mockCard);
  });
});
