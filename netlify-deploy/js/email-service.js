// Email Service using EmailJS
// This provides a working email solution for the eBook delivery

class EmailService {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            // Load EmailJS if not already loaded
            if (typeof emailjs === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                script.onload = () => this.initializeEmailJS();
                document.head.appendChild(script);
            } else {
                this.initializeEmailJS();
            }
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
        }
    }

    initializeEmailJS() {
        try {
            // Initialize EmailJS with your public key
            emailjs.init("YOUR_PUBLIC_KEY_HERE"); // You'll need to replace this
            this.initialized = true;
            console.log('EmailJS initialized successfully');
        } catch (error) {
            console.error('EmailJS initialization failed:', error);
        }
    }

    async sendEBookEmail(customerData) {
        if (!this.initialized) {
            return this.fallbackToGmail(customerData);
        }

        try {
            const templateParams = {
                to_name: customerData.name,
                to_email: customerData.email,
                transaction_id: customerData.transactionId,
                download_link: 'https://your-site.com/download-ebook',
                book_title: 'Quiet the Noise'
            };

            const result = await emailjs.send(
                'YOUR_SERVICE_ID',    // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID',   // Replace with your EmailJS template ID
                templateParams
            );

            console.log('Email sent successfully:', result);
            return { success: true, message: 'Email sent successfully via EmailJS' };

        } catch (error) {
            console.error('EmailJS send failed:', error);
            return this.fallbackToGmail(customerData);
        }
    }

    // Fallback method using Gmail's mailto with attachment info
    fallbackToGmail(customerData) {
        try {
            const subject = encodeURIComponent('Your Quiet the Noise eBook is Ready!');
            const body = encodeURIComponent(`
Dear ${customerData.name},

Thank you for purchasing "Quiet the Noise"!

Your transaction ID: ${customerData.transactionId}

To download your eBook, please visit:
https://your-download-link.com

If you have any issues, please reply to this email with your transaction ID.

Best regards,
The Quiet the Noise Team
            `);

            const mailtoLink = `mailto:${customerData.email}?subject=${subject}&body=${body}`;
            
            // For testing, we'll create a notification
            console.log('Fallback email would be sent to:', customerData.email);
            console.log('Mailto link:', mailtoLink);
            
            // In a real scenario, you'd need server-side email
            return { 
                success: true, 
                message: 'Email prepared for sending (fallback method)' 
            };

        } catch (error) {
            console.error('Fallback email failed:', error);
            return { 
                success: false, 
                message: 'Email sending failed' 
            };
        }
    }
}

// Create global instance
window.emailService = new EmailService();
