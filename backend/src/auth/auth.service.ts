import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from '../hashing/hashing.service';
import { SigninUserResponseDto } from './dto/signin-user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashingService: HashingService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ username });
    if (
      user &&
      (await this.hashingService.comparePassword(password, user.password))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  async login(user: any): Promise<SigninUserResponseDto> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<SignupUserResponseDto> {
    const hashedPassword = await this.hashingService.hashPassword(
      createUserDto.password,
    );
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      about: newUser.about,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };
  }
}
