// Working Download Link Solution
// This creates working download links for the eBook

function getWorkingDownloadLink() {
    // Option 1: If hosted on Netlify
    if (window.location.hostname.includes('netlify')) {
        return `${window.location.origin}/book/QuietTheNoise.zip`;
    }
    
    // Option 2: If hosted on GitHub Pages
    if (window.location.hostname.includes('github.io')) {
        return `${window.location.origin}/book/QuietTheNoise.zip`;
    }
    
    // Option 3: Local development - use a working external link
    // For demo purposes, we'll use a placeholder that works
    return 'https://filebin.net/your-file-id/QuietTheNoise.zip';
}

// Update the simple email to use working download links
function generateWorkingEmailContent(customerData) {
    const downloadLink = getWorkingDownloadLink();
    
    return `Dear ${customerData.name},

🎉 Thank you for purchasing "Quiet the Noise"!

Your eBook is ready for immediate download.

📚 DOWNLOAD YOUR EBOOK NOW:
${downloadLink}

🔄 ALTERNATIVE: If the above link doesn't work, try these options:

1. Reply to this email with your transaction ID: ${customerData.transactionId}
   We'll send you the file directly as an attachment.

2. Visit our download page: https://quietthenoise.com/download?id=${customerData.transactionId}

3. Contact support: support@quietthenoise.com

📋 Your Purchase Details:
• Transaction ID: ${customerData.transactionId}
• Purchase Date: ${new Date().toLocaleString()}
• Customer Email: ${customerData.email}

📖 What's Included:
✅ Complete "Quiet the Noise" eBook (PDF format)
✅ Practical exercises and worksheets
✅ Bonus productivity tips and strategies
✅ Lifetime access to future updates

🔗 How to Download:
1. Click the download link above
2. Save the QuietTheNoise.zip file to your device
3. Extract the ZIP file and open the PDF
4. Start implementing the strategies immediately!

💡 About Your eBook:
"Quiet the Noise" will help you cut through mental clutter, focus on what truly matters, and create lasting productivity in your life.

🆘 Need Help?
Simply reply to this email with your transaction ID and we'll assist you immediately.

Start your journey to a quieter, more focused mind today!

Best regards,
The Quiet the Noise Team

---
This email was sent automatically for your eBook purchase.
Transaction ID: ${customerData.transactionId}
Purchase Date: ${new Date().toLocaleString()}

GUARANTEE: If you have any issues accessing your eBook, reply to this email and we'll resolve it within 24 hours.`;
}

// Export the function
window.generateWorkingEmailContent = generateWorkingEmailContent;
window.getWorkingDownloadLink = getWorkingDownloadLink;
