import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStripeDto } from './create-stripe.dto';

export class UpdateStripeDto extends PartialType(CreateStripeDto) { }

export class PaymentDto {

    @ApiProperty()
    amount: number
    @ApiProperty()
    currency: string
    @ApiProperty()
    source: string

}