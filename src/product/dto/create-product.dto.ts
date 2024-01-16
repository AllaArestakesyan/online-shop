import { ApiProperty } from "@nestjs/swagger";
import { CreateProductSizeDto } from "src/product_size/dto/create-product_size.dto";

class Size {
    size: string;
    count: number
}
export class CreateProductDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    brand: number;

    @ApiProperty()
    category: number;
    
    @ApiProperty()
    colors: string[];

    @ApiProperty()
    sizes:Size[];
}
