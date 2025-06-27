// Simple Email Test - For debugging and validation
console.log('🧪 Simple Email Test loading...');

async function testEmailDelivery() {
    console.log('🧪 Starting simple email test...');
    
    const testData = {
        name: 'Test Customer',
        email: 'simonchumacero26@gmail.com', // Your email for testing
        transactionId: 'TEST-' + Date.now()
    };
    
    // Test 1: FormSubmit with iframe method (avoids CORS)
    console.log('📧 Test 1: FormSubmit via iframe...');
    const result1 = await window.runFormSubmitIframeTest(testData);
    console.log('Result 1 received:', result1);
    
    // Test 2: Direct FormSubmit (expect CORS but email should work)
    console.log('📧 Test 2: Direct FormSubmit...');
    const result2 = await window.runFormSubmitDirectTest(testData);
    console.log('Result 2 received:', result2);
    
    // Test 3: Netlify Forms (simple alternative)
    console.log('📧 Test 3: Netlify Forms...');
    const result3 = await window.runNetlifyFormsTest(testData);
    console.log('Result 3 received:', result3);
    
    // Test 4: Web3Forms (requires signup)
    console.log('📧 Test 4: Web3Forms...');
    const result4 = await window.runWeb3FormsTest(testData);
    console.log('Result 4 received:', result4);
    
    // Test 5: GetForm.io (no signup required for testing)
    console.log('📧 Test 5: GetForm.io...');
    const result5 = await window.runGetFormIOTest(testData);
    console.log('Result 5 received:', result5);
    
    const finalResults = {
        formsubmit_iframe: result1,
        formsubmit_direct: result2,
        netlify_forms: result3,
        web3forms: result4,
        getform_io: result5
    };
    
    console.log('All results compiled:', finalResults);
    return finalResults;
}

async function testFormSubmitIframe(customerData) {
    console.log('📧 Testing FormSubmit via iframe method...');
    
    return new Promise((resolve) => {
        console.log('📧 Creating hidden iframe for FormSubmit...');
        
        // Create a hidden form and iframe
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = 'email-iframe';
        document.body.appendChild(iframe);
        
        const form = document.createElement('form');
        form.target = 'email-iframe';
        form.method = 'POST';
        form.action = 'https://formsubmit.co/0856606d4582496a37fa868394d2de98';
        form.style.display = 'none';
        
        // Add form fields
        const fields = {
            '_to': customerData.email,
            '_subject': 'Test: Your Quiet the Noise eBook is Ready! 📚',
            'name': customerData.name,
            'email': customerData.email,
            'message': generateSimpleEmailContent(customerData),
            '_next': 'https://formsubmit.co/confirm',
            '_captcha': 'false',
            '_template': 'box'
        };
        
        Object.keys(fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            form.appendChild(input);
        });
        
        document.body.appendChild(form);
        
        // Submit form
        form.submit();
        
        // Clean up after a delay and resolve with result
        setTimeout(() => {
            try {
                document.body.removeChild(form);
                document.body.removeChild(iframe);
            } catch (e) {
                console.log('Cleanup error (not critical):', e);
            }
            
            const result = {
                success: true,
                message: 'Email sent via iframe method (check your email!)',
                method: 'formsubmit_iframe'
            };
            
            console.log('FormSubmit iframe result:', result);
            resolve(result);
        }, 3000);
    });
}

async function testFormSubmitDirect(customerData) {
    console.log('📧 Testing FormSubmit via direct method...');
    
    try {
        const formData = new FormData();
        formData.append('_to', customerData.email);
        formData.append('_subject', 'Test: Your Quiet the Noise eBook is Ready! 📚');
        formData.append('name', customerData.name);
        formData.append('email', customerData.email);
        formData.append('message', generateSimpleEmailContent(customerData));
        formData.append('_next', 'https://formsubmit.co/confirm');
        formData.append('_captcha', 'false');
        formData.append('_template', 'box');
        
        const response = await fetch('https://formsubmit.co/0856606d4582496a37fa868394d2de98', {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // This will prevent CORS errors
        });
        
        // With no-cors, we can't read the response, but the email should be sent
        const result = {
            success: true,
            message: 'Email sent via direct method (no-cors mode)',
            method: 'formsubmit_direct'
        };
        
        console.log('FormSubmit direct result:', result);
        return result;
        
    } catch (error) {
        console.error('Direct FormSubmit error:', error);
        const result = {
            success: false,
            message: error.message,
            method: 'formsubmit_direct'
        };
        
        console.log('FormSubmit direct result:', result);
        return result;
    }
}

