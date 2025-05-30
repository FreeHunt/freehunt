import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductStripeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
