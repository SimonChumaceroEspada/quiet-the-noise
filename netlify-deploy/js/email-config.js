// Email Services Configuration
// Configure your automatic email services here

const EMAIL_SERVICES = {
    // Formspree Configuration (Free tier: 50 emails/month)
    FORMSPREE: {
        enabled: true,
        endpoint: 'https://formspree.io/f/xdkonqva', // Working test endpoint
        // To get your own: 1. Go to formspree.io 2. Create account 3. Create form 4. Copy endpoint
    },
    
    // EmailJS Configuration (Free tier: 200 emails/month)
    EMAILJS: {
        enabled: false, // Set to true when configured
        publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
        serviceId: 'YOUR_EMAILJS_SERVICE_ID',
        templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
        // To set up: 1. Go to emailjs.com 2. Create account 3. Set up service 4. Create template
    },
    
    // Web3Forms Configuration (Free tier: 250 emails/month)
    WEB3FORMS: {
        enabled: false, // Set to true when configured
        accessKey: 'YOUR_WEB3FORMS_ACCESS_KEY',
        // To set up: 1. Go to web3forms.com 2. Create account 3. Get access key
    },
    
    // Netlify Forms (Unlimited on Netlify hosting)
    NETLIFY: {
        enabled: true, // Automatically enabled if hosting on Netlify
        formName: 'ebook-delivery'
    }
};

// Email Templates
const EMAIL_TEMPLATES = {
    subject: 'Your Quiet the Noise eBook is Ready! 📚',
    
    text: (customerData) => `
Dear ${customerData.name},

🎉 Thank you for purchasing "Quiet the Noise"!

Your eBook is ready for download:

📚 Download Link: ${window.location.origin}/book/QuietTheNoise.zip
🔖 Transaction ID: ${customerData.transactionId}
📅 Purchase Date: ${new Date().toLocaleString()}

What's included:
✅ Complete "Quiet the Noise" eBook (PDF format)
✅ Bonus exercises and practical worksheets
✅ Lifetime access to future updates

DOWNLOAD INSTRUCTIONS:
1. Click the download link above
2. Save the file to your device
3. Open the PDF with any PDF reader

Having trouble downloading? Reply to this email with your transaction ID: ${customerData.transactionId}

Start your journey to a quieter, more focused life today!

Best regards,
The Quiet the Noise Team

---
This email was sent automatically for your eBook purchase.
Transaction ID: ${customerData.transactionId}
    `,
    
    html: (customerData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your eBook is Ready!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #007cba 0%, #005a87 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">📚 Your eBook is Ready!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your purchase</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-top: 0; font-size: 24px;">Dear ${customerData.name},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
                Thank you for purchasing <strong>"Quiet the Noise"</strong>! Your eBook is ready for download.
            </p>
            
            <!-- Download Section -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center; border-left: 4px solid #007cba;">
                <h3 style="color: #007cba; margin-top: 0; font-size: 20px;">🎉 Download Your eBook Now</h3>
                <p style="margin: 15px 0; color: #666;">
                    <strong>Transaction ID:</strong> ${customerData.transactionId}
                </p>
                <a href="${window.location.origin}/book/QuietTheNoise.zip" 
                   style="display: inline-block; background: #007cba; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; margin: 15px 0;">
                   📥 Download eBook
                </a>
            </div>
            
            <!-- What's Included -->
            <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h4 style="color: #0066cc; margin-top: 0; font-size: 18px;">📖 What's Included:</h4>
                <ul style="color: #333; line-height: 1.6; margin: 10px 0; padding-left: 20px;">
                    <li>Complete "Quiet the Noise" eBook (PDF format)</li>
                    <li>Bonus practical exercises and worksheets</li>
                    <li>Lifetime access to future updates</li>
                </ul>
            </div>
            
            <!-- Instructions -->
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #ffc107;">
                <h4 style="color: #856404; margin-top: 0; font-size: 16px;">📋 Download Instructions:</h4>
                <ol style="color: #856404; line-height: 1.6; margin: 10px 0; padding-left: 20px;">
                    <li>Click the download button above</li>
                    <li>Save the file to your device</li>
                    <li>Open the PDF with any PDF reader</li>
                </ol>
            </div>
            
            <!-- Support -->
            <div style="border-top: 1px solid #eee; padding-top: 25px; margin-top: 35px;">
                <h4 style="color: #333; font-size: 16px;">Need Help?</h4>
                <p style="color: #666; line-height: 1.6;">
                    If you have any issues downloading your eBook, please reply to this email with your transaction ID: 
                    <code style="background: #f1f1f1; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${customerData.transactionId}</code>
                </p>
                
                <p style="color: #555; font-size: 16px; margin-top: 25px;">
                    Start your journey to a quieter, more focused life today!
                </p>
                
                <p style="color: #333; margin-top: 30px;">
                    Best regards,<br>
                    <strong>The Quiet the Noise Team</strong>
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.4;">
                This email was sent automatically for your eBook purchase.<br>
                Transaction: ${customerData.transactionId} | ${new Date().toLocaleString()}
            </p>
        </div>
    </div>
</body>
</html>
    `
};

// Export for use in other files
window.EMAIL_SERVICES = EMAIL_SERVICES;
window.EMAIL_TEMPLATES = EMAIL_TEMPLATES;
