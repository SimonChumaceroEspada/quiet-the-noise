// Supabase utilities for Quiet the Noise eBook delivery
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create a new purchase record
async function createPurchase(purchaseData) {
    try {
        const { data, error } = await supabase
            .from('purchases')
            .insert([{
                transaction_id: purchaseData.transactionId,
                customer_email: purchaseData.customerEmail,
                customer_name: purchaseData.customerName,
                product_name: 'Quiet the Noise',
                amount: purchaseData.amount || 7.99,
                currency: purchaseData.currency || 'USD',
                payment_method: purchaseData.paymentMethod || 'paypal'
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating purchase:', error);
            throw error;
        }

        console.log('Purchase created successfully:', data.id);
        return data;
    } catch (error) {
        console.error('Failed to create purchase:', error);
        throw error;
    }
}

// Get purchase by transaction ID
async function getPurchaseByTransactionId(transactionId) {
    try {
        const { data, error } = await supabase
            .from('purchases')
            .select('*')
            .eq('transaction_id', transactionId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error('Error fetching purchase:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch purchase:', error);
        throw error;
    }
}

// Get purchase by download token
async function getPurchaseByToken(downloadToken) {
    try {
        const { data, error } = await supabase
            .from('purchases')
            .select('*')
            .eq('download_token', downloadToken)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching purchase by token:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch purchase by token:', error);
        throw error;
    }
}

// Validate download eligibility
async function validateDownload(downloadToken) {
    try {
        const purchase = await getPurchaseByToken(downloadToken);
        
        if (!purchase) {
            return { valid: false, reason: 'Token not found' };
        }

        // Check if token is expired
        const now = new Date();
        const expiresAt = new Date(purchase.expires_at);
        if (now > expiresAt) {
            return { valid: false, reason: 'Token expired' };
        }

        // Check download limit
        if (purchase.download_count >= purchase.max_downloads) {
            return { valid: false, reason: 'Download limit exceeded' };
        }

        return { 
            valid: true, 
            purchase: purchase,
            remainingDownloads: purchase.max_downloads - purchase.download_count
        };
    } catch (error) {
        console.error('Error validating download:', error);
        return { valid: false, reason: 'Validation error' };
    }
}

// Increment download count
async function incrementDownloadCount(downloadToken) {
    try {
        const { data, error } = await supabase
            .from('purchases')
            .update({ 
                download_count: supabase.raw('download_count + 1'),
                updated_at: new Date().toISOString()
            })
            .eq('download_token', downloadToken)
            .select()
            .single();

        if (error) {
            console.error('Error incrementing download count:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to increment download count:', error);
        throw error;
    }
}

// Get secure download URL for the eBook file
async function getSecureDownloadUrl(fileName = 'QuietTheNoise.zip') {
    try {
        const { data, error } = await supabase.storage
            .from('ebooks')
            .createSignedUrl(fileName, 300); // 5 minutes expiry

        if (error) {
            console.error('Error creating signed URL:', error);
            throw error;
        }

        return data.signedUrl;
    } catch (error) {
        console.error('Failed to create secure download URL:', error);
        throw error;
    }
}

// Get file buffer for direct download
async function getFileBuffer(fileName = 'QuietTheNoise.zip') {
    try {
        const { data, error } = await supabase.storage
            .from('ebooks')
            .download(fileName);

        if (error) {
            console.error('Error downloading file:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to download file:', error);
        throw error;
    }
}

module.exports = {
    createPurchase,
    getPurchaseByTransactionId,
    getPurchaseByToken,
    validateDownload,
    incrementDownloadCount,
    getSecureDownloadUrl,
    getFileBuffer
};
