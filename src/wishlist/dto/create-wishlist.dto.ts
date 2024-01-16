import { ApiProperty } from "@nestjs/swagger";

export class CreateWishlistDto {
    @ApiProperty()
    productId:number
}