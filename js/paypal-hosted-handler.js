// PayPal Hosted Button Handler for Production
// This script handles the official PayPal hosted button integration

(function() {
    'use strict';

    // Configuration
    const HOSTED_BUTTON_ID = 'DG2V4FLX49RM8'; // Your official PayPal hosted button ID
    const CONTAINER_ID = 'paypal-container-DG2V4FLX49RM8';
    
    // PayPal hosted handler object
    window.paypalHostedHandler = {
        initialized: false,
        
        // Initialize the PayPal hosted button
        init: function() {
            console.log('🏪 Initializing PayPal Hosted Button Handler...');
            
            if (this.initialized) {
                console.log('⚠️ PayPal hosted handler already initialized');
                return;
            }
            
            this.setupHostedButton();
            this.initialized = true;
        },
        
        // Setup the official hosted button
        setupHostedButton: function() {
            const container = document.getElementById(CONTAINER_ID);
            if (!container) {
                console.error('❌ PayPal container not found:', CONTAINER_ID);
                return;
            }
            
            console.log('🔧 Setting up PayPal hosted button...');
            
            // Check if PayPal SDK is loaded
            if (typeof paypal === 'undefined') {
                console.error('❌ PayPal SDK not loaded');
                this.fallbackToDirectButton();
                return;
            }
            
            try {
                // Render the hosted button
                paypal.HostedButtons({
                    hostedButtonId: HOSTED_BUTTON_ID,
                }).render('#' + CONTAINER_ID).then(() => {
                    console.log('✅ PayPal hosted button rendered successfully');
                    this.setupSuccessHandlers();
                }).catch((error) => {
                    console.error('❌ Error rendering PayPal hosted button:', error);
                    this.fallbackToDirectButton();
                });
                
            } catch (error) {
                console.error('❌ Error setting up PayPal hosted button:', error);
                this.fallbackToDirectButton();
            }
        },
        
        // Setup success handlers for the hosted button
        setupSuccessHandlers: function() {
            console.log('🔧 Setting up PayPal success handlers...');
            
            // Monitor for PayPal success via URL parameters (return from PayPal)
            this.monitorForReturnUrl();
            
            // Set up global success handler
            if (!window.onPayPalSuccess) {
                window.onPayPalSuccess = this.handlePayPalSuccess.bind(this);
            }
        },
        
        // Monitor for PayPal return URL
        monitorForReturnUrl: function() {
            const urlParams = new URLSearchParams(window.location.search);
            const paymentId = urlParams.get('paymentId');
            const token = urlParams.get('token');
            const PayerID = urlParams.get('PayerID');
            
            if (paymentId && token && PayerID) {
                console.log('🎉 PayPal payment detected from return URL!');
                console.log('Payment details:', { paymentId, token, PayerID });
                
                // Handle the successful payment
                this.handlePayPalSuccess({
                    payer: {
                        email_address: 'customer@paypal.com' // PayPal doesn't provide email in return URL
                    }
                }, {
                    paymentID: paymentId,
                    payerID: PayerID
                });
            }
        },
        
        // Handle PayPal success
        handlePayPalSuccess: function(details, data) {
            console.log('🎉 PayPal payment successful!');
            console.log('Payment details:', details);
            console.log('Payment data:', data);
            
            // Extract customer information
            const customerData = {
                name: details.payer?.name?.given_name + ' ' + (details.payer?.name?.surname || '') || 'PayPal Customer',
                email: details.payer?.email_address || 'customer@paypal.com',
                amount: '$1.00',
                paymentMethod: 'paypal_hosted'
            };
            
            console.log('👤 Customer data:', customerData);
            
            // Process the purchase using the global handler
            if (window.processPayPalPurchase) {
                window.processPayPalPurchase(customerData);
            } else if (window.purchaseHandler && window.purchaseHandler.processPurchase) {
                window.purchaseHandler.processPurchase(customerData);
            } else {
                console.error('❌ No purchase handler found');
                this.showSuccessMessage(customerData);
            }
        },
        
        // Fallback to direct button if hosted button fails
        fallbackToDirectButton: function() {
            console.log('🔄 Falling back to direct PayPal button...');
            
            const container = document.getElementById(CONTAINER_ID);
            if (!container) return;
            
            // Clear container and add fallback content
            container.innerHTML = `
                <div class="paypal-fallback">
                    <p>Loading PayPal payment...</p>
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                        <input type="hidden" name="cmd" value="_s-xclick">
                        <input type="hidden" name="hosted_button_id" value="${HOSTED_BUTTON_ID}">
                        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
                        <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
                    </form>
                </div>
            `;
            
            console.log('✅ PayPal fallback button added');
        },
        
        // Show success message if no handler is available
        showSuccessMessage: function(customerData) {
            console.log('📧 Showing success message for:', customerData);
            
            if (window.showNotification) {
                window.showNotification('🎉 Payment successful! Check your email for the download link.', 'success');
            } else {
                alert('Payment successful! Check your email for the download link.');
            }
        }
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => window.paypalHostedHandler.init(), 1000);
        });
    } else {
        // DOM is already ready
        setTimeout(() => window.paypalHostedHandler.init(), 1000);
    }
    
    console.log('🏪 PayPal Hosted Handler script loaded');
})();
