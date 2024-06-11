import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { UsersModule } from '../users/users.module';
import { Offer } from '../offers/entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, Offer]), UsersModule],
  providers: [WishesService],
  controllers: [WishesController],
  exports: [WishesService, TypeOrmModule],
})
export class WishesModule {}
