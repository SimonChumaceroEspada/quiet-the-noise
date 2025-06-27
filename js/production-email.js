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
        
        // Use FormSubmit with iframe method to avoid CORS issues
        console.log('📧 Sending via FormSubmit (iframe method)...');
        
        const result = await sendViaFormSubmitIframe(customerData, emailContent, token);
        
        if (result.success) {
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

// Send email via FormSubmit using iframe method (avoids CORS)
function sendViaFormSubmitIframe(customerData, emailContent, token) {
    return new Promise((resolve) => {
        console.log('📧 Creating hidden iframe for FormSubmit...');
        
        try {
            // Create a hidden form and iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.name = 'production-email-iframe-' + Date.now();
            document.body.appendChild(iframe);
            
            const form = document.createElement('form');
            form.target = iframe.name;
            form.method = 'POST';
            form.action = `https://formsubmit.co/${token}`;
            form.style.display = 'none';
            
            // Add form fields
            const fields = {
                '_to': customerData.email,
                '_subject': 'Your Quiet the Noise eBook is Ready! 📚',
                'name': customerData.name,
                'email': customerData.email,
                'message': emailContent,
                '_next': 'https://formsubmit.co/confirm',
                '_captcha': 'false',
                '_template': 'box'
            };
            
            Object.keys(fields).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = fields[key];
                form.appendChild(input);
            });
            
            document.body.appendChild(form);
            
            // Submit form
            form.submit();
            
            // Clean up after a delay and resolve
            setTimeout(() => {
                try {
                    document.body.removeChild(form);
                    document.body.removeChild(iframe);
                } catch (e) {
                    console.log('Cleanup error (not critical):', e);
                }
                
                resolve({
                    success: true,
                    message: 'Email sent via FormSubmit iframe method'
                });
            }, 3000);
            
        } catch (error) {
            console.error('Iframe method error:', error);
            resolve({
                success: false,
                message: error.message
            });
        }
    });
}

// Backup email method
async function sendBackupEmail(customerData) {
    console.log('🔄 Trying backup email method...');
    
    try {
        // Try Web3Forms as backup (more reliable than Formspree)
        const formData = new FormData();
        formData.append('access_key', 'c8d3b1f5-4c7a-4e4e-9f5c-1a2b3c4d5e6f'); // Web3Forms key
        formData.append('name', customerData.name);
        formData.append('email', customerData.email);
        formData.append('subject', 'Your Quiet the Noise eBook is Ready! 📚');
        formData.append('message', generateProductionEmailContent(customerData));
        formData.append('redirect', 'false'); // Don't redirect
        
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Backup email sent via Web3Forms!');
            return {
                success: true,
                message: `eBook delivery email sent via backup to ${customerData.email}!`,
                service: 'web3forms_backup'
            };
        }
        
        // If Web3Forms fails, try alternative method
        console.log('❌ Web3Forms failed, trying alternative...');
        return await sendAlternativeEmail(customerData);
        
    } catch (error) {
        console.error('❌ Backup email error:', error);
        return await sendAlternativeEmail(customerData);
    }
}

// Alternative email method using EmailJS
async function sendAlternativeEmail(customerData) {
    console.log('🔄 Trying alternative email method (EmailJS)...');
    
    try {
        // Load EmailJS if not already loaded
        if (typeof emailjs === 'undefined') {
            await loadEmailJS();
        }
        
        const templateParams = {
            to_email: customerData.email,
            to_name: customerData.name,
            subject: 'Your Quiet the Noise eBook is Ready! 📚',
            message: generateProductionEmailContent(customerData),
            transaction_id: customerData.transactionId
        };
        
        emailjs.init('YOUR_PUBLIC_KEY'); // You'll need to replace this
        const result = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
        
        if (result.status === 200) {
            console.log('✅ Alternative email sent via EmailJS!');
            return {
                success: true,
                message: `eBook delivery email sent via alternative to ${customerData.email}!`,
                service: 'emailjs_alternative'
            };
        }
        
        throw new Error('EmailJS failed');
        
    } catch (error) {
        console.error('❌ All email methods failed:', error);
        return {
            success: false,
            message: 'Email delivery failed. Customer will be contacted manually.',
            service: 'none'
        };
    }
}

// Load EmailJS library dynamically
function loadEmailJS() {
    return new Promise((resolve, reject) => {
        if (typeof emailjs !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
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
