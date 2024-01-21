import { ApiProperty } from '@nestjs/swagger';
import { Configurations } from './card.interface';

export class ConfigurationsDTO implements Configurations {
  @ApiProperty({
    type: String,
    description: 'System language',
    example: 'en',
  })
  language?: string;
  @ApiProperty({
    type: String,
    description: 'Card currency',
    example: '€',
  })
  currency?: string;
  @ApiProperty({
    type: Number,
    description: 'Daily limit',
    example: 3000,
  })
  dailyLimit?: number;
}
