/**
 * Backup Email Service
 * Provides multiple fallback methods for email delivery
 */

class BackupEmailService {
    constructor() {
        this.methods = [
            { name: 'FormSubmit (Primary)', handler: this.sendViaFormSubmit.bind(this) },
            { name: 'Formspree', handler: this.sendViaFormspree.bind(this) },
            { name: 'Web3Forms', handler: this.sendViaWeb3Forms.bind(this) },
            { name: 'EmailJS', handler: this.sendViaEmailJS.bind(this) }
        ];
        this.maxRetries = 3;
        this.retryDelay = 2000; // 2 seconds
    }

    async sendEmail(customerData) {
        console.log('🔄 Starting backup email service...');
        
        for (let i = 0; i < this.methods.length; i++) {
            const method = this.methods[i];
            console.log(`📧 Attempting email via ${method.name}...`);
            
            try {
                const result = await this.retryWithBackoff(method.handler, customerData);
                if (result.success) {
                    console.log(`✅ Email sent successfully via ${method.name}`);
                    return {
                        success: true,
                        method: method.name,
                        message: `Email delivered via ${method.name}`,
                        details: result
                    };
                }
            } catch (error) {
                console.warn(`❌ ${method.name} failed:`, error.message);
                continue;
            }
        }
        
        // If all methods failed, return failure but log for manual follow-up
        console.error('🚨 All email methods failed. Manual intervention required.');
        this.logFailedDelivery(customerData);
        
        return {
            success: false,
            method: 'None (all failed)',
            message: 'Email delivery failed. Customer will be contacted manually.',
            needsManualFollowup: true
        };
    }

