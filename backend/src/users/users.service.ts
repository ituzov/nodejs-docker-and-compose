import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { FindUsersDto } from './dto/find-users-dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (existingUser) {
      throw new ConflictException(
        'User with this username or email already exists',
      );
    }
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findOne(query: FindUsersDto): Promise<User> {
    return await this.usersRepository.findOne({ where: query });
  }

  async findMany(query: FindOptionsWhere<User>[]): Promise<User[]> {
    return this.usersRepository.find({ where: query });
  }

  async updateOne(
    query: FindUsersDto,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: updateUserDto.username, id: Not(user.id) },
        { email: updateUserDto.email, id: Not(user.id) },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this username or email already exists',
      );
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);
    delete updatedUser.password;
    return updatedUser;
  }

  async removeOne(query: FindUsersDto): Promise<void> {
    const user = await this.findOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.remove(user);
  }

  async findOnePublic(
    query: FindUsersDto,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.findOne(query);
    return plainToInstance(UserPublicProfileResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async getWishesByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.wishes;
  }
}
