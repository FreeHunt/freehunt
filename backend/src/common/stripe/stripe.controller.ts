import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CreateAccountConnectionDto } from './dto/create-account-connection.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('webhook')
  handleWebhook(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      console.log('Webhook received');
      this.stripeService.handleWebhook(req.body as Buffer, signature);
      res.status(200).send({ message: 'Webhook received' });
    } catch (error) {
      console.error(
        'Webhook Error:',
        error instanceof Error ? error.message : String(error),
      );
      res
        .status(400)
        .send(
          `Webhook Error: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
  }

  @Post('create-checkout-session')
  createCheckoutSession(@Body() body: CreateCheckoutSessionDto) {
    return this.stripeService.createCheckoutSession(body);
  }

  @Post('create-account-connection')
  async createAccountConnection(@Body() body: CreateAccountConnectionDto) {
    // check if the account connection already exists
    const existingAccountConnection =
      await this.stripeService.getAccountConnection(body.freelanceId);
    if (existingAccountConnection) {
      throw new BadRequestException('Account connection already exists');
    }
    const accountConnection =
      await this.stripeService.createAccountConnection(body);
    return accountConnection;
  }
}
