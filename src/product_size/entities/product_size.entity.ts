import { Cart } from "src/cart/entities/cart.entity";
import { Order } from "src/order/entities/order.entity";
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

    @Column()
    productId: number;

    @ManyToOne(() => Product, (product) => product.sizes,
        { onDelete: "CASCADE", onUpdate: "CASCADE" })
    product: Product;

    @OneToMany(() => Cart, (cart) => cart.product, { cascade: true })
    cart: Cart[];

    @OneToMany(() => Order, (Order) => Order.product, { cascade: true })
    order: Order[];
}
