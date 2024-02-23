import { Category } from 'src/category/entities/category.entity';
import { ProductImage } from 'src/product-images/entities/product-image.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductSize } from 'src/product_size/entities/product_size.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Product, (product) => product.cart,
        { onDelete: "CASCADE", onUpdate: "CASCADE" })
    product: Product;

    @ManyToOne(() => User, (user) => user.cart,
        { onDelete: "CASCADE", onUpdate: "CASCADE" })
    user: User;
    @ManyToOne(() => ProductSize, (size) => size.cart,
        { onDelete: "CASCADE", onUpdate: "CASCADE" })
    size: ProductSize;
}