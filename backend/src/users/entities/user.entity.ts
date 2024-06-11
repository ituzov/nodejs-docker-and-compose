import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе', length: 200 })
  @IsOptional()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Length(6, 100)
  @Exclude()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
