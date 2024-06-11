import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';
import { SigninUserResponseDto } from './dto/signin-user-response.dto';
import { Request } from 'express';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SignupUserResponseDto> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() req: Request): Promise<SigninUserResponseDto> {
    return this.authService.login(req.user);
  }
}
