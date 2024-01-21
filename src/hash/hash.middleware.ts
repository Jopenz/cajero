import { Injectable, NestMiddleware } from '@nestjs/common';
import { encript } from '../commons';

@Injectable()
export class HashMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (!req.body.pin) return next();

    req.body.pin = encript(req.body.pin);

    next();
  }
}
