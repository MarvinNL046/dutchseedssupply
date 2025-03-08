import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { verifyTransaction } from '@/lib/payment/viva';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { event, data } = payload;
    
    // In a production environment, you would verify the webhook signature here
    // if Viva provides this functionality
    
    const supabase = await createServerSupabaseClient();
    
    console.log('Received webhook event:', event, 'with data:', data);
    
    if (event === 'TRANSACTION_PAYMENT_SUCCESS') {
      // Verify the transaction with Viva API for additional security
      const verificationResult = await verifyTransaction(data.transactionId);
      
      if (!verificationResult.success) {
        console.error('Failed to verify transaction:', data.transactionId);
        return NextResponse.json({ success: false }, { status: 500 });
      }
      
      // Update order status in database
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'paid', 
          payment_id: data.transactionId,
          payment_method: data.paymentMethod,
          transaction_date: new Date().toISOString()
        })
        .eq('payment_provider_ref', data.orderCode);
      
      if (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ success: false }, { status: 500 });
      }
      
      // Additional logic could be added here:
      // - Update inventory
      // - Send confirmation email
      // - Award loyalty points
      
    } else if (event === 'TRANSACTION_FAILED') {
      // Handle failed payment
      const { error } = await supabase
        .from('orders')
        .update({ status: 'payment_failed' })
        .eq('payment_provider_ref', data.orderCode);
      
      if (error) {
        console.error('Error updating order status to failed:', error);
        return NextResponse.json({ success: false }, { status: 500 });
      }
    }
    
    // Always return a 200 response to acknowledge receipt of the webhook
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
