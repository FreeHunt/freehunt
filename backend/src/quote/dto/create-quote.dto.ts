import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateQuoteDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  stripeSessionId: string;

  @IsNotEmpty()
  @IsString()
  checkpointId: string;

  @IsOptional()
  @IsString()
  devisLink: string;

  @IsOptional()
  @IsString()
  documentId: string;

  @IsOptional()
  @IsString()
  invoiceId: string;
}
