import { Controller, Get, Param } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './client.interface';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get('clients')
  async getClient(
    @Param('cardNumber') cardNumber: number,
    @Param('pin') pin: number,
  ): Promise<Client> {
    const client = await this.clientService.getClient(cardNumber, pin);
    return Promise.resolve(client);
  }

  @Get('clients/:iban')
  async getClientByIban(@Param('iban') iban: string): Promise<Client> {
    const client = await this.clientService.getClientByIban(iban);
    return Promise.resolve(client);
  }
}
