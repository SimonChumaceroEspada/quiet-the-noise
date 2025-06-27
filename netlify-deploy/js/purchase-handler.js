// Purchase Handler - Enhanced version with better debugging
let supabase;
let supabaseInitialized = false;

// Initialize Supabase with better error handling
function initializeSupabase() {
    console.log('🔄 Initializing Supabase...');
    
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase library not loaded');
        return false;
    }
    
    if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
        console.error('❌ Supabase configuration missing');
        console.log('URL:', CONFIG.SUPABASE_URL);
        console.log('Key exists:', !!CONFIG.SUPABASE_ANON_KEY);
        return false;
    }
    
    try {
        supabase = window.supabase.createClient(
            CONFIG.SUPABASE_URL,
            CONFIG.SUPABASE_ANON_KEY
        );
        
        console.log('✅ Supabase initialized successfully');
        console.log('Supabase client:', supabase);
        supabaseInitialized = true;
        return true;
    } catch (error) {
        console.error('❌ Supabase initialization failed:', error);
        supabaseInitialized = false;
        return false;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeSupabase();
    }, 1000);
});

// Save purchase data to Supabase with enhanced error handling
async function savePurchaseData(purchaseData) {
    console.log('💾 === SAVING PURCHASE DATA ===');
    console.log('Purchase data:', purchaseData);
    
    // Check if Supabase is initialized
    if (!supabase) {
        console.log('⚠️ Supabase not initialized, attempting initialization...');
        const initialized = initializeSupabase();
        if (!initialized) {
            throw new Error('Supabase initialization failed');
        }
    }
    
    try {
        console.log('📤 Inserting data into Supabase...');
        const insertData = {
            name: purchaseData.name || 'Unknown Customer',
            email: purchaseData.email || 'no-email@provided.com',
            paypal_transaction_id: purchaseData.transactionId || null,
            purchase_date: new Date().toISOString(),
            book_sent: false
            // Removiendo amount y payment_method temporalmente hasta arreglar la tabla
        };
        
        console.log('Insert data:', insertData);
        
        const { data, error } = await supabase
            .from('purchases')
            .insert([insertData])
            .select();
        
        if (error) {
            console.error('❌ Supabase insert error:', error);
            console.log('Error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }
        
        console.log('✅ Purchase data saved successfully:', data);
        return data[0];
    } catch (error) {
        console.error('❌ Error saving purchase data:', error);
        
        // Save to localStorage as backup
        const backupData = {
            ...purchaseData,
            timestamp: new Date().toISOString(),
            status: 'supabase_failed'
        };
        
        const existingBackups = JSON.parse(localStorage.getItem('failedPurchaseSaves') || '[]');
        existingBackups.push(backupData);
        localStorage.setItem('failedPurchaseSaves', JSON.stringify(existingBackups));
        
        console.log('💾 Saved to localStorage backup:', backupData);
        
        // Return a mock object so the flow continues
        return {
            id: 'backup_' + Date.now(),
            ...backupData
        };
    }
}

// Send email with eBook (using ENHANCED backup system)
async function sendEBookEmail(customerData) {
    try {
        console.log('🚀 Starting ENHANCED email delivery system for:', customerData.email);
        
        // Method 1: Use the production email service (FormSubmit iframe - PROVEN TO WORK)
        if (typeof sendProductionEmail !== 'undefined') {
            console.log('🔄 Using production email service (FormSubmit iframe)...');
            const productionResult = await sendProductionEmail(customerData);
            
            if (productionResult.success) {
                console.log('✅ Production email successful:', productionResult.message);
                return productionResult;
            } else {
                console.log('❌ Production email failed:', productionResult.message);
            }
        }

        // Method 2: Use the backup email service (comprehensive)
        if (typeof BackupEmailService !== 'undefined') {
            console.log('🔄 Using comprehensive backup email service...');
            const backupService = new BackupEmailService();
            const backupResult = await backupService.sendEmail(customerData);
            
            if (backupResult.success) {
                console.log(`✅ Email sent via ${backupResult.method}:`, backupResult.message);
                
                // Update health monitor if available
                if (window.healthMonitor) {
                    await window.healthMonitor.runHealthCheck();
                }
                
                return backupResult;
            } else {
                console.log('❌ All backup methods failed:', backupResult.message);
                // Continue to fallback methods below
            }
        }

        // Method 3: Use the simple working email service (backup)
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

        // Method 4: Direct FormSubmit iframe (manual fallback)
        console.log('🔄 Trying direct FormSubmit iframe fallback...');
        if (typeof window.runFormSubmitIframeTest !== 'undefined') {
            const iframeResult = await window.runFormSubmitIframeTest(customerData);
            
            if (iframeResult && iframeResult.success) {
                console.log('✅ Direct iframe method successful!');
                return {
                    success: true,
                    message: `Email sent successfully to ${customerData.email} via FormSubmit iframe!`,
                    service: 'formsubmit_iframe_fallback'
                };
            }
        }

        // Method 5: Direct Formspree (final backup)
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
        // Si es un ID de backup, no intentar actualizar la base de datos
        if (typeof purchaseId === 'string' && purchaseId.startsWith('backup_')) {
            console.log('📝 Skipping database update for backup ID:', purchaseId);
            return { success: true, message: 'Backup record - no database update needed' };
        }
        
        const { data, error } = await supabase
            .from('purchases')
            .update({ book_sent: true })
            .eq('id', purchaseId)
            .select();
        
        if (error) throw error;
        
        console.log('✅ Book sent status updated:', data);
        return data;
    } catch (error) {
        console.error('❌ Error updating book sent status:', error);
        // No lanzar el error, solo loggearlo
        return { success: false, error: error.message };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSupabase();
});
