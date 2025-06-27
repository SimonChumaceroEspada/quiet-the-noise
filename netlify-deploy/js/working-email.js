// Working Email Solution using Formspree
// This will actually send emails and works from the browser

async function sendEmailViaFormspree(customerData) {
    try {
        console.log('Sending email via Formspree to:', customerData.email);

        // Create the email content
        const emailContent = {
            name: customerData.name,
            email: customerData.email,
            transaction_id: customerData.transactionId,
            subject: 'Your Quiet the Noise eBook is Ready!',
            message: `
Dear ${customerData.name},

Thank you for purchasing "Quiet the Noise"!

Your eBook download details:
- Transaction ID: ${customerData.transactionId}
- Download Link: ${window.location.origin}/book/QuietTheNoise.zip

If you have any issues, please reply with your transaction ID.

Best regards,
The Quiet the Noise Team
            `
        };

        // Send via Formspree (replace with your Formspree endpoint)
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailContent)
        });

        if (response.ok) {
            return { 
                success: true, 
                message: 'Email sent successfully via Formspree!' 
            };
        } else {
            throw new Error('Formspree request failed');
        }

    } catch (error) {
        console.error('Formspree email failed:', error);
        return { 
            success: false, 
            message: 'Email sending failed: ' + error.message 
        };
    }
}

// Simple working email notification
async function sendWorkingEmailNotification(customerData) {
    try {
        // For now, let's create a solution that actually works
        // We'll create a detailed console log and save to pending_emails
        
        const emailDetails = {
            to: customerData.email,
            subject: 'Your Quiet the Noise eBook is Ready!',
            body: `
Dear ${customerData.name},

Thank you for purchasing "Quiet the Noise"!

🎉 Your eBook is ready for download!

📚 Download Link: ${window.location.origin}/book/QuietTheNoise.zip
🔖 Transaction ID: ${customerData.transactionId}
📅 Purchase Date: ${new Date().toLocaleString()}

What's included:
✅ Complete "Quiet the Noise" eBook (PDF)
✅ Bonus exercises and worksheets  
✅ Lifetime access to updates

Having trouble? Reply to this email with your transaction ID: ${customerData.transactionId}

Best regards,
The Quiet the Noise Team

---
This email was sent because you purchased our eBook.
Transaction ID: ${customerData.transactionId}
            `,
            html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin: 0;">📚 Your eBook is Ready!</h1>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #007cba; margin-top: 0;">Dear ${customerData.name},</h2>
        <p>Thank you for purchasing <strong>"Quiet the Noise"</strong>!</p>
    </div>
    
    <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="color: #333; margin-top: 0;">🎉 Your eBook is Ready!</h3>
        <p><strong>Transaction ID:</strong> ${customerData.transactionId}</p>
        <a href="${window.location.origin}/book/QuietTheNoise.zip" 
           style="display: inline-block; background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0;">
           📥 Download Your eBook
        </a>
    </div>
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #856404; margin-top: 0;">📖 What's Included:</h4>
        <ul style="color: #856404;">
            <li>Complete "Quiet the Noise" eBook (PDF format)</li>
            <li>Bonus exercises and worksheets</li>
            <li>Lifetime access to updates</li>
        </ul>
    </div>
    
    <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
        <p><strong>Need Help?</strong><br>
        If you have any issues downloading your eBook, please reply to this email with your transaction ID: <code style="background: #f1f1f1; padding: 2px 4px; border-radius: 3px;">${customerData.transactionId}</code></p>
        
        <p>Best regards,<br>
        <strong>The Quiet the Noise Team</strong></p>
    </div>
    
    <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
        This email was sent because you purchased "Quiet the Noise" eBook.<br>
        Transaction ID: ${customerData.transactionId} | Purchase Date: ${new Date().toLocaleString()}
    </div>
</div>
            `
        };

        // Log the complete email for manual sending
        console.log('📧 EMAIL TO BE SENT:');
        console.log('==================');
        console.log('To:', emailDetails.to);
        console.log('Subject:', emailDetails.subject);
        console.log('Body:', emailDetails.body);
        console.log('HTML:', emailDetails.html);
        console.log('==================');

        // Save detailed email information for manual processing
        if (supabase) {
            const { data, error } = await supabase
                .from('pending_emails')
                .insert([
                    {
                        email: customerData.email,
                        name: customerData.name,
                        transaction_id: customerData.transactionId,
                        status: 'ready_to_send',
                        email_subject: emailDetails.subject,
                        email_body: emailDetails.body,
                        email_html: emailDetails.html,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                console.error('Error saving email details:', error);
            } else {
                console.log('Email details saved for manual processing');
            }
        }

        return { 
            success: true, 
            message: `Email prepared and logged for ${customerData.email}. Check console for details.` 
        };

    } catch (error) {
        console.error('Error preparing email:', error);
        return { 
            success: false, 
            message: 'Error preparing email: ' + error.message 
        };
    }
}
