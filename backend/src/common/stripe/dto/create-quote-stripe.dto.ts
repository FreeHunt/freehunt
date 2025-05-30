import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuoteStripeDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  projectId: string;
}
