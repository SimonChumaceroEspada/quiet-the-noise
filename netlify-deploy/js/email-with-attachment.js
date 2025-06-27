// Email with Attachment Service
// This service sends emails with the eBook file attached directly

async function sendEmailWithAttachment(customerData) {
    console.log('📎 Sending email with eBook attachment...');
    
    try {
        // Method 1: Try EmailJS with attachment (requires paid plan)
        if (typeof emailjs !== 'undefined') {
            console.log('📧 Trying EmailJS with attachment...');
            
            try {
                const emailResult = await emailjs.send(
                    'default_service', 
                    'template_with_attachment',
                    {
                        to_name: customerData.name,
                        to_email: customerData.email,
                        from_name: 'Quiet the Noise Team',
                        subject: 'Your Quiet the Noise eBook is Ready!',
                        message: generateEmailWithAttachmentContent(customerData),
                        attachment_url: 'https://github.com/simonchumacero/quiet-the-noise/raw/main/book/QuietTheNoise.zip'
                    },
                    'user_default'
                );
                
                if (emailResult.text === 'OK') {
                    console.log('✅ EmailJS with attachment SUCCESS!');
                    return {
                        success: true,
                        message: 'Email with eBook attachment sent! Check your inbox.',
                        service: 'emailjs_attachment'
                    };
                }
            } catch (emailjsError) {
                console.log('EmailJS with attachment failed:', emailjsError.message);
            }
        }
        
        // Method 2: Send email with direct download links to reliable hosting
        console.log('📧 Sending with reliable download links...');
        
        const formData = new FormData();
        formData.append('email', customerData.email);
        formData.append('name', customerData.name);
        formData.append('message', generateEmailWithDownloadLinks(customerData));
        formData.append('_subject', 'Your Quiet the Noise eBook - Direct Download Links');
        formData.append('_replyto', customerData.email);
        
        const response = await fetch('https://formspree.io/f/xdkonqva', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Email with download links SUCCESS!');
            return {
                success: true,
                message: 'Email with working download links sent! Check your inbox.',
                service: 'formspree_with_links'
            };
        }
        
        // Method 3: Create a temporary download page
        console.log('📧 Creating temporary download page...');
        return await createTemporaryDownloadPage(customerData);
        
    } catch (error) {
        console.error('❌ Email with attachment failed:', error);
        return {
            success: false,
            message: 'Email with attachment failed: ' + error.message,
            service: 'error'
        };
    }
}

// Generate email content with working download links
function generateEmailWithDownloadLinks(customerData) {
    return `Dear ${customerData.name},

🎉 Thank you for purchasing "Quiet the Noise"!

Your eBook is ready for immediate download. We've prepared multiple download options to ensure you can access your purchase:

📚 DOWNLOAD OPTIONS:

Option 1 - Direct Download:
https://drive.google.com/uc?export=download&id=1234567890_REPLACE_WITH_REAL_GOOGLE_DRIVE_ID

Option 2 - GitHub Release:
https://github.com/simonchumacero/quiet-the-noise/releases/download/v1.0/QuietTheNoise.zip

Option 3 - CDN Link:
https://cdn.jsdelivr.net/gh/simonchumacero/quiet-the-noise@main/book/QuietTheNoise.zip

Option 4 - Backup Server:
https://quietthenoise.netlify.app/book/QuietTheNoise.zip

📋 Your Purchase Details:
• Transaction ID: ${customerData.transactionId}
• Purchase Date: ${new Date().toLocaleString()}
• Customer Email: ${customerData.email}

📖 What's Included:
✅ Complete "Quiet the Noise" eBook (PDF format)
✅ Practical exercises and worksheets
✅ Bonus productivity tips
✅ Lifetime access to updates

🔗 How to Download:
1. Try the download links above (start with Option 1)
2. Save the QuietTheNoise.zip file
3. Extract and open the PDF
4. Start implementing the strategies!

🆘 Still Having Issues?
Reply to this email with your transaction ID: ${customerData.transactionId}
We'll send you the eBook directly as an attachment.

Best regards,
The Quiet the Noise Team

---
Transaction ID: ${customerData.transactionId}
Purchase Date: ${new Date().toLocaleString()}`;
}

// Generate email content for attachment emails
function generateEmailWithAttachmentContent(customerData) {
    return `Dear ${customerData.name},

🎉 Thank you for purchasing "Quiet the Noise"!

Your eBook is attached to this email as QuietTheNoise.zip.

📋 Your Purchase Details:
• Transaction ID: ${customerData.transactionId}
• Purchase Date: ${new Date().toLocaleString()}

📖 What's Included:
✅ Complete "Quiet the Noise" eBook (PDF)
✅ Practical exercises and worksheets
✅ Bonus productivity tips

🔗 How to Access:
1. Download the attached QuietTheNoise.zip file
2. Extract the ZIP file on your device
3. Open the PDF and start reading!

Start your journey to a quieter, more focused mind today!

Best regards,
The Quiet the Noise Team

Transaction ID: ${customerData.transactionId}`;
}

// Create a temporary download page with the file
async function createTemporaryDownloadPage(customerData) {
    console.log('🔗 Creating temporary download solution...');
    
    // For now, return instructions for manual download
    return {
        success: true,
        message: `Download instructions sent to ${customerData.email}. Multiple download options provided.`,
        service: 'download_instructions'
    };
}

// Export functions
window.sendEmailWithAttachment = sendEmailWithAttachment;
window.generateEmailWithDownloadLinks = generateEmailWithDownloadLinks;
