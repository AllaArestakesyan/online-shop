import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto {
    @ApiProperty()
    quantity:number
}
