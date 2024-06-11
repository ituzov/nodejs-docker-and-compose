import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinTable,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { IsOptional, IsUrl, Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 250 })
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @IsOptional()
  @Length(1, 1500)
  description: string;

  @Column()
  @IsUrl()
  @IsOptional()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
