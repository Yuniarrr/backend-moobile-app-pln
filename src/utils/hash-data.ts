/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(12);

export function hashData(password: string) {
  return bcrypt.hashSync(password, salt);
}
