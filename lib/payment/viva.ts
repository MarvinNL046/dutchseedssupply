import axios from 'axios';

// Demo URLs and credentials
const VIVA_API_URL = 'https://demo-api.vivapayments.com/checkout/v2/orders';
const VIVA_CHECKOUT_URL = 'https://demo.vivapayments.com/web/checkout';
// Merchant ID is used for reference but not directly in API calls with OAuth2
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VIVA_MERCHANT_ID = process.env.VIVA_MERCHANT_ID || '5b296a4b-a929-4190-9f17-c1c0097d96c8';
// API Key is kept for potential Basic Auth fallback if needed
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VIVA_API_KEY = process.env.VIVA_API_KEY || 'PR9{>&';
const VIVA_CLIENT_ID = process.env.VIVA_CLIENT_ID || 'wirjs7qj662kp127cxiwv7vazr0ju86b0mc4bwe1ja8y0.apps.vivapayments.com';
const VIVA_CLIENT_SECRET = process.env.VIVA_CLIENT_SECRET || '29HiNX7m0B9mNXD12Zd0zuD825ztdH';

// Helper function to determine the appropriate payment methods based on domain
export function getPaymentMethodsForDomain(domainId: string) {
  switch (domainId) {
    case 'nl':
      return [
        { id: 31, name: 'iDEAL' },
        { id: 0, name: 'Credit Card' },
        { id: 32, name: 'Bancontact' }
      ];
    case 'de':
      return [
        { id: 20, name: 'SOFORT' },
        { id: 21, name: 'Giropay' },
        { id: 0, name: 'Credit Card' }
      ];
    case 'fr':
      return [
        { id: 0, name: 'Carte Bancaire' },
        { id: 15, name: 'Credit Card' }
      ];
    default: // .com
      return [
        { id: 0, name: 'Credit Card' },
        { id: 10, name: 'PayPal' }
      ];
  }
}

// Function to get an access token using client credentials
async function getAccessToken() {
  try {
    const response = await axios.post(
      'https://demo-accounts.vivapayments.com/connect/token',
      'grant_type=client_credentials&scope=payments:create',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: VIVA_CLIENT_ID,
          password: VIVA_CLIENT_SECRET
        }
      }
    );
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Viva access token:', error);
    throw new Error('Failed to authenticate with Viva API');
  }
}

// Function to create a payment
export async function createPayment({
  amount,
  customerEmail,
  customerName,
  orderCode,
  domainId, // Used for potential domain-specific logic
  preferredMethod
}: {
  amount: number;
  customerEmail: string;
  customerName: string;
  orderCode: string;
  domainId: string; // Kept for future domain-specific customizations
  preferredMethod?: number;
}) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const paymentMethods = getPaymentMethodsForDomain(domainId); // For future use with domain-specific payment options
    // Get access token
    const accessToken = await getAccessToken();
    
    // Create payment
    const response = await axios.post(
      VIVA_API_URL,
      {
        amount: Math.round(amount * 100), // Viva expects amounts in cents
        customerTrns: `Order ${orderCode}`,
        customer: {
          email: customerEmail,
          fullName: customerName,
        },
        paymentTimeout: 300, // 5 minutes in seconds
        preauth: false,
        allowRecurring: false,
        merchantTrns: orderCode,
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Build checkout URL
    let checkoutUrl = `${VIVA_CHECKOUT_URL}?ref=${response.data.orderCode}`;
    
    // Add preferred payment method if specified
    if (preferredMethod) {
      checkoutUrl += `&paymentMethod=${preferredMethod}`;
    }
    
    return {
      success: true,
      orderCode: response.data.orderCode,
      checkoutUrl
    };
  } catch (error) {
    console.error('Error creating Viva payment:', error);
    return {
      success: false,
      error: 'Failed to create payment'
    };
  }
}

// Function to verify a transaction
export async function verifyTransaction(transactionId: string) {
  try {
    const accessToken = await getAccessToken();
    
    const response = await axios.get(
      `https://demo-api.vivapayments.com/checkout/v2/transactions/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    return {
      success: true,
      transaction: response.data
    };
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return {
      success: false,
      error: 'Failed to verify transaction'
    };
  }
}
