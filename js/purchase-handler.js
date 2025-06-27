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

// Send email with eBook (using PRODUCTION email service)
async function sendEBookEmail(customerData) {
    try {
        console.log('🚀 Starting PRODUCTION email send process for:', customerData.email);
        
        // Method 1: Use the production email service (most reliable)
        if (typeof sendProductionEmail !== 'undefined') {
            console.log('🔄 Using production email service...');
            const productionResult = await sendProductionEmail(customerData);
            
            if (productionResult.success) {
                console.log('✅ Production email successful:', productionResult.message);
                return productionResult;
            } else {
                console.log('❌ Production email failed:', productionResult.message);
            }
        }

        // Method 2: Use the simple working email service (backup)
        if (typeof sendSimpleWorkingEmail !== 'undefined') {
            console.log('🔄 Using simple working email service...');
            const simpleResult = await sendSimpleWorkingEmail(customerData);
            
            if (simpleResult.success) {
                console.log('✅ Simple working email successful:', simpleResult.message);
                return simpleResult;
            } else {
                console.log('❌ Simple working email failed:', simpleResult.message);
            }
        }

        // Method 3: Use the reliable email service (backup)
        if (typeof sendReliableEmail !== 'undefined') {
            console.log('🔄 Using reliable email service...');
            const reliableResult = await sendReliableEmail(customerData);
            
            if (reliableResult.success) {
                console.log('✅ Reliable email successful:', reliableResult.message);
                return reliableResult;
            } else {
                console.log('❌ Reliable email service failed:', reliableResult.message);
            }
        }

        // Method 4: Direct Formspree (final backup)
        console.log('🔄 Trying Formspree direct backup...');
        
        const formspreeResponse = await fetch('https://formspree.io/f/xdkonqva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: customerData.email,
                name: customerData.name,
                subject: 'Your Quiet the Noise eBook is Ready!',
                message: generateAutomaticEmailContent(customerData),
                transaction_id: customerData.transactionId,
                _replyto: customerData.email,
                _subject: 'Your Quiet the Noise eBook is Ready!'
            })
        });

        if (formspreeResponse.ok) {
            console.log('✅ Formspree backup successful!');
            
            return { 
                success: true, 
                message: `Email sent automatically to ${customerData.email} via Formspree! Check your inbox in 2-5 minutes.`,
                service: 'formspree_backup'
            };
        }

        console.log('❌ All automatic methods failed, saving for manual processing...');
        
        // All automatic methods failed - save for manual processing
        return await sendSimpleNotification(customerData);
        
    } catch (error) {
        console.error('❌ All automatic email methods failed:', error);
        
        // Final fallback: Save for manual processing (NO POPUP)
        return await sendSimpleNotification(customerData);
    }
}

// Direct automatic email implementation
async function sendDirectAutomaticEmail(customerData) {
    try {
        console.log('📧 Preparing automatic email...');

        // Try Formspree (free service that actually works)
        try {
            const formspreeEndpoint = EMAIL_SERVICES?.FORMSPREE?.endpoint || 'https://formspree.io/f/xdkonqva';
            
            const formspreeResponse = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _replyto: CONFIG.SMTP_EMAIL,
                    _subject: 'Your Quiet the Noise eBook is Ready!',
                    name: customerData.name,
                    email: customerData.email,
                    message: generateAutomaticEmailContent(customerData),
                    transaction_id: customerData.transactionId,
                    download_link: `${window.location.origin}/book/QuietTheNoise.zip`,
                    customer_email: customerData.email,
                    book_title: 'Quiet the Noise'
                })
            });

            if (formspreeResponse.ok) {
                console.log('✅ Email sent via Formspree automatically!');
                return { 
                    success: true, 
                    message: 'Email sent automatically via Formspree! Check your inbox within 5 minutes.' 
                };
            }
        } catch (formspreeError) {
            console.log('Formspree failed:', formspreeError.message);
        }

        // Fallback: Save for processing but DON'T open mailto
        const emailContent = generateAutomaticEmailContent(customerData);
        
        console.log('📧 EMAIL DETAILS LOGGED (No automatic window):');
        console.log('===============================================');
        console.log(`To: ${customerData.email}`);
        console.log(`Subject: Your Quiet the Noise eBook is Ready!`);
        console.log(`Content:\n${emailContent}`);
        console.log('===============================================');

        // Save to database with all details
        if (supabase) {
            await supabase
                .from('pending_emails')
                .insert([
                    {
                        email: customerData.email,
                        name: customerData.name,
                        transaction_id: customerData.transactionId,
                        status: 'auto_send_failed',
                        email_subject: 'Your Quiet the Noise eBook is Ready!',
                        email_body: emailContent,
                        created_at: new Date().toISOString()
                    }
                ]);
        }

        // DO NOT open email client automatically - return failure instead
        return { 
            success: false, 
            message: `Automatic email sending failed. Email details logged for manual processing.`
        };

    } catch (error) {
        console.error('Direct automatic email failed:', error);
        return { 
            success: false, 
            message: 'Automatic email failed: ' + error.message 
        };
    }
}

// Generate automatic email content
function generateAutomaticEmailContent(customerData) {
    return `Dear ${customerData.name},

🎉 Thank you for purchasing "Quiet the Noise"!

Your eBook is ready for immediate download. We're excited to help you on your journey to a quieter, more focused mind.

📚 DOWNLOAD YOUR EBOOK NOW:
https://drive.google.com/uc?export=download&id=1qP9cGI88s_UfZ0vsOLiypw5llRVpVzO1

� Your Purchase Details:
• Transaction ID: ${customerData.transactionId}
• Purchase Date: ${new Date().toLocaleString()}
• Customer Email: ${customerData.email}

📖 What's Included in Your Download:
✅ Complete "Quiet the Noise" eBook (PDF format)
✅ Practical exercises and worksheets
✅ Bonus productivity tips and strategies
✅ Lifetime access to future updates

🔗 How to Download:
1. Click the download link above
2. Save the QuietTheNoise.zip file to your device
3. Extract the ZIP file and open the PDF
4. Start reading and implementing the strategies immediately!

💡 About Your eBook:
"Quiet the Noise" will help you cut through mental clutter, focus on what truly matters, and create lasting productivity in your life. Each chapter builds on the last, giving you practical tools you can use immediately.

🆘 Need Help?
If you have any issues downloading your eBook or have questions, simply reply to this email with your transaction ID: ${customerData.transactionId}

We're here to ensure you get the most value from your purchase.

Start your journey to a quieter, more focused life today!

Best regards,
The Quiet the Noise Team

---
This email was sent automatically for your eBook purchase.
Transaction ID: ${customerData.transactionId}
Purchase Date: ${new Date().toLocaleString()}`;
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
