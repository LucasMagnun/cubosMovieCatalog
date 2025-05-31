import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hashPassword } from 'src/utils/hash';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRepository } from './repository/user.repository';
import { UserOutputDto } from './dtos/user-output.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async create(dto: CreateUserDto): Promise<{ access_token: string }> {
    const emailExists = await this.userRepository.findByEmail(dto.email);
    dto.role = 'USER';
    if (emailExists) {
      throw new BadRequestException(`Email ${dto.email} already in use`);
    }

    const passwordHash = await hashPassword(dto.password);
    dto.password = passwordHash;

    const user = await this.userRepository.create(dto);

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user)
      throw new NotFoundException(`User with email ${dto.email} not found`);
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.findByEmail(dto.email);
      if (emailExists) {
        throw new BadRequestException(`Email ${dto.email} already in use`);
      }
    }
    return await this.userRepository.update(id, dto);
  }

  async findAll(): Promise<UserOutputDto[]> {
    const users = await this.userRepository.findAll();
    return plainToInstance(UserOutputDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findOne(id: string): Promise<UserOutputDto | null> {
    const user = await this.userRepository.findOne(id);
    if (!user) return null;

    return plainToInstance(UserOutputDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string) {
    return await this.userRepository.delete(id);
  }
}
