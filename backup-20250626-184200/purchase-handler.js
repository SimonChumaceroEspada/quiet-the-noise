// Purchase Handler - Simplified version for PayPal + Supabase + Email
let supabase;

// Initialize Supabase
function initializeSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded');
        return false;
    }
    
    supabase = window.supabase.createClient(
        CONFIG.SUPABASE_URL,
        CONFIG.SUPABASE_ANON_KEY
    );
    
    console.log('Supabase initialized successfully');
    return true;
}

// Save purchase data to Supabase
async function savePurchaseData(purchaseData) {
    try {
        const { data, error } = await supabase
            .from('purchases')
            .insert([
                {
                    name: purchaseData.name,
                    email: purchaseData.email,
                    paypal_transaction_id: purchaseData.transactionId || null,
                    purchase_date: new Date().toISOString(),
                    book_sent: false
                }
            ])
            .select();
        
        if (error) {
            throw error;
        }
        
        console.log('Purchase data saved:', data);
        return data[0];
    } catch (error) {
        console.error('Error saving purchase data:', error);
        throw error;
    }
}

// Send email with eBook (using Supabase Edge Function)
async function sendEBookEmail(customerData) {
    try {
        // Call Supabase Edge Function to send email
        const { data, error } = await supabase.functions.invoke('send-ebook-email', {
            body: {
                to_email: customerData.email,
                to_name: customerData.name,
                transaction_id: customerData.transactionId
            }
        });
        
        if (error) {
            console.error('Edge function error:', error);
            // Fallback: Try to send notification without attachment
            return await sendSimpleNotification(customerData);
        }
        
        console.log('Email sent successfully:', data);
        return { success: true, message: 'Email sent successfully' };
        
    } catch (error) {
        console.error('Error sending email:', error);
        // Fallback: Save for manual processing
        return await sendSimpleNotification(customerData);
    }
}

// Fallback notification (simple email without attachment)
async function sendSimpleNotification(customerData) {
    try {
        // Save to a separate table for manual processing
        const { data, error } = await supabase
            .from('pending_emails')
            .insert([
                {
                    email: customerData.email,
                    name: customerData.name,
                    transaction_id: customerData.transactionId,
                    status: 'pending'
                }
            ]);
        
        if (error) throw error;
        
        return { 
            success: true, 
            message: 'Purchase recorded. You will receive your eBook within 24 hours.' 
        };
    } catch (error) {
        console.error('Fallback notification failed:', error);
        return { 
            success: false, 
            message: 'Purchase recorded but email failed. Please contact support.' 
        };
    }
}

// Main function to handle successful purchase
async function handleSuccessfulPurchase(purchaseData) {
    try {
        console.log('Processing purchase:', purchaseData);
        
        // 1. Save purchase data to database
        const savedPurchase = await savePurchaseData(purchaseData);
        console.log('Purchase saved with ID:', savedPurchase.id);
        
        // 2. Send eBook to customer
        const emailResult = await sendEBookEmail({
            ...purchaseData,
            id: savedPurchase.id
        });
        
        // 3. Update book sent status if email was successful
        if (emailResult.success) {
            await updateBookSentStatus(savedPurchase.id);
        }
        
        // 4. Track conversion (if analytics available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: purchaseData.transactionId,
                value: CONFIG.BOOK_PRICE,
                currency: CONFIG.BOOK_CURRENCY,
                items: [{
                    item_id: 'quiet-the-noise-ebook',
                    item_name: 'Quiet the Noise eBook',
                    category: 'eBook',
                    quantity: 1,
                    price: CONFIG.BOOK_PRICE
                }]
            });
        }
        
        return {
            success: true,
            message: emailResult.success ? 
                'Purchase successful! Check your email for the eBook.' :
                'Purchase recorded. You will receive your eBook shortly.'
        };
        
    } catch (error) {
        console.error('Error handling purchase:', error);
        
        return {
            success: false,
            message: 'There was an error processing your purchase. Please contact support with your transaction ID: ' + (purchaseData.transactionId || 'N/A')
        };
    }
}

// Update book sent status
async function updateBookSentStatus(purchaseId) {
    try {
        const { data, error } = await supabase
            .from('purchases')
            .update({ book_sent: true })
            .eq('id', purchaseId)
            .select();
        
        if (error) throw error;
        
        console.log('Book sent status updated:', data);
        return data;
    } catch (error) {
        console.error('Error updating book sent status:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSupabase();
});
