// Database and Email Functions for Quiet the Noise

// Initialize Supabase client
let supabase;

function initializeSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded');
        return;
    }
    
    supabase = window.supabase.createClient(
        CONFIG.SUPABASE_URL,
        CONFIG.SUPABASE_ANON_KEY
    );
    
    console.log('Supabase initialized');
}

// Initialize EmailJS
function initializeEmailJS() {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library not loaded');
        return;
    }
    
    emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
    console.log('EmailJS initialized');
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

// Send eBook via email
async function sendEBook(customerData) {
    try {
        // First, convert the ZIP file to base64
        const bookFile = await fetch('./book/QuietTheNoise.zip');
        const bookBlob = await bookFile.blob();
        
        // Convert blob to base64
        const base64Book = await blobToBase64(bookBlob);
        
        const templateParams = {
            to_name: customerData.name,
            to_email: customerData.email,
            book_attachment: base64Book,
            reply_to: CONFIG.SUPPORT_EMAIL
        };
        
        const response = await emailjs.send(
            CONFIG.EMAILJS_SERVICE_ID,
            CONFIG.EMAILJS_TEMPLATE_ID,
            templateParams
        );
        
        console.log('Email sent successfully:', response);
        
        // Update database to mark book as sent
        if (customerData.id) {
            await updateBookSentStatus(customerData.id);
        }
        
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Helper function to convert blob to base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Update book sent status in database
async function updateBookSentStatus(purchaseId) {
    try {
        const { data, error } = await supabase
            .from('purchases')
            .update({ book_sent: true })
            .eq('id', purchaseId)
            .select();
        
        if (error) {
            throw error;
        }
        
        console.log('Book sent status updated:', data);
        return data;
    } catch (error) {
        console.error('Error updating book sent status:', error);
        throw error;
    }
}

// Main function to handle successful purchase
async function handleSuccessfulPurchase(purchaseData) {
    try {
        // 1. Save purchase data to database
        const savedPurchase = await savePurchaseData(purchaseData);
        
        // 2. Send eBook to customer
        await sendEBook({
            ...purchaseData,
            id: savedPurchase.id
        });
        
        // 3. Track conversion
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
            message: 'Purchase processed successfully! Check your email for the eBook.'
        };
        
    } catch (error) {
        console.error('Error handling purchase:', error);
        
        return {
            success: false,
            message: 'There was an error processing your purchase. Please contact support.'
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSupabase();
    initializeEmailJS();
});
