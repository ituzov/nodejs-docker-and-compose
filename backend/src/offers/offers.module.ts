import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { UsersModule } from '../users/users.module';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), UsersModule, WishesModule],
  providers: [OffersService],
  controllers: [OffersController],
  exports: [OffersService],
})
export class OffersModule {}
