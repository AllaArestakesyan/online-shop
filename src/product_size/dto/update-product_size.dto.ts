import { PartialType } from '@nestjs/swagger';
import { CreateProductSizeDto } from './create-product_size.dto';

export class UpdateProductSizeDto extends PartialType(CreateProductSizeDto) {}
