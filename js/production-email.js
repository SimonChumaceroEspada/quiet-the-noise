// Production Email Service - Ready for real customers
console.log('🚀 Production Email Service loading...');

// FormSubmit tokens for different environments
const FORMSUBMIT_TOKENS = {
    localhost: '0856606d4582496a37fa868394d2de98', // Your activated token
    production: '0856606d4582496a37fa868394d2de98'  // Same token will work for production
};

// Get the right token based on current domain
function getFormSubmitToken() {
    const hostname = window.location.hostname;
    if (hostname === '127.0.0.1' || hostname === 'localhost') {
        return FORMSUBMIT_TOKENS.localhost;
    }
    return FORMSUBMIT_TOKENS.production;
}

async function sendProductionEmail(customerData) {
    console.log('🚀 Production Email - Starting for:', customerData.email);
    
    try {
        const token = getFormSubmitToken();
        console.log('📧 Using FormSubmit token:', token);
        
        // Create the email content
        const emailContent = generateProductionEmailContent(customerData);
        
        // Use FormSubmit with the activated token
        console.log('📧 Sending via FormSubmit (activated)...');
        
        const formData = new FormData();
        formData.append('_to', customerData.email);
        formData.append('_subject', 'Your Quiet the Noise eBook is Ready! 📚');
        formData.append('name', customerData.name);
        formData.append('email', customerData.email);
        formData.append('message', emailContent);
        formData.append('_next', 'https://quietthenoise.com/thank-you'); // Redirect after success
        formData.append('_captcha', 'false');
        formData.append('_template', 'box'); // Nice email template
        
        const response = await fetch(`https://formsubmit.co/${token}`, {
            method: 'POST',
            body: formData
        });
        
        console.log('📧 FormSubmit response status:', response.status);
        
        if (response.ok || response.status === 200) {
            console.log('✅ PRODUCTION EMAIL SENT!');
            return {
                success: true,
                message: `eBook delivery email sent successfully to ${customerData.email}!`,
                service: 'formsubmit_production'
            };
        } else {
            console.log('❌ FormSubmit failed, trying backup...');
            return await sendBackupEmail(customerData);
        }
        
    } catch (error) {
        console.error('❌ Production email error:', error);
        return await sendBackupEmail(customerData);
    }
}

// Backup email method
async function sendBackupEmail(customerData) {
    console.log('🔄 Trying backup email method...');
    
    try {
        // Try Formspree as backup
        const formData = new FormData();
        formData.append('email', customerData.email);
        formData.append('name', customerData.name);
        formData.append('message', generateProductionEmailContent(customerData));
        formData.append('_subject', 'Your Quiet the Noise eBook is Ready! 📚');
        formData.append('_replyto', customerData.email);
        
        const response = await fetch('https://formspree.io/f/xdkonqva', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Backup email sent!');
            return {
                success: true,
                message: `eBook delivery email sent via backup to ${customerData.email}!`,
                service: 'formspree_backup'
            };
        }
        
        console.log('❌ All email methods failed');
        return {
            success: false,
            message: 'Email delivery failed. Customer will be contacted manually.',
            service: 'none'
        };
        
    } catch (error) {
        console.error('❌ Backup email error:', error);
        return {
            success: false,
            message: 'Email delivery failed. Customer will be contacted manually.',
            service: 'error'
        };
    }
}

// Professional email content for customers
function generateProductionEmailContent(customerData) {
    const downloadLink = 'https://drive.google.com/uc?export=download&id=1qP9cGI88s_UfZ0vsOLiypw5llRVpVzO1';
    
    return `Dear ${customerData.name},

🎉 Thank you for purchasing "Quiet the Noise"!

Your eBook is ready for immediate download. We're thrilled to help you begin your journey toward a quieter, more focused mind.

📚 DOWNLOAD YOUR EBOOK NOW:
${downloadLink}

📋 Your Purchase Details:
• Transaction ID: ${customerData.transactionId}
• Purchase Date: ${new Date().toLocaleString()}
• Customer Email: ${customerData.email}

📖 What You'll Get:
✅ Complete "Quiet the Noise" eBook (PDF format)
✅ Practical exercises and worksheets
✅ Bonus productivity strategies
✅ Lifetime access to future updates

🔗 How to Access Your eBook:
1. Click the download link above
2. Save "QuietTheNoise.zip" to your device
3. Extract the ZIP file and open the PDF
4. Start implementing the strategies immediately!

💡 What to Expect:
"Quiet the Noise" will guide you through proven techniques to cut through mental clutter, focus on what truly matters, and create lasting productivity in your life. Each chapter builds on the previous one, giving you actionable tools you can use right away.

🆘 Need Assistance?
If you encounter any issues downloading your eBook or have questions about the content, simply reply to this email with your transaction ID: ${customerData.transactionId}

Our support team is here to ensure you get maximum value from your purchase.

Ready to quiet the noise and amplify your focus? Start reading today!

Best regards,
The Quiet the Noise Team

---
This email was sent automatically following your eBook purchase.
Transaction ID: ${customerData.transactionId}
Purchase Date: ${new Date().toLocaleString()}

🔒 Your download link is secure and will remain active.`;
}

// Export for production use
window.sendProductionEmail = sendProductionEmail;
window.generateProductionEmailContent = generateProductionEmailContent;

console.log('✅ Production Email Service ready for customers!');