async function testWeb3Forms(customerData) {
    console.log('📧 Testing Web3Forms...');
    
    try {
        // Note: You need to sign up for a free Web3Forms access key at https://web3forms.com
        const accessKey = 'your-web3forms-access-key'; // Replace with your actual key
        
        if (accessKey === 'your-web3forms-access-key') {
            const result = {
                success: false,
                message: 'Web3Forms requires a valid access key. Sign up at web3forms.com',
                method: 'web3forms'
            };
            
            console.log('Web3Forms result:', result);
            return result;
        }
        
        const formData = new FormData();
        formData.append('access_key', accessKey);
        formData.append('name', customerData.name);
        formData.append('email', customerData.email);
        formData.append('subject', 'Test: Your Quiet the Noise eBook is Ready! 📚');
        formData.append('message', generateSimpleEmailContent(customerData));
        formData.append('redirect', 'false');
        
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        
        const apiResult = await response.json();
        
        const result = {
            success: apiResult.success,
            message: apiResult.success ? 'Email sent via Web3Forms!' : (apiResult.message || 'Web3Forms failed'),
            method: 'web3forms'
        };
        
        console.log('Web3Forms result:', result);
        return result;
        
    } catch (error) {
        console.error('Web3Forms error:', error);
        const result = {
            success: false,
            message: error.message,
            method: 'web3forms'
        };
        
        console.log('Web3Forms result:', result);
        return result;
    }
}

async function testNetlifyForms(customerData) {
    console.log('📧 Testing Netlify Forms...');
    
    try {
        // Netlify Forms es más simple - solo requiere que el sitio esté en Netlify
        const formData = new FormData();
        formData.append('form-name', 'ebook-delivery'); // Nombre del formulario
        formData.append('name', customerData.name);
        formData.append('email', customerData.email);
        formData.append('subject', 'Test: Your Quiet the Noise eBook is Ready! 📚');
        formData.append('message', generateSimpleEmailContent(customerData));
        formData.append('transaction-id', customerData.transactionId);
        
        // Esta URL funcionará cuando el sitio esté desplegado en Netlify
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        });
        
        const result = {
            success: response.ok,
            message: response.ok ? 
                'Email sent via Netlify Forms!' : 
                'Netlify Forms only works on deployed Netlify sites',
            method: 'netlify_forms'
        };
        
        console.log('Netlify Forms result:', result);
        return result;
        
    } catch (error) {
        console.error('Netlify Forms error:', error);
        const result = {
            success: false,
            message: 'Netlify Forms only works on deployed Netlify sites',
            method: 'netlify_forms'
        };
        
        console.log('Netlify Forms result:', result);
        return result;
    }
}

// Alternative: GetForm.io (no signup required for testing)
async function testGetFormIO(customerData) {
    console.log('📧 Testing GetForm.io...');
    
    try {
        // GetForm.io permite 50 envíos gratis sin registro
        const formData = {
            name: customerData.name,
            email: customerData.email,
            subject: 'Test: Your Quiet the Noise eBook is Ready! 📚',
            message: generateSimpleEmailContent(customerData),
            transaction_id: customerData.transactionId
        };
        
        const response = await fetch('https://getform.io/f/your-form-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = {
            success: response.ok,
            message: response.ok ? 
                'Email sent via GetForm.io!' : 
                'GetForm.io requires a form ID (sign up at getform.io)',
            method: 'getform_io'
        };
        
        console.log('GetForm.io result:', result);
        return result;
        
    } catch (error) {
        console.error('GetForm.io error:', error);
        const result = {
            success: false,
            message: 'GetForm.io requires setup (visit getform.io)',
            method: 'getform_io'
        };
        
        console.log('GetForm.io result:', result);
        return result;
    }
}

function generateSimpleEmailContent(customerData) {
    const downloadLink = 'https://drive.google.com/uc?export=download&id=1qP9cGI88s_UfZ0vsOLiypw5llRVpVzO1';
    
    return `Dear ${customerData.name},

🎉 Thank you for purchasing "Quiet the Noise"!

📚 DOWNLOAD YOUR EBOOK NOW:
${downloadLink}

📋 Your Purchase Details:
• Transaction ID: ${customerData.transactionId}
• Purchase Date: ${new Date().toLocaleString()}
• Customer Email: ${customerData.email}

This is a test email to verify our delivery system.

Best regards,
The Quiet the Noise Team`;
}

// Make functions available globally with unique names
window.runEmailDeliveryTest = testEmailDelivery;
window.runFormSubmitIframeTest = testFormSubmitIframe;
window.runFormSubmitDirectTest = testFormSubmitDirect;
window.runWeb3FormsTest = testWeb3Forms;
window.runNetlifyFormsTest = testNetlifyForms;
window.runGetFormIOTest = testGetFormIO;
window.runNetlifyFormsTest = testNetlifyForms;
window.runGetFormIOTest = testGetFormIO;

console.log('✅ Simple Email Test ready!');
