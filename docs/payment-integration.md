# Payment Integration with Viva.com

This document describes the integration of Viva.com as a payment provider for the Dutch Seed Supply webshop.

## Overview

The integration uses Viva.com's Smart Checkout solution, which provides a secure and user-friendly payment experience. The payment flow consists of the following steps:

1. Customer fills in their details and selects a payment method
2. A payment is created via the Viva.com API
3. Customer is redirected to the Viva.com Smart Checkout page
4. After payment, customer is redirected back to the success or failure page
5. Viva.com sends a webhook notification to confirm the payment status

## Implementation Details

### Backend Components

- **Payment Library**: `lib/payment/viva.ts` - Handles interactions with the Viva.com API
- **API Routes**:
  - `app/api/payments/create/route.ts` - Creates a payment and redirects to Viva.com
  - `app/api/payments/webhook/route.ts` - Handles webhook notifications from Viva.com
- **Database**: The `orders` table stores order and payment information

### Frontend Components

- **Checkout Page**: `app/checkout/page.tsx` - Displays the checkout form
- **Checkout Form**: `components/checkout/CheckoutForm.tsx` - Collects customer details and initiates payment
- **Payment Method Selector**: `components/checkout/PaymentMethodSelector.tsx` - Allows customers to select a payment method
- **Success Page**: `app/checkout/success/page.tsx` - Displayed after successful payment
- **Failure Page**: `app/checkout/failure/page.tsx` - Displayed after failed payment

### Admin Components

- **Payment Management**: `app/admin/payments/page.tsx` - Lists all payments
- **Payment Details**: `app/admin/payments/[id]/page.tsx` - Shows details of a specific payment

## Configuration

The Viva.com API credentials are stored in the `.env.local` file:

```
VIVA_MERCHANT_ID=your_merchant_id
VIVA_API_KEY=your_api_key
VIVA_CLIENT_ID=your_client_id
VIVA_CLIENT_SECRET=your_client_secret
```

## Payment Methods

The integration supports different payment methods based on the customer's region:

- **Netherlands (.nl)**: iDEAL, Credit Card, Bancontact
- **Germany (.de)**: SOFORT, Giropay, Credit Card
- **France (.fr)**: Carte Bancaire, Credit Card
- **International (.com)**: Credit Card, PayPal

## Webhook Integration

Viva.com sends webhook notifications to confirm payment status. The webhook endpoint is:

```
https://your-domain.com/api/payments/webhook
```

This endpoint should be configured in the Viva.com dashboard.

## Testing

For testing, use the Viva.com demo environment and test cards. The demo environment is automatically used when the application is running in development mode.

## Refunds

Refunds cannot be processed automatically. Customers must contact customer support to request a refund. Administrators can then process the refund through the Viva.com dashboard.

## Going Live

To go live with the payment integration:

1. Update the Viva.com API credentials in the `.env.local` file
2. Update the webhook URL in the Viva.com dashboard
3. Test the payment flow with real payment methods
4. Monitor the first few payments to ensure everything is working correctly

## Next.js 15 Compatibility

This integration has been updated to be compatible with Next.js 15, which makes dynamic APIs like `params` and `searchParams` asynchronous. The following changes were made:

1. In dynamic route pages (e.g., `[id]`), we now await the `params` object before accessing its properties:

```typescript
export default async function SomePage({
  params,
}: {
  params: { id: string };
}) {
  // Await params to access its properties
  const { id } = await params;
  
  // Use id to fetch data
  // ...
}
```

2. In pages that use `searchParams`, we now await the object before accessing its properties:

```typescript
export default async function SomePage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  // Await searchParams to access its properties
  const { query } = await searchParams;
  
  // Use query to filter data
  // ...
}
```

These changes ensure that the application will continue to work correctly with future versions of Next.js.
