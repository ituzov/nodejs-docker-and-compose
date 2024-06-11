import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    try {
      const username = req.user.username;
      return await this.wishesService.create(createWishDto, username);
    } catch (error) {
      throw new HttpException('Error creating wish', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('last')
  async findLast(): Promise<Wish[]> {
    try {
      return await this.wishesService.findLast();
    } catch (error) {
      throw new HttpException(
        'Error fetching last wishes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('top')
  async findTop(): Promise<Wish[]> {
    try {
      return await this.wishesService.findTop();
    } catch (error) {
      throw new HttpException(
        'Error fetching top wishes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wish> {
    try {
      return await this.wishesService.findOne({ id });
    } catch (error) {
      throw new HttpException('Wish not found', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    try {
      const username = req.user.username;
      await this.wishesService.validateWishOwner(id, username);
      return await this.wishesService.updateOne({ id }, updateWishDto);
    } catch (error) {
      throw new HttpException('Error updating wish', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number): Promise<void> {
    try {
      const username = req.user.username;
      await this.wishesService.validateWishOwner(id, username);
      await this.wishesService.validateNoOffers(id);
      await this.wishesService.removeOne({ id });
    } catch (error) {
      throw new HttpException('Error deleting wish', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copyWish(@Req() req, @Param('id') id: number): Promise<Wish> {
    try {
      const username = req.user.username;
      return await this.wishesService.copyWish(id, username);
    } catch (error) {
      throw new HttpException('Error copying wish', HttpStatus.BAD_REQUEST);
    }
  }
}
