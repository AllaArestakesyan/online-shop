import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProductSizeModule } from './product_size/product_size.module';
import { OrderModule } from './order/order.module';
import { User } from './user/entities/user.entity';
import { Product } from './product/entities/product.entity';
import { ProductSize } from './product_size/entities/product_size.entity';
import { ProductImagesModule } from './product-images/product-images.module';
import { ProductImage } from './product-images/entities/product-image.entity';
import { WishlistModule } from './wishlist/wishlist.module';
import { Wishlist } from './wishlist/entities/wishlist.entity';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/entities/cart.entity';
import { Order } from './order/entities/order.entity';
import { StripeModule } from './stripe/stripe.module';
import { BrandModule } from './brand/brand.module';
import { Brand } from './brand/entities/brand.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: "root",
      password: "",
      database: "test2",
      entities: [User, Product, ProductSize, ProductImage, Wishlist, Cart, Order, Brand],
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: '...',
          pass: '...',
        },
      },
    }),
    // StripeModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService):Promise<any> => ({
    //     apiKey: configService.get<string>('pk_test_51HWiPKCJWPBoW4PKzJ7ijn7rwOyMwDS85W72lRZvfxlFopZ34FcxT4y4gUpHL0vaKSMYBudrTntFgneRxTSo6ZSd00AkG05TnC'),
    //     options: {
    //       apiVersion: '2020-09-29',
    //     },
    //   }),
    // }),

    
    // StripeModule.forRoot({
    //   apiKey: 'sk_test_51OWwB0JvDs4Tc5XZ2oLGwVOOJNcvj8SfMn81r3GH1l4JqnTbXKZwsLL6Y5o4jVUZFkoiVexBQkKg5dce1FVAQ5On00F76XFefy',
    //   apiVersion: '2023-10-16',
    // }),


    // StripeModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService):any => ({
    //     apiKey: configService.get('sk_test_51OWwB0JvDs4Tc5XZ2oLGwVOOJNcvj8SfMn81r3GH1l4JqnTbXKZwsLL6Y5o4jVUZFkoiVexBQkKg5dce1FVAQ5On00F76XFefy'),
    //     apiVersion: '2023-10-16',
    //   }),
    // }),

    // PaymentModule.forRootAsync(),
    AuthModule,
    UserModule,
    BrandModule,
    CategoryModule,
    ProductModule,
    ProductSizeModule,
    ProductImagesModule,
    WishlistModule,
    CartModule,
    StripeModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
