import * as bcrypt from 'bcrypt';

export function encript(pin: number) {
  const salt = bcrypt.genSaltSync(process.env.SALT_BCRYPT);
  const hash = bcrypt.hashSync(String(pin), salt);

  return hash;
}

export function compare(pin: number, hash: string) {
  const result = bcrypt.compareSync(String(pin), hash);

  return result;
}
