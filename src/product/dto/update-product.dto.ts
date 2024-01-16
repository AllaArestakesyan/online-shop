import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

class Size {
    @ApiProperty()
    size: string;
    @ApiProperty()
    count: number
}
export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty()
    name: string;

    @ApiProperty()
    quantityResultsPurchases: number;

    @ApiProperty()
    priceForSimplePurchase: string;

    @ApiProperty()
    priceForWholesalePurchase: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    brand: number;

    @ApiProperty()
    style: string;

    @ApiProperty()
    weather: string;

    @ApiProperty()
    material: string;
    
    @ApiProperty()
    category: number;

    @ApiProperty()
    colors: string[];

    @ApiProperty({type:[Size]})
    sizes: Size[];
}