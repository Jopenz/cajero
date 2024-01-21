import { ApiProperty } from '@nestjs/swagger';

export class MovementsDTO {
  @ApiProperty({
    type: String,
    description: 'Date',
    example: '2021-03-31T21:00:00.000Z',
  })
  date: string;
  @ApiProperty({
    type: Number,
    description: 'Amount',
    example: 1000,
  })
  amount: number;
  @ApiProperty({
    type: String,
    description: 'Description',
    example: 'Deposit',
  })
  description: string;
}

// export class MoneyDTO {
//   @ApiProperty({
//     type: Number,
//     description: 'Amount',
//     example: 1000,
//   })
//   amount: number;
// }
