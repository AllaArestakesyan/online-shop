import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../role/enum.role';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone_number: string;

  @Column()
  role: Role;

  @Column({ default: "user.png" })
  pic_url: string;

  @Column()
  emailToken: string;

  @Column({default:null})
  code: number;

  @Column({ default: 0 })
  isVerified: number;

  @OneToMany(() => Wishlist, (wish) => wish.product, { cascade: true })
  wishlist: Wishlist[];

  @OneToMany(() => Cart, (cart) => cart.product, { cascade: true })
  cart: Cart[];

  @OneToMany(() => Order, (order) => order.product, { cascade: true })
  order: Order[];
}

