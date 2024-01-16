import { ApiProperty } from "@nestjs/swagger";

export class CreateCartDto {
    @ApiProperty()
    productId:number
    @ApiProperty()
    quantity:number
    @ApiProperty()
    sizeId:number
}
