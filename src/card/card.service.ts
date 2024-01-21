import { Injectable } from '@nestjs/common';
import { Card, Configurations } from './card.interface';
import { ClientService } from '../client/client.service';
import { merge } from 'lodash';
import { compare, encript } from '../commons';

@Injectable()
export class CardService {
  constructor(private clientService: ClientService) {}

  getCards(): Promise<Card[]> {
    return Promise.resolve([]);
  }

  async findCard(cardNumber: number): Promise<Card> {
    const clients = await this.clientService.getClients();

    const client = clients.find((client) =>
      client.cards.find((card) => card.number == cardNumber),
    );

    if (!client) {
      throw new Error('Client not found');
    }

    const card = client.cards.find((card) => card.number == cardNumber);

    return Promise.resolve(card);
  }

  async blockCard(cardNumber: number, pin: number): Promise<Card> {
    const client = await this.clientService.getClient(cardNumber, pin);

    if (!client) {
      throw new Error('Client not found');
    }

    const card = client.cards.find((card) => card.number == cardNumber);

    if (card.blocked) {
      throw new Error('Card blocked.');
    }

    card.blocked = true;

    return Promise.resolve(card);
  }

  async unblockCard(cardNumber: number, pin: number): Promise<Card> {
    const client = await this.clientService.getClient(cardNumber, pin);

    if (!client) {
      throw new Error('Client not found');
    }

    const card = client.cards.find((card) => card.number == cardNumber);

    if (!card.blocked) {
      throw new Error('Card not blocked.');
    }

    card.blocked = false;

    return Promise.resolve(card);
  }

  async changePin(
    cardNumber: number,
    newPin: number,
    oldPin: number,
  ): Promise<Card> {
    const client = await this.clientService.getClient(cardNumber, oldPin);

    if (!client) {
      throw new Error('Client not found');
    }

    const card = client.cards.find((card) => card.number == cardNumber);

    if (compare(newPin, String(card.pin))) {
      throw new Error('New pin not valid.');
    }

    if (card.pin == encript(newPin)) {
      throw new Error('New pin not valid.');
    }

    if (card.blocked) {
      throw new Error('Card blocked.');
    }

    card.pin = newPin;

    return Promise.resolve(card);
  }

  async configuration(
    cardNumber: number,
    pin: number,
    config: Configurations,
  ): Promise<Card> {
    const clients = await this.clientService.getClients();

    const client = clients.find((client) =>
      client.cards.find((card) => card.number == cardNumber),
    );

    if (!client) {
      throw new Error('Client not found');
    }

    const card = client.cards.find((card) => card.number == cardNumber);

    if (card.blocked) {
      throw new Error('Card blocked.');
    }

    if (
      (config.dailyLimit && config.dailyLimit > 6000) ||
      config.dailyLimit < 500
    ) {
      throw new Error('Daily limit not allowed.');
    }

    card.configuration = merge(card.configuration, config);

    return Promise.resolve(card);
  }
}