    async retryWithBackoff(method, customerData) {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const result = await method(customerData);
                if (result.success) {
                    return result;
                }
            } catch (error) {
                if (attempt === this.maxRetries) {
                    throw error;
                }
                console.log(`⏱️ Retry ${attempt}/${this.maxRetries} failed, waiting ${this.retryDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            }
        }
        throw new Error(`Failed after ${this.maxRetries} attempts`);
    }

    async sendViaFormSubmit(customerData) {
        const endpoint = window.location.hostname === 'localhost' 
            ? 'https://formsubmit.co/ajax/simon.oliveira.v@gmail.com'
            : 'https://formsubmit.co/ajax/b9a8ce7ec97e8a6e2b9f5a1e8e5c4d6f'; // Your activated token

        const formData = new FormData();
        formData.append('_subject', 'Quiet the Noise - eBook Purchase Confirmation');
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');
        formData.append('email', customerData.email);
        formData.append('name', customerData.name);
        formData.append('transaction_id', customerData.transactionId);
        formData.append('amount', customerData.amount || '$29');
        formData.append('purchase_date', new Date().toLocaleString());
        formData.append('download_link', 'https://drive.google.com/uc?export=download&id=1uGlONPgA7p-r_fGFIvAO3e3V1NfxQhFz');
        
        // Professional email content
        formData.append('message', `
Hello ${customerData.name},

Thank you for purchasing "Quiet the Noise"! 🎉

Your eBook is ready for download. Click the link below to get your copy:

📖 Download your eBook:
https://drive.google.com/uc?export=download&id=1uGlONPgA7p-r_fGFIvAO3e3V1NfxQhFz

Order Details:
- Order ID: ${customerData.transactionId}
- Amount: ${customerData.amount || '$29'}
- Date: ${new Date().toLocaleString()}

What's included:
✓ Complete "Quiet the Noise" eBook (PDF)
✓ Practical exercises & worksheets  
✓ Bonus productivity strategies
✓ Lifetime access to updates

If you have any issues with your download, please reply to this email.

Best regards,
The Quiet the Noise Team

---
This is an automated confirmation email for your eBook purchase.
        `);

        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            return { success: true, response: result };
        } else {
            throw new Error(`FormSubmit failed: ${response.status}`);
        }
    }

    async sendViaFormspree(customerData) {
        const formData = new FormData();
        formData.append('email', customerData.email);
        formData.append('name', customerData.name);
        formData.append('subject', 'Quiet the Noise - eBook Download');
        formData.append('message', `
Hello ${customerData.name},

Your "Quiet the Noise" eBook is ready! 

Download link: https://drive.google.com/uc?export=download&id=1uGlONPgA7p-r_fGFIvAO3e3V1NfxQhFz

Order ID: ${customerData.transactionId}
Amount: ${customerData.amount || '$29'}

Thank you for your purchase!
        `);

        const response = await fetch('https://formspree.io/f/xvgpbqgw', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            return { success: true, service: 'Formspree' };
        } else {
            throw new Error(`Formspree failed: ${response.status}`);
        }
    }

    async sendViaWeb3Forms(customerData) {
        const formData = new FormData();
        formData.append('access_key', 'c8b9e1f5-9a3b-4d2c-8f1e-7a6b5c4d9e2f');
        formData.append('subject', 'Quiet the Noise - eBook Purchase');
        formData.append('from_name', 'Quiet the Noise');
        formData.append('email', customerData.email);
        formData.append('message', `
Hello ${customerData.name},

Thank you for purchasing "Quiet the Noise"!

Download your eBook: https://drive.google.com/uc?export=download&id=1uGlONPgA7p-r_fGFIvAO3e3V1NfxQhFz

Order ID: ${customerData.transactionId}
        `);

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                return { success: true, service: 'Web3Forms' };
            } else {
                throw new Error('Web3Forms API returned success: false');
            }
        } else {
            throw new Error(`Web3Forms failed: ${response.status}`);
        }
    }

    async sendViaEmailJS(customerData) {
        // This would require EmailJS to be loaded
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS not available');
        }

        const templateParams = {
            to_email: customerData.email,
            to_name: customerData.name,
            subject: 'Quiet the Noise - eBook Download',
            message: `
Hello ${customerData.name},

Your "Quiet the Noise" eBook is ready for download!

Download link: https://drive.google.com/uc?export=download&id=1uGlONPgA7p-r_fGFIvAO3e3V1NfxQhFz

Order ID: ${customerData.transactionId}

Thank you for your purchase!
            `,
            download_link: 'https://drive.google.com/uc?export=download&id=1uGlONPgA7p-r_fGFIvAO3e3V1NfxQhFz'
        };

        const result = await emailjs.send(
            'service_ebook_delivery',
            'template_ebook_purchase',
            templateParams,
            'user_public_key'
        );

        return { success: true, service: 'EmailJS', result };
    }

    logFailedDelivery(customerData) {
        // Log to localStorage for manual follow-up
        const failedDeliveries = JSON.parse(localStorage.getItem('failedEbookDeliveries') || '[]');
        failedDeliveries.push({
            ...customerData,
            timestamp: new Date().toISOString(),
            attemptedMethods: this.methods.map(m => m.name),
            status: 'requires_manual_followup'
        });
        localStorage.setItem('failedEbookDeliveries', JSON.stringify(failedDeliveries));
        
        // Also try to log to a monitoring service if available
        try {
            console.error('FAILED DELIVERY LOG:', {
                email: customerData.email,
                name: customerData.name,
                transactionId: customerData.transactionId,
                timestamp: new Date().toISOString()
            });
        } catch (e) {
            // Monitoring not available
        }
    }

    // Get failed deliveries for manual processing
    getFailedDeliveries() {
        return JSON.parse(localStorage.getItem('failedEbookDeliveries') || '[]');
    }

    // Mark a failed delivery as manually resolved
    markDeliveryResolved(transactionId) {
        const failedDeliveries = this.getFailedDeliveries();
        const updated = failedDeliveries.filter(delivery => delivery.transactionId !== transactionId);
        localStorage.setItem('failedEbookDeliveries', JSON.stringify(updated));
    }
}

// Export for use in other scripts
window.BackupEmailService = BackupEmailService;
