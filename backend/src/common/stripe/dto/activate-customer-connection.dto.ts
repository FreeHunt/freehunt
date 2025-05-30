import { IsString } from 'class-validator';

export class ActivateCustomerConnectionDto {
  @IsString()
  accountId: string;

  @IsString()
  refreshUrl: string;

  @IsString()
  returnUrl: string;
}
