import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

export async function hashPassword(rawPassword: string): Promise<string> {
  return bcrypt.hash(rawPassword, SALT_ROUNDS);
}

export async function comparePassword(
  rawPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(rawPassword, hashedPassword);
}