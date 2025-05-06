import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { DocumentType } from './documentType.dto';
export class CreateDocumentDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the document',
    example: 'John Doe',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'The type of the document',
    example: 'invoice',
  })
  type: DocumentType;

  @IsString()
  @ApiProperty({
    description: 'The URL of the document',
    example: 'https://example.com/invoice.pdf',
  })
  url: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The ID of the user for avatar document',
    example: '123',
  })
  userId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The ID of the freelance',
    example: '123',
  })
  freelanceId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The ID of the invoice',
    example: '123',
  })
  invoiceId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The ID of the quote',
    example: '123',
  })
  quoteId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The ID of the message',
    example: '123',
  })
  messageId: string;
}
