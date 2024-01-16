import { Category } from 'src/category/entities/category.entity';
import { ProductImage } from 'src/product-images/entities/product-image.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductSize } from 'src/product_size/entities/product_size.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @Column()
    size: string;

    @Column()
    price: number;

    @ManyToOne(() => Product, (product) => product.order,
        { onDelete: "SET NULL", onUpdate: "SET NULL" })
    product: Product;

    @ManyToOne(() => User, (user) => user.order,
        { onDelete: "CASCADE", onUpdate: "CASCADE" })
    user: User;
}