#!/bin/bash

# Manual Email Sender Script
# This script helps you send the eBook manually while we fix the automated system

echo "📧 Manual Email Sender for Quiet the Noise"
echo "==========================================="
echo ""

# Check if we have email data from the database
echo "🔍 Checking pending emails in database..."

# You'll need to run this from your Supabase dashboard or using a database client
cat << 'EOF'
SQL Query to get pending emails:
SELECT 
    id,
    name,
    email,
    transaction_id,
    status,
    created_at,
    email_content
FROM pending_emails 
WHERE status IN ('pending', 'ready_to_send', 'pending_manual_send')
ORDER BY created_at DESC
LIMIT 10;
EOF

echo ""
echo "📋 Manual Steps to Send eBook:"
echo "1. Use your Gmail account (clarityreads26@gmail.com)"
echo "2. Send email to the customer with these details:"
echo ""
echo "   To: simonchumacero26@gmail.com"
echo "   Subject: Quiet the Noise - Your eBook is Ready!"
echo "   Attachment: book/QuietTheNoise.zip"
echo ""
echo "3. Email Template:"
echo "---"
cat << 'EOF'
Dear Simon,

Thank you for purchasing "Quiet the Noise"!

Your eBook is attached to this email. The download includes:
• Complete PDF version of the book
• EPUB format for mobile devices
• Bonus materials and worksheets

Your transaction has been processed successfully.

If you have any questions or issues accessing the book, please reply to this email.

Best regards,
The Quiet the Noise Team

---
This email was sent manually for your test purchase.
EOF
echo "---"
echo ""
echo "4. After sending, update the database:"
echo "   UPDATE pending_emails SET status = 'sent' WHERE email = 'simonchumacero26@gmail.com';"
echo ""
echo "💡 To automate this process, we need to:"
echo "   - Set up Supabase Edge Functions, OR"
echo "   - Use a service like EmailJS, OR" 
echo "   - Set up a server-side email API"
echo ""
echo "✅ For now, manual sending will work perfectly for testing!"
