// Site Configuration
// Enable/disable features for testing and optimization

const CONFIG = {
    // Analytics
    GOOGLE_ANALYTICS_ID: 'G-XXXXXXXXXX', // Replace with your GA4 Measurement ID
    FACEBOOK_PIXEL_ID: 'YOUR_PIXEL_ID_HERE', // Replace with your Facebook Pixel ID
    
    // Payment
    STRIPE_PUBLISHABLE_KEY: 'pk_test_YOUR_STRIPE_KEY_HERE', // Replace with your Stripe key
    
    // Features
    ENABLE_AB_TESTING: true,
    ENABLE_EXIT_INTENT: false, // Set to true to enable exit intent modal
    ENABLE_SOCIAL_PROOF: false, // Set to true to enable social proof notifications
    ENABLE_URGENCY_TIMER: false, // Set to true to enable countdown timer
    
    // Contact Information
    SUPPORT_EMAIL: 'support@quietthenoise.com',
    REFUNDS_EMAIL: 'refunds@quietthenoise.com',
    BUSINESS_NAME: 'Quiet the Noise',
      // Product Details
    BOOK_PRICE: 7.99,
    BOOK_CURRENCY: 'USD',
    
    // SEO
    SITE_URL: 'https://quietthenoise.com',
    SITE_NAME: 'Quiet the Noise',
    
    // Development
    DEBUG_MODE: false // Set to true for console logging
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Make available globally
window.CONFIG = CONFIG;
