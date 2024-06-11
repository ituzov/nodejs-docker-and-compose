import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Offer } from '../offers/entities/offer.entity';
import { UsersService } from '../users/users.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { FindWishDto } from './dto/find-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { of } from 'rxjs';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>,
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
    private readonly usersService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, username: string): Promise<Wish> {
    const user = await this.usersService.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
      raised: 0,
      copied: 0,
      offers: [],
    });

    return this.wishesRepository.save(wish);
  }

  async findOne(query: FindWishDto): Promise<Wish> {
    return this.wishesRepository.findOne({
      where: query,
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  async findMany(query: FindOptionsWhere<Wish>): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: query,
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  async updateOne(
    query: FindWishDto,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.findOne(query);
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    Object.assign(wish, updateWishDto);
    return this.wishesRepository.save(wish);
  }

  async removeOne(query: FindWishDto): Promise<void> {
    const wish = await this.findOne(query);
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    await this.offersRepository.delete({ item: wish });
    await this.wishesRepository.remove(wish);
  }

  async validateWishOwner(wishId: number, username: string): Promise<void> {
    const wish = await this.findOne({ id: wishId });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    if (wish.owner.username !== username) {
      throw new ForbiddenException(
        'You do not have permission to modify this wish',
      );
    }
  }

  async findLast(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  async findTop(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: 10,
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  async copyWish(id: number, username: string): Promise<Wish> {
    const originalWish = await this.findOne({ id });
    if (!originalWish) {
      throw new NotFoundException('Wish not found');
    }

    const user = await this.usersService.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const copiedWish = this.wishesRepository.create({
      name: originalWish.name,
      link: originalWish.link,
      image: originalWish.image,
      price: originalWish.price,
      description: originalWish.description,
      owner: user,
      raised: 0,
      copied: 0,
      offers: [],
    });

    originalWish.copied += 1;
    await this.wishesRepository.save(originalWish);

    return this.wishesRepository.save(copiedWish);
  }

  async updateRaisedAmount(wishId: number): Promise<void> {
    const wish = await this.findOne({ id: wishId });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    const offers = await this.offersRepository.find({
      where: { item: { id: wishId } },
    });
    console.log(offers);
    wish.raised = offers.reduce((sum, offer) => sum + Number(offer.amount), 0);
    await this.wishesRepository.save(wish);
  }

  async validateNoOffers(wishId: number): Promise<void> {
    const wish = await this.findOne({ id: wishId });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    const offersCount = await this.offersRepository.count({
      where: { item: wish },
    });
    if (offersCount > 0) {
      throw new ForbiddenException('Cannot delete wish with existing offers');
    }
  }
}
