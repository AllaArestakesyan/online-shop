import { Cart } from "src/cart/entities/cart.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductSize {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    size: string;

    @Column()
    count: number;

    @ManyToOne(() => Product, (product) => product.sizes,
        { onDelete: "CASCADE", onUpdate: "CASCADE" })
    product: Product;

    @OneToMany(() => Cart, (cart) => cart.product, { cascade: true })
    cart: Cart[];
}
