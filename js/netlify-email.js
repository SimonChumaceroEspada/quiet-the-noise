// Netlify Forms Email Service
// This works automatically if you deploy to Netlify

async function sendViaNetlifyForms(customerData) {
    try {
        console.log('📧 Sending email via Netlify Forms...');
        
        const formData = new FormData();
        formData.append('form-name', 'ebook-delivery');
        formData.append('name', customerData.name);
        formData.append('email', customerData.email);
        formData.append('transaction_id', customerData.transactionId);
        formData.append('subject', 'Your Quiet the Noise eBook is Ready!');
        formData.append('message', generateNetlifyEmailContent(customerData));
        
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData)
        });
        
        if (response.ok) {
            return { 
                success: true, 
                message: 'Email sent automatically via Netlify Forms!',
                service: 'netlify'
            };
        }
        
        throw new Error('Netlify Forms submission failed');
        
    } catch (error) {
        console.error('Netlify Forms failed:', error);
        throw error;
    }
}

function generateNetlifyEmailContent(customerData) {
    return `
Dear ${customerData.name},

Thank you for purchasing "Quiet the Noise"!

Your eBook is ready: ${window.location.origin}/book/QuietTheNoise.zip
Transaction ID: ${customerData.transactionId}

Best regards,
The Quiet the Noise Team
    `;
}

// Add hidden form to HTML for Netlify Forms to detect
function addNetlifyForm() {
    const form = document.createElement('form');
    form.setAttribute('name', 'ebook-delivery');
    form.setAttribute('netlify', '');
    form.setAttribute('hidden', '');
    
    const fields = ['name', 'email', 'transaction_id', 'subject', 'message'];
    fields.forEach(field => {
        const input = document.createElement('input');
        input.setAttribute('name', field);
        form.appendChild(input);
    });
    
    document.body.appendChild(form);
}

// Add form when page loads
document.addEventListener('DOMContentLoaded', addNetlifyForm);
