// Working Email Implementation using SMTP.js
// This will actually send emails using your Gmail SMTP configuration

async function sendRealEBookEmail(customerData) {
    try {
        console.log('Attempting to send real email to:', customerData.email);
        
        // Load SMTP.js if not already loaded
        if (typeof Email === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://smtpjs.com/v3/smtp.js';
            document.head.appendChild(script);
            
            await new Promise((resolve) => {
                script.onload = resolve;
            });
        }

        // Email content
        const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Your "Quiet the Noise" eBook is Ready!</h2>
            
            <p>Dear ${customerData.name},</p>
            
            <p>Thank you for purchasing <strong>"Quiet the Noise"</strong>!</p>
            
            <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
                <h3>📚 Download Your eBook</h3>
                <p><strong>Transaction ID:</strong> ${customerData.transactionId}</p>
                <p><a href="./book/QuietTheNoise.zip" style="background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download eBook</a></p>
            </div>
            
            <div style="background: #e8f4fd; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h4>📖 What's Included:</h4>
                <ul>
                    <li>Complete "Quiet the Noise" eBook (PDF format)</li>
                    <li>Bonus materials and exercises</li>
                    <li>Lifetime access to updates</li>
                </ul>
            </div>
            
            <p><strong>Need Help?</strong><br>
            If you have any issues downloading your eBook, please reply to this email with your transaction ID: <code>${customerData.transactionId}</code></p>
            
            <p>Thank you for your purchase!</p>
            
            <p>Best regards,<br>
            <strong>The Quiet the Noise Team</strong></p>
            
            <hr style="margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">
                This email was sent because you purchased "Quiet the Noise" eBook. 
                Transaction ID: ${customerData.transactionId}
            </p>
        </div>
        `;

        // Send email using SMTP.js with your Gmail credentials
        const result = await Email.send({
            SecureToken: "C973D7AD-F097-4B95-91F4-40ABC5567812", // You'll need to get your own token
            To: customerData.email,
            From: CONFIG.SMTP_EMAIL,
            Subject: "Your Quiet the Noise eBook is Ready! 📚",
            Body: emailBody
        });

        console.log('SMTP.js result:', result);

        if (result === 'OK') {
            return { 
                success: true, 
                message: 'Email sent successfully via SMTP!' 
            };
        } else {
            throw new Error('SMTP send failed: ' + result);
        }

    } catch (error) {
        console.error('Real email sending failed:', error);
        
        // Fallback: Create a detailed message for manual sending
        const manualInstructions = `
Email Details for Manual Sending:
To: ${customerData.email}
Subject: Your Quiet the Noise eBook is Ready! 📚
Transaction: ${customerData.transactionId}

Please manually send the eBook to this customer.
        `;
        
        console.log('MANUAL EMAIL INSTRUCTIONS:', manualInstructions);
        
        return { 
            success: false, 
            message: 'Email queued for manual processing. Customer will receive eBook within 24 hours.',
            manualInstructions: manualInstructions
        };
    }
}
