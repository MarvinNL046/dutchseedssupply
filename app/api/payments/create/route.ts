import { NextResponse } from 'next/server';
import { createServerSupabaseClient, getDomainId } from '@/lib/supabase';
import { createPayment } from '@/lib/payment/viva';

export async function POST(request: Request) {
  try {
    const { amount, orderItems, customer, preferredMethodId } = await request.json();
    
    // Get domain ID
    const domainId = await getDomainId();
    
    // Generate unique order code
    const orderCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create order in database
    const supabase = await createServerSupabaseClient();
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        customer_email: customer.email,
        customer_name: customer.name,
        amount,
        domain_id: domainId,
        status: 'pending',
        items: orderItems
      })
      .select()
      .single();
    
    if (error) {
      console.error('Failed to create order:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create order in database' },
        { status: 500 }
      );
    }
    
    // Create payment with Viva
    const paymentResult = await createPayment({
      amount,
      customerEmail: customer.email,
      customerName: customer.name,
      orderCode,
      domainId,
      preferredMethod: preferredMethodId
    });
    
    if (!paymentResult.success) {
      // Update order status to failed
      await supabase
        .from('orders')
        .update({ status: 'payment_failed' })
        .eq('id', order.id);
        
      return NextResponse.json(
        { success: false, error: 'Failed to create payment with Viva' },
        { status: 500 }
      );
    }
    
    // Update order with Viva order code
    await supabase
      .from('orders')
      .update({
        payment_provider_ref: paymentResult.orderCode
      })
      .eq('id', order.id);
    
    return NextResponse.json({
      success: true,
      orderCode: paymentResult.orderCode,
      checkoutUrl: paymentResult.checkoutUrl
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
