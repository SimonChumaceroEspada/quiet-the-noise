// Production Validation Script
// Run this before going live to ensure everything works

console.log('🚀 PRODUCTION VALIDATION SCRIPT');
console.log('================================');

// Global validation results
let validationResults = {
    paypal: false,
    supabase: false,
    email: false,
    overall: false
};

// Run all validation tests
async function runProductionValidation() {
    console.log('🔍 Starting production validation...');
    
    try {
        // Test 1: PayPal Configuration
        console.log('\n📋 TEST 1: PayPal Configuration');
        validationResults.paypal = await validatePayPal();
        
        // Test 2: Supabase Connection
        console.log('\n📋 TEST 2: Supabase Database');
        validationResults.supabase = await validateSupabase();
        
        // Test 3: Email Service
        console.log('\n📋 TEST 3: Email Service');
        validationResults.email = await validateEmailService();
        
        // Final Results
        console.log('\n🎯 VALIDATION RESULTS');
        console.log('=====================');
        displayResults();
        
    } catch (error) {
        console.error('❌ Validation failed:', error);
    }
}

// Validate PayPal Configuration
async function validatePayPal() {
    try {
        console.log('🔍 Checking PayPal SDK...');
        
        if (typeof paypal === 'undefined') {
            console.error('❌ PayPal SDK not loaded');
            return false;
        }
        
        // Check if production client ID is configured
        const scripts = document.querySelectorAll('script[src*="paypal.com/sdk"]');
        let hasProductionClientId = false;
        
        scripts.forEach(script => {
            if (script.src.includes('client-id=BAAdtIP4N39_Grc65N4rXgCcuW2TEEB5MyXfq1r3BGmNWFTaK3OMhKc_3zIZl4oI622oMTkhOcSJ_OriNo')) {
                hasProductionClientId = true;
            }
        });
        
        if (!hasProductionClientId) {
            console.error('❌ Production PayPal Client ID not found');
            return false;
        }
        
        // Check if PayPal container exists
        const container = document.getElementById('paypal-container-DG2V4FLX49RM8');
        if (!container) {
            console.error('❌ PayPal container not found');
            return false;
        }
        
        console.log('✅ PayPal configuration valid');
        return true;
        
    } catch (error) {
        console.error('❌ PayPal validation error:', error);
        return false;
    }
}

// Validate Supabase Connection
async function validateSupabase() {
    try {
        console.log('🔍 Checking Supabase connection...');
        
        if (typeof window.supabase === 'undefined') {
            console.error('❌ Supabase library not loaded');
            return false;
        }
        
        if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
            console.error('❌ Supabase configuration missing');
            return false;
        }
        
        // Create Supabase client
        const testClient = window.supabase.createClient(
            CONFIG.SUPABASE_URL,
            CONFIG.SUPABASE_ANON_KEY
        );
        
        // Test connection with a simple query
        console.log('🔍 Testing database connection...');
        const { data, error } = await testClient
            .from('purchases')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('❌ Supabase connection error:', error);
            return false;
        }
        
        console.log('✅ Supabase connection valid');
        return true;
        
    } catch (error) {
        console.error('❌ Supabase validation error:', error);
        return false;
    }
}

// Validate Email Service
async function validateEmailService() {
    try {
        console.log('🔍 Checking email service...');
        
        if (typeof sendProductionEmail === 'undefined') {
            console.error('❌ Production email service not loaded');
            return false;
        }
        
        // Check FormSubmit token
        if (typeof FORMSUBMIT_TOKENS === 'undefined') {
            console.error('❌ FormSubmit tokens not configured');
            return false;
        }
        
        const currentToken = getFormSubmitToken();
        if (!currentToken || currentToken === 'YOUR_TOKEN_HERE') {
            console.error('❌ FormSubmit token not configured');
            return false;
        }
        
        console.log('✅ Email service configuration valid');
        console.log(`   Using token: ${currentToken}`);
        return true;
        
    } catch (error) {
        console.error('❌ Email service validation error:', error);
        return false;
    }
}

// Display validation results
function displayResults() {
    const allPassed = validationResults.paypal && validationResults.supabase && validationResults.email;
    
    console.log(`PayPal:   ${validationResults.paypal ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Supabase: ${validationResults.supabase ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Email:    ${validationResults.email ? '✅ PASS' : '❌ FAIL'}`);
    console.log('---------------------');
    
    if (allPassed) {
        console.log('🎉 ALL TESTS PASSED - READY FOR PRODUCTION!');
        console.log('🚀 You can now accept real PayPal payments');
    } else {
        console.log('❌ VALIDATION FAILED - FIX ISSUES BEFORE GOING LIVE');
        console.log('🔧 Check the errors above and fix them');
    }
    
    validationResults.overall = allPassed;
    return allPassed;
}

// Auto-run validation when script loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.location.pathname.includes('test-purchase-flow.html')) {
            console.log('🧪 Test page detected, validation available via runProductionValidation()');
        } else {
            runProductionValidation();
        }
    }, 2000);
});

// Make function available globally
window.runProductionValidation = runProductionValidation;
window.validationResults = validationResults;
