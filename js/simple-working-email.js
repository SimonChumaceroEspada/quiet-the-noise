// Simple Working Email Service - Debug Version
console.log('� Loading simple-working-email.js...');

// Test function to verify loading
function testEmailServiceLoad() {
    console.log('📧 Email service test function called');
    return true;
}

async function sendSimpleWorkingEmail(customerData) {
    console.log('🚀 sendSimpleWorkingEmail called with:', customerData);
    
    try {
        console.log('📧 Trying Formspree...');
        
        const formData = new FormData();
        formData.append('email', customerData.email);
        formData.append('name', customerData.name);
        formData.append('message', generateSimpleEmailContent(customerData));
        formData.append('_subject', 'Your Quiet the Noise eBook is Ready!');
        formData.append('_replyto', customerData.email);
        
        console.log('📧 FormData prepared:', {
            email: customerData.email,
            name: customerData.name,
            subject: 'Your Quiet the Noise eBook is Ready!'
        });
        
        const response = await fetch('https://formspree.io/f/xdkonqva', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('📧 Formspree response status:', response.status);
        console.log('📧 Formspree response headers:', response.headers);
        
        const responseText = await response.text();
        console.log('📧 Formspree response text:', responseText);
        
        if (response.ok) {
            console.log('✅ Formspree SUCCESS!');
            return {
                success: true,
                message: 'Email sent via Formspree! Check your inbox in 2-5 minutes.',
                service: 'formspree'
            };
        } else {
            console.log('❌ Formspree failed with status:', response.status);
            console.log('❌ Formspree error response:', responseText);
            
            // Try alternative method: direct JSON
            console.log('📧 Trying Formspree with JSON...');
            
            const jsonResponse = await fetch('https://formspree.io/f/xdkonqva', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: customerData.email,
                    name: customerData.name,
                    message: generateSimpleEmailContent(customerData),
                    _subject: 'Your Quiet the Noise eBook is Ready!',
                    _replyto: customerData.email
                })
            });
            
            console.log('📧 JSON response status:', jsonResponse.status);
            const jsonResponseText = await jsonResponse.text();
            console.log('📧 JSON response text:', jsonResponseText);
            
            if (jsonResponse.ok) {
                console.log('✅ JSON Formspree SUCCESS!');
                return {
                    success: true,
                    message: 'Email sent via JSON Formspree! Check your inbox in 2-5 minutes.',
                    service: 'formspree_json'
                };
            }
            
            // Try Web3Forms as final backup
            console.log('📧 Trying Web3Forms as backup...');
            
            const web3Response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_key: '550e8400-e29b-41d4-a716-446655440000',
                    name: customerData.name,
                    email: customerData.email,
                    subject: 'Your Quiet the Noise eBook is Ready!',
                    message: generateSimpleEmailContent(customerData)
                })
            });
            
            console.log('📧 Web3Forms status:', web3Response.status);
            const web3Text = await web3Response.text();
            console.log('📧 Web3Forms response:', web3Text);
            
            if (web3Response.ok) {
                const web3Result = JSON.parse(web3Text);
                if (web3Result.success) {
                    console.log('✅ Web3Forms SUCCESS!');
                    return {
                        success: true,
                        message: 'Email sent via Web3Forms! Check your inbox in 2-5 minutes.',
                        service: 'web3forms'
                    };
                }
            }
            
            // Try FormSubmit as final fallback
            console.log('📧 Trying FormSubmit as final fallback...');
            
            const submitFormData = new FormData();
            submitFormData.append('_to', customerData.email);
            submitFormData.append('_subject', 'Your Quiet the Noise eBook is Ready!');
            submitFormData.append('name', customerData.name);
            submitFormData.append('email', customerData.email);
            submitFormData.append('message', generateSimpleEmailContent(customerData));
            submitFormData.append('_next', window.location.href);
            submitFormData.append('_captcha', 'false');
            
            // Use the activation token from FormSubmit
            const submitResponse = await fetch('https://formsubmit.co/0856606d4582496a37fa868394d2de98', {
                method: 'POST',
                body: submitFormData
            });
            
            console.log('📧 FormSubmit status:', submitResponse.status);
            
            if (submitResponse.ok || submitResponse.status === 200) {
                console.log('✅ FormSubmit SUCCESS!');
                return {
                    success: true,
                    message: 'Email sent via FormSubmit! Check your inbox in 2-5 minutes.',
                    service: 'formsubmit'
                };
            }
        }
        
        console.log('❌ All methods failed');
        return {
            success: false,
            message: `Email sending failed. Formspree status: ${response.status}, Response: ${responseText}`,
            service: 'none'
        };
        
    } catch (error) {
        console.error('❌ Email error:', error);
        return {
            success: false,
            message: 'Email service error: ' + error.message,
            service: 'error'
        };
    }
}

function generateSimpleEmailContent(customerData) {
    const downloadLink = 'https://drive.google.com/uc?export=download&id=1qP9cGI88s_UfZ0vsOLiypw5llRVpVzO1';
    
    return `Dear ${customerData.name},

🎉 Thank you for purchasing "Quiet the Noise"!

📚 DOWNLOAD YOUR EBOOK NOW:
${downloadLink}

Transaction ID: ${customerData.transactionId}
Purchase Date: ${new Date().toLocaleString()}

Best regards,
The Quiet the Noise Team`;
}

// Export functions
console.log('🔧 Exporting functions to window...');
window.sendSimpleWorkingEmail = sendSimpleWorkingEmail;
window.generateSimpleEmailContent = generateSimpleEmailContent;
window.testEmailServiceLoad = testEmailServiceLoad;

console.log('✅ simple-working-email.js loaded successfully!');
console.log('✅ Functions available:', {
    sendSimpleWorkingEmail: typeof window.sendSimpleWorkingEmail,
    generateSimpleEmailContent: typeof window.generateSimpleEmailContent,
    testEmailServiceLoad: typeof window.testEmailServiceLoad
});
