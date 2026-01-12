import { NextRequest, NextResponse } from 'next/server';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

// SMS notification using AWS SNS
async function sendSMSNotification(orderData: any) {
  const YOUR_PHONE_NUMBER = process.env.YOUR_PHONE_NUMBER; // Format: +919325173787
  const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';

  if (!YOUR_PHONE_NUMBER) {
    console.error('Phone number not configured');
    return { success: false, error: 'Phone number not configured' };
  }

  try {
    // Initialize SNS client
    const snsClient = new SNSClient({ 
      region: AWS_REGION,
      // Credentials are automatically picked up from environment or IAM role
    });

    // Create concise SMS message (SMS has 160 character limit per segment)
    const itemsList = orderData.items
      .map((item: any) => `${item.name} x${item.quantity}`)
      .join(', ');

    const shippingInfo = orderData.shippingType === 'express' 
      ? `Express (Rs.${orderData.shippingCharge})`
      : orderData.shippingCharge === 0 
        ? 'Standard (FREE)' 
        : `Standard (Rs.${orderData.shippingCharge})`;

    const message = `New Order ${orderData.orderId}
Customer: ${orderData.customerName}
Phone: ${orderData.customerPhone}
Items: ${itemsList}
Subtotal: Rs.${orderData.subtotal || orderData.totalAmount}
Shipping: ${shippingInfo}
Total: Rs.${orderData.totalAmount}
Payment: ${orderData.paymentMethod}
Address: ${orderData.customerCity}, ${orderData.customerPincode}`;

    // Send SMS via SNS
    const command = new PublishCommand({
      PhoneNumber: YOUR_PHONE_NUMBER,
      Message: message,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional', // Use 'Promotional' for marketing messages
        },
        // Note: Sender ID requires registration with AWS SNS for India
        // Until registered, SMS will show a random number
        // To register: AWS Console > Pinpoint > SMS and voice > Sender IDs
        // Or use AWS Pinpoint Origination Identities
        // Commenting out until registered to avoid confusion
        // 'AWS.SNS.SMS.SenderID': {
        //   DataType: 'String',
        //   StringValue: 'AATT', // Max 6 chars for India (alphanumeric)
        // },
      },
    });

    const response = await snsClient.send(command);
    
    console.log('SMS sent successfully:', response.MessageId);
    return { success: true, messageId: response.MessageId };
  } catch (error) {
    console.error('SMS notification error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Validate required fields
    if (!orderData.orderId || !orderData.customerName || !orderData.customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required order data' },
        { status: 400 }
      );
    }

    // Send SMS notification
    const smsResult = await sendSMSNotification(orderData);

    return NextResponse.json({
      success: smsResult.success,
      sms: smsResult,
    });
  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send notifications' 
      },
      { status: 500 }
    );
  }
}
