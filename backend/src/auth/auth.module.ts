import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { HashingModule } from '../hashing/hashing.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'Простите за задержку, много работы',
      signOptions: { expiresIn: '60m' },
    }),
    UsersModule,
    HashingModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
