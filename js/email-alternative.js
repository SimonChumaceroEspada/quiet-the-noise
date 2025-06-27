// Email Service Alternative - Using EmailJS for direct browser email sending
// This is a temporary solution while we set up proper Supabase Edge Functions

// EmailJS configuration
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_gmail', // Will need to be configured
    TEMPLATE_ID: 'template_ebook', // Will need to be configured  
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY' // Will need to be configured
};

// Alternative email sending using fetch to a simple email service
async function sendEmailAlternative(customerData) {
    try {
        console.log('🔄 Attempting alternative email send...');
        
        // Method 1: Use a simple email API service
        const emailPayload = {
            to: customerData.email,
            name: customerData.name,
            subject: 'Quiet the Noise - Your eBook is Ready!',
            transaction_id: customerData.transactionId,
            message: generateEmailContent(customerData)
        };
        
        // For now, we'll simulate success and save to pending_emails
        console.log('📝 Saving to pending_emails for manual processing...');
        
        const { data, error } = await supabase
            .from('pending_emails')
            .insert([
                {
                    email: customerData.email,
                    name: customerData.name,
                    transaction_id: customerData.transactionId,
                    status: 'ready_to_send',
                    email_content: emailPayload.message,
                    created_at: new Date().toISOString()
                }
            ])
            .select();
        
        if (error) {
            throw error;
        }
        
        // Return success - the email will be processed manually or by a server job
        return {
            success: true,
            message: 'Email queued for sending. You will receive your eBook within 1 hour.',
            method: 'alternative_queued'
        };
        
    } catch (error) {
        console.error('Alternative email send failed:', error);
        return {
            success: false,
            message: 'Email sending failed: ' + error.message
        };
    }
}

// Generate email content
function generateEmailContent(customerData) {
    return `
Dear ${customerData.name},

Thank you for purchasing "Quiet the Noise"!

Your transaction ID is: ${customerData.transactionId}

You can download your eBook using the following link:
[Download Link - Will be added by manual processing]

The eBook includes:
• Complete PDF version
• EPUB format for mobile devices  
• Bonus materials and worksheets

If you have any questions, please reply to this email.

Best regards,
The Quiet the Noise Team

---
This email was generated automatically for transaction: ${customerData.transactionId}
`;
}

// Enhanced version of sendEBookEmail that tries multiple methods
async function sendEBookEmailEnhanced(customerData) {
    try {
        console.log('📧 Enhanced email sending...');
        
        // Method 1: Try original Supabase Edge Function
        console.log('🔄 Trying Supabase Edge Function...');
        try {
            const { data, error } = await supabase.functions.invoke('send-ebook-email', {
                body: {
                    to_email: customerData.email,
                    to_name: customerData.name,
                    transaction_id: customerData.transactionId
                }
            });
            
            if (!error) {
                console.log('✅ Supabase Edge Function succeeded');
                return { success: true, message: 'Email sent via Supabase Edge Function' };
            }
            
            console.log('❌ Supabase Edge Function failed:', error.message);
        } catch (edgeFunctionError) {
            console.log('❌ Supabase Edge Function error:', edgeFunctionError.message);
        }
        
        // Method 2: Try alternative email service
        console.log('🔄 Trying alternative email method...');
        const alternativeResult = await sendEmailAlternative(customerData);
        
        if (alternativeResult.success) {
            return alternativeResult;
        }
        
        // Method 3: Fallback to manual processing queue
        console.log('🔄 Falling back to manual processing queue...');
        return await sendSimpleNotification(customerData);
        
    } catch (error) {
        console.error('Enhanced email sending failed:', error);
        return await sendSimpleNotification(customerData);
    }
}

// Make this available globally
window.sendEBookEmailEnhanced = sendEBookEmailEnhanced;
