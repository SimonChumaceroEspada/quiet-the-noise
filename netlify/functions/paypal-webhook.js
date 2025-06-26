// PayPal Webhook Handler for Quiet the Noise eBook purchases
const { createPurchase, getPurchaseByTransactionId } = require('./utils/supabase');

// Email service
const nodemailer = require('nodemailer');

// PayPal webhook verification
const crypto = require('crypto');

// Create email transporter
const createEmailTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Verify PayPal webhook signature (optional but recommended for production)
function verifyPayPalWebhook(body, headers) {
    // This is a simplified version - implement full verification for production
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const payload = body;
    
    // For now, we'll skip verification in development
    // In production, implement proper PayPal signature verification
    return true;
}

// Extract customer information from PayPal data
function extractCustomerInfo(paypalData) {
    const payer = paypalData.resource?.payer || paypalData.payer;
    const purchaseUnits = paypalData.resource?.purchase_units || paypalData.purchase_units;
    
    return {
        email: payer?.email_address || '',
        name: payer?.name?.given_name ? 
            `${payer.name.given_name} ${payer.name.surname || ''}`.trim() : 
            'Valued Customer',
        transactionId: paypalData.resource?.id || paypalData.id,
        amount: purchaseUnits?.[0]?.amount?.value || '7.99',
        currency: purchaseUnits?.[0]?.amount?.currency_code || 'USD'
    };
}

// Send download email to customer
async function sendDownloadEmail(customerEmail, customerName, downloadToken) {
    try {
        const transporter = createEmailTransporter();
        
        const downloadUrl = `${process.env.SITE_URL}/.netlify/functions/download?token=${downloadToken}`;
        
        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Your "Quiet the Noise" eBook Download</title>
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
                .download-button { display: inline-block; background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
                .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
                .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Thank You for Your Purchase!</h1>
                    <p>Your "Quiet the Noise" eBook is Ready</p>
                </div>
                
                <div class="content">
                    <p>Dear ${customerName || 'Valued Customer'},</p>
                    
                    <p>Thank you for purchasing <strong>"Quiet the Noise: 30 Days to Calmer Thoughts, Less Anxiety, and Greater Mental Clarity"</strong>!</p>
                    
                    <p>Your payment has been processed successfully, and your eBook is now ready for download.</p>
                    
                    <div style="text-align: center;">
                        <a href="${downloadUrl}" class="download-button">
                            📚 Download Your eBook Now
                        </a>
                    </div>
                    
                    <div class="highlight">
                        <strong>What's Included:</strong>
                        <ul>
                            <li>📖 PDF format (perfect for reading on any device)</li>
                            <li>📱 ePub format (optimized for e-readers)</li>
                            <li>🔄 30-day money-back guarantee</li>
                            <li>💾 You can download up to 3 times within 30 days</li>
                        </ul>
                    </div>
                    
                    <p><strong>Important:</strong> This download link is unique to you and will expire in 30 days. Please save your files to a secure location.</p>
                    
                    <p>If you have any questions or need support, please don't hesitate to contact us at support@quietthenoise.com</p>
                    
                    <p>We're excited for you to begin your journey to greater mental clarity!</p>
                    
                    <p>Best regards,<br>The Quiet the Noise Team</p>
                    
                    <p>If you're having trouble with the download button, copy and paste this link into your browser:</p>
                    <p><a href="${downloadUrl}">${downloadUrl}</a></p>
                </div>
                
                <div class="footer">
                    <p>© 2025 Quiet the Noise. All rights reserved.</p>
                    <p>This email was sent because you completed a purchase on our website.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: `"Quiet the Noise" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: '📚 Your "Quiet the Noise" eBook Download is Ready!',
            html: emailHtml
        };

        await transporter.sendMail(mailOptions);
        console.log(`Download email sent successfully to: ${customerEmail}`);
        
        return true;
    } catch (error) {
        console.error('Error sending download email:', error);
        throw error;
    }
}

// Main webhook handler
exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only handle POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const paypalData = JSON.parse(event.body);
        
        console.log('PayPal Webhook received:', paypalData.event_type);

        // Only process successful payment events
        if (paypalData.event_type === 'PAYMENT.CAPTURE.COMPLETED' || 
            paypalData.event_type === 'CHECKOUT.ORDER.APPROVED') {
            
            // Extract customer information
            const customerInfo = extractCustomerInfo(paypalData);
            
            console.log('Processing payment for:', customerInfo.email);

            // Check if purchase already exists
            const existingPurchase = await getPurchaseByTransactionId(customerInfo.transactionId);
            
            if (existingPurchase) {
                console.log('Purchase already processed:', customerInfo.transactionId);
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ message: 'Purchase already processed' })
                };
            }

            // Create new purchase record
            const purchaseData = {
                transactionId: customerInfo.transactionId,
                customerEmail: customerInfo.email,
                customerName: customerInfo.name,
                amount: parseFloat(customerInfo.amount),
                currency: customerInfo.currency,
                paymentMethod: 'paypal'
            };

            const purchase = await createPurchase(purchaseData);

            // Send download email with the generated download token
            await sendDownloadEmail(
                customerInfo.email, 
                customerInfo.name, 
                purchase.download_token
            );

            console.log('Purchase processed successfully for:', customerInfo.email);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    message: 'Purchase processed successfully',
                    purchaseId: purchase.id
                })
            };
        } else {
            console.log('Ignored event type:', paypalData.event_type);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'Event ignored' })
            };
        }

    } catch (error) {
        console.error('Webhook processing error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message 
            })
        };
    }
};
