import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { FindWishlistDto } from './dto/find-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(@Req() req): Promise<Wishlist[]> {
    try {
      return await this.wishlistsService.findMany();
    } catch (error) {
      throw new HttpException(
        'Error fetching wishlists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    try {
      const username = req.user.username;
      return await this.wishlistsService.create(createWishlistDto, username);
    } catch (error) {
      throw new HttpException(
        'Error creating wishlist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wishlist> {
    try {
      return await this.wishlistsService.findOne({ id });
    } catch (error) {
      throw new HttpException(
        'Error fetching wishlist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    try {
      const username = req.user.username;
      await this.wishlistsService.validateWishlistOwner(id, username);
      return await this.wishlistsService.updateOne({ id }, updateWishlistDto);
    } catch (error) {
      throw new HttpException(
        'Error updating wishlist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number): Promise<Wishlist> {
    try {
      const username = req.user.username;
      await this.wishlistsService.validateWishlistOwner(id, username);
      const wishlist = await this.wishlistsService.findOne({ id });
      await this.wishlistsService.removeOne({ id });
      return wishlist;
    } catch (error) {
      throw new HttpException(
        'Error removing wishlist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
