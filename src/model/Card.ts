class Configurations {
  private language: string;
  private currency: string;
  private dailyLimit: number;
}

class Card {
  private number: number;
  private type: string;
  private pin: number;
  private blocked: boolean;
  private configuration: Configurations;

  constructor(
    number: number,
    type: string,
    pin: number,
    blocked: boolean,
    configuration: Configurations,
  ) {
    this.number = number;
    this.type = type;
    this.pin = pin;
    this.blocked = blocked;
    this.configuration = configuration;
  }
}

export { Card, Configurations };
