import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  Param,
  Post,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { plainToInstance } from 'class-transformer';
import { Wish } from '../wishes/entities/wish.entity';
import { FindManyUsersDto } from './dto/find-many-user-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findOwn(@Req() req): Promise<UserPublicProfileResponseDto> {
    try {
      const username = req.user.username;
      const user = await this.usersService.findOnePublic({ username });
      return plainToInstance(UserPublicProfileResponseDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new HttpException('User find error', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPublicProfileResponseDto> {
    try {
      const username = req.user.username;
      const user = await this.usersService.updateOne(
        { username },
        updateUserDto,
      );
      return plainToInstance(UserPublicProfileResponseDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException('User update error', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  async getOwnWishes(@Req() req) {
    try {
      const username = req.user.username;
      return await this.usersService.getWishesByUsername(username);
    } catch (error) {
      throw new HttpException(
        'Error retrieving wishes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async findOne(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    try {
      return await this.usersService.findOnePublic({ username });
    } catch (error) {
      throw new HttpException('User find error', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username/wishes')
  async getWishes(@Param('username') username: string): Promise<Wish[]> {
    try {
      return await this.usersService.getWishesByUsername(username);
    } catch (error) {
      throw new HttpException(
        'Error retrieving wishes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('find')
  async findMany(@Body() findManyUsersDto: FindManyUsersDto) {
    try {
      const query = [
        { username: findManyUsersDto.query },
        { email: findManyUsersDto.query },
      ];
      const users = await this.usersService.findMany(query);
      return users.map((user) =>
        plainToInstance(UserPublicProfileResponseDto, user, {
          excludeExtraneousValues: true,
        }),
      );
    } catch (error) {
      throw new HttpException('Error finding users', HttpStatus.BAD_REQUEST);
    }
  }
}
