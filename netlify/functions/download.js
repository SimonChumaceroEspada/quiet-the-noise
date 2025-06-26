// Secure Download Function for Quiet the Noise eBook
const { getPurchaseByToken, incrementDownloadCount, validateDownload, getFileBuffer } = require('./utils/supabase');

// Generate download page HTML
function generateDownloadPage(downloadUrl, customerName, remainingDownloads) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Download Your eBook - Quiet the Noise</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); max-width: 500px; width: 100%; text-align: center; }
            .header { margin-bottom: 30px; }
            .title { color: #333; font-size: 28px; margin-bottom: 10px; font-weight: 600; }
            .subtitle { color: #666; font-size: 16px; margin-bottom: 30px; }
            .download-btn { display: inline-block; background: linear-gradient(135deg, #059669, #047857); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; transition: all 0.3s ease; border: none; cursor: pointer; }
            .download-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3); }
            .info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: left; }
            .remaining { color: #059669; font-weight: bold; }
            .footer { color: #666; font-size: 14px; margin-top: 30px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">🎉 Download Ready!</h1>
                <p class="subtitle">Thank you for your purchase${customerName ? `, ${customerName}` : ''}!</p>
            </div>
            
            <a href="${downloadUrl}" class="download-btn" onclick="handleDownload()">
                📥 Download "Quiet the Noise" eBook
            </a>
            
            <div class="info">
                <p><strong>What's included:</strong></p>
                <p>✓ PDF format (universal compatibility)<br>
                ✓ ePub format (e-reader optimized)</p>
                
                <p style="margin-top: 15px;">
                    <span class="remaining">Remaining downloads: ${remainingDownloads}</span>
                </p>
            </div>
            
            <div class="footer">
                <p>Download link expires in 30 days | © 2025 Quiet the Noise</p>
                <p>Need help? Contact us at support@quietthenoise.com</p>
            </div>
        </div>
        
        <script>
            function handleDownload() {
                // Track download attempt
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'download', {
                        'event_category': 'eBook',
                        'event_label': 'Quiet the Noise'
                    });
                }
                
                // Show success message after a delay
                setTimeout(() => {
                    alert('Download started! Please check your downloads folder for "QuietTheNoise.zip"');
                }, 1000);
            }
            
            // Auto-hide address bar on mobile
            window.addEventListener('load', () => {
                setTimeout(() => {
                    window.scrollTo(0, 1);
                }, 0);
            });
        </script>
    </body>
    </html>
    `;
}

// Generate error page HTML
function generateErrorPage(errorMessage) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Download Error - Quiet the Noise</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); max-width: 500px; width: 100%; text-align: center; }
            .error-icon { font-size: 48px; margin-bottom: 20px; }
            .title { color: #dc2626; font-size: 24px; margin-bottom: 20px; font-weight: 600; }
            .message { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
            .contact-btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .contact-btn:hover { background: #1d4ed8; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="error-icon">⚠️</div>
            <h1 class="title">Download Error</h1>
            <p class="message">${errorMessage}</p>
            <a href="mailto:support@quietthenoise.com" class="contact-btn">
                Contact Support
            </a>
        </div>
    </body>
    </html>
    `;
}

// Main download handler
exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only handle GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: { ...headers, 'Content-Type': 'text/html' },
            body: generateErrorPage('Method not allowed. Please use the link from your email.')
        };
    }

    try {
        // Get download token from query parameters
        const token = event.queryStringParameters?.token;
        
        if (!token) {
            return {
                statusCode: 400,
                headers: { ...headers, 'Content-Type': 'text/html' },
                body: generateErrorPage('Download token is missing. Please use the link from your email.')
            };
        }

        console.log('Processing download request for token:', token);

        // Validate download eligibility
        const validation = await validateDownload(token);
        
        if (!validation.valid) {
            let errorMessage = 'Download not available.';
            
            if (validation.reason === 'Token not found') {
                errorMessage = 'Invalid download link. Please check the link from your email or contact support.';
            } else if (validation.reason === 'Token expired') {
                errorMessage = 'This download link has expired (30 days). Please contact support for assistance.';
            } else if (validation.reason === 'Download limit exceeded') {
                errorMessage = 'You have reached the maximum number of downloads (3) for this purchase.';
            }
            
            return {
                statusCode: 400,
                headers: { ...headers, 'Content-Type': 'text/html' },
                body: generateErrorPage(errorMessage)
            };
        }

        // Check if this is a direct download request (has 'download=true' parameter)
        const directDownload = event.queryStringParameters?.download === 'true';        if (directDownload) {
            // Increment download count
            await incrementDownloadCount(token);

            try {
                // Get file from Supabase Storage
                const fileBuffer = await getFileBuffer('QuietTheNoise.zip');
                
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/zip',
                        'Content-Disposition': 'attachment; filename="QuietTheNoise-eBook.zip"',
                        'Content-Length': fileBuffer.size.toString(),
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    },
                    body: Buffer.from(await fileBuffer.arrayBuffer()).toString('base64'),
                    isBase64Encoded: true
                };
            } catch (fileError) {
                console.error('Error serving file:', fileError);
                return {
                    statusCode: 500,
                    headers: { ...headers, 'Content-Type': 'text/html' },
                    body: generateErrorPage('There was an error preparing your download. Please contact support.')
                };
            }
        } else {
            // Show download page with button
            const downloadUrl = `${process.env.SITE_URL}/.netlify/functions/download?token=${token}&download=true`;
            
            return {
                statusCode: 200,
                headers: { ...headers, 'Content-Type': 'text/html' },
                body: generateDownloadPage(
                    downloadUrl, 
                    validation.purchase.customer_name,
                    validation.remainingDownloads
                )
            };
        }

    } catch (error) {
        console.error('Download handler error:', error);
        
        return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'text/html' },
            body: generateErrorPage('Internal server error. Please contact support if this problem persists.')
        };
    }
};
