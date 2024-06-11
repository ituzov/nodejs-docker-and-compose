import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { FindOfferDto } from './dto/find-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    try {
      const username = req.user.username;
      return await this.offersService.create(createOfferDto, username);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: FindOfferDto): Promise<Offer[]> {
    try {
      return await this.offersService.findMany(query);
    } catch (error) {
      throw new HttpException('Error fetching offers', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Offer> {
    try {
      return await this.offersService.findOne({ id });
    } catch (error) {
      throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateOfferDto: UpdateOfferDto,
  ): Promise<Offer> {
    try {
      const username = req.user.username;
      return await this.offersService.update({ id }, updateOfferDto, username);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number): Promise<void> {
    try {
      const username = req.user.username;
      await this.offersService.remove({ id }, username);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
