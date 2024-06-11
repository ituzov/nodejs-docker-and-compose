import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    username: string,
  ): Promise<Wishlist> {
    const user = await this.usersService.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const wishes = await this.wishesService.findMany({
      id: In(createWishlistDto.itemsId),
    });

    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });

    return this.wishlistsRepository.save(wishlist);
  }

  async findOne(query: FindOptionsWhere<Wishlist>): Promise<Wishlist> {
    return await this.wishlistsRepository.findOne({
      where: query,
      relations: ['items', 'owner'],
    });
  }

  async findMany(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({ relations: ['items', 'owner'] });
  }

  async updateOne(
    query: FindOptionsWhere<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(query);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    const updatedItems = await this.wishesService.findMany({
      id: In(updateWishlistDto.itemsId),
    });
    wishlist.items = updatedItems;
    Object.assign(wishlist, updateWishlistDto);
    return this.wishlistsRepository.save(wishlist);
  }

  async removeOne(query: FindOptionsWhere<Wishlist>): Promise<void> {
    const wishlist = await this.findOne(query);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    await this.wishlistsRepository.remove(wishlist);
  }

  async validateWishlistOwner(
    wishlistId: number,
    username: string,
  ): Promise<void> {
    const wishlist = await this.findOne({ id: wishlistId });
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    if (wishlist.owner.username !== username) {
      throw new ForbiddenException(
        'You do not have permission to modify this wishlist',
      );
    }
  }
}
