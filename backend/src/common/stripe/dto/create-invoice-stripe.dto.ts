export class CreateInvoiceStripeDto {
  customerId: string;
  projectId: string;
  amount: number;
  description: string;
  checkpointName: string;
  tax: number;
  currency: string;
  invoiceId: string;
}
