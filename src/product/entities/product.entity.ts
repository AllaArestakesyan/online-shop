import { Brand } from 'src/brand/entities/brand.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity';
import { ProductImage } from 'src/product-images/entities/product-image.entity';
import { ProductSize } from 'src/product_size/entities/product_size.entity';
import { User } from 'src/user/entities/user.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    description: string;


    @ManyToOne(() => Brand, (brand) => brand.products,
        { onDelete: "CASCADE", onUpdate: "CASCADE" })
    brand: Brand;


    @ManyToOne(() => Category, (category) => category.products,
        { onDelete: "CASCADE", onUpdate: "CASCADE" })
    category: Category;

    @OneToMany(() => ProductSize, (size) => size.product, { cascade: true })
    sizes: ProductSize[];

    @OneToMany(() => ProductImage, (imageProduct) => imageProduct.product, { cascade: true })
    images: ProductImage[];

    @OneToMany(() => Wishlist, (wish) => wish.product, { cascade: true })
    wishlist: Wishlist[];

    @OneToMany(() => Cart, (cart) => cart.product, { cascade: true })
    cart: Cart[];

    @OneToMany(() => Order, (order) => order.product)
    order: Order[];

}