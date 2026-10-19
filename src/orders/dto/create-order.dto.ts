import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  productId!: string;

  @IsString()
  name!: string;

  @IsNumber()
  @IsPositive({ message: 'Price must be greater than 0' })
  price!: number;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
