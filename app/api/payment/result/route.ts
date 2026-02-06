import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rtnCode = formData.get('RtnCode'); // '1' means success
    const orderId = formData.get('CustomField1') as string;
    
    // Redirect back to the order page with a success/failure query param
    // The frontend will display the toast/banner based on this param
    if (rtnCode === '1') {
       return NextResponse.redirect(new URL(`/orders/${orderId}?payment=success`, req.url), 303);
    } else {
       const rtnMsg = formData.get('RtnMsg') || 'Payment Failed';
       return NextResponse.redirect(new URL(`/orders/${orderId}?payment=failed&msg=${encodeURIComponent(rtnMsg as string)}`, req.url), 303);
    }

  } catch (error) {
    console.error('Error processing payment result:', error);
    return NextResponse.redirect(new URL('/?payment=error', req.url), 303);
  }
}
