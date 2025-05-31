// user-output.dto.ts
import { Exclude, Expose } from 'class-transformer';

export class UserOutputDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string; // garante que a senha nunca saia no JSON

  constructor(partial: Partial<UserOutputDto>) {
    Object.assign(this, partial);
  }
}
