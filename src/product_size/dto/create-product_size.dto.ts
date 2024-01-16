import { ApiProperty } from "@nestjs/swagger";

export class CreateProductSizeDto {
    @ApiProperty()
    size: string;

    @ApiProperty()
    count: number;
}

