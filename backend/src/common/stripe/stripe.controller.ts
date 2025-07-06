import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CreateAccountConnectionDto } from './dto/create-account-connection.dto';
import { ActivateCustomerConnectionDto } from './dto/activate-customer-connection.dto';
import { CreateQuoteStripeDto } from './dto/create-quote-stripe.dto';
import { CreateProductStripeDto } from './dto/create-product-stripe.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      console.log('Webhook received');
      await this.stripeService.handleWebhook(req.body as Buffer, signature);
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
    return this.stripeService.createAccountConnection(body);
  }

  @Post('confirm-account-activation')
  async confirmAccountActivation(
    @Body() body: { freelanceId: string; accountId: string },
  ) {
    console.log(
      'Stripe controller - confirm account activation called with:',
      body,
    );
    try {
      const result = await this.stripeService.confirmAccountActivation(
        body.freelanceId,
        body.accountId,
      );
      console.log('Stripe controller - activation result:', result);
      return result;
    } catch (error) {
      console.error('Stripe controller - activation error:', error);
      throw error;
    }
  }

  @Post('activate-account-connection')
  activateAccountConnection(@Body() body: ActivateCustomerConnectionDto) {
    return this.stripeService.activateAccountConnection(body);
  }

  @Post('create-quote')
  async createQuote(@Body() body: CreateQuoteStripeDto) {
    return this.stripeService.createQuote(body);
  }

  @Post('create-product')
  createProduct(@Body() body: CreateProductStripeDto) {
    return this.stripeService.createProduct(body);
  }

  @Get('get-quote-pdf/:quoteId')
  async getQuotePdf(@Param('quoteId') quoteId: string, @Res() res: Response) {
    try {
      const quotePdf = await this.stripeService.getQuotePdf(quoteId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="quote-${quoteId}.pdf"`,
      );

      quotePdf.data.pipe(res);
    } catch (error) {
      res.status(500).json({
        error:
          'Failed to generate PDF ' +
          (error instanceof Error ? error.message : String(error)),
      });
    }
  }

  @Post('preview-transfer-fees')
  previewTransferFees(@Body() body: { amount: number }) {
    return this.stripeService.previewTransferAmount(body.amount);
  }
}
