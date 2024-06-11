import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  async create(
    createOfferDto: CreateOfferDto,
    username: string,
  ): Promise<Offer> {
    const wish = await this.wishesService.findOne({
      id: createOfferDto.itemId,
    });
    if (!wish) {
      throw new NotFoundException(
        `Wish with id ${createOfferDto.itemId} not found`,
      );
    }

    if (wish.owner.username === username) {
      throw new ForbiddenException('You cannot contribute to your own wish');
    }

    const totalContributed = Number(wish.raised) + createOfferDto.amount;
    if (totalContributed > wish.price) {
      throw new ForbiddenException(
        'Cannot contribute more than the remaining amount',
      );
    }

    const user = await this.usersService.findOne({ username });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const offer = this.offersRepository.create({
      ...createOfferDto,
      item: wish,
      user,
    });

    const savedOffer = await this.offersRepository.save(offer);
    await this.wishesService.updateRaisedAmount(createOfferDto.itemId);
    return savedOffer;
  }

  async findOne(query: FindOptionsWhere<Offer>): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: query,
      relations: ['item', 'user'],
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    return offer;
  }

  async findMany(query: FindOptionsWhere<Offer>): Promise<Offer[]> {
    return this.offersRepository.find({
      where: query,
      relations: ['item', 'user'],
    });
  }

  async update(
    query: FindOptionsWhere<Offer>,
    updateOfferDto: UpdateOfferDto,
    username: string,
  ): Promise<Offer> {
    const offer = await this.findOne(query);
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.user.username !== username) {
      throw new ForbiddenException("You cannot edit someone else's offer");
    }

    Object.assign(offer, updateOfferDto);
    return this.offersRepository.save(offer);
  }

  async remove(
    query: FindOptionsWhere<Offer>,
    username: string,
  ): Promise<void> {
    const offer = await this.findOne(query);
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.user.username !== username) {
      throw new ForbiddenException("You cannot delete someone else's offer");
    }

    const wish = offer.item;
    await this.offersRepository.remove(offer);
    await this.wishesService.updateRaisedAmount(wish.id);
  }
}
