import * as bcrypt from 'bcrypt';
export function passwordEncrypt(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function validatePassword(password: string, hash: string): boolean {
  console.log(password, hash)
  return bcrypt.compareSync(password, hash);
}
