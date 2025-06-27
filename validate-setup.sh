#!/bin/bash

# Validation Script for Quiet the Noise Purchase Flow
# This script validates the complete purchase flow setup

echo "🔍 Validating Quiet the Noise Purchase Flow..."
echo "================================================"

# Check if config.js exists and has required variables
echo "📁 Checking configuration files..."
if [ -f "js/config.js" ]; then
    echo "✅ config.js found"
    if grep -q "SUPABASE_URL" js/config.js; then
        echo "✅ Supabase URL configured"
    else
        echo "❌ Supabase URL not found in config"
    fi
    if grep -q "SMTP_EMAIL" js/config.js; then
        echo "✅ Email configuration found"
    else
        echo "❌ Email configuration not found"
    fi
else
    echo "❌ config.js not found"
fi

# Check if purchase-handler.js exists
echo ""
echo "📁 Checking purchase handler..."
if [ -f "js/purchase-handler.js" ]; then
    echo "✅ purchase-handler.js found"
    if grep -q "handleSuccessfulPurchase" js/purchase-handler.js; then
        echo "✅ handleSuccessfulPurchase function found"
    else
        echo "❌ handleSuccessfulPurchase function not found"
    fi
else
    echo "❌ purchase-handler.js not found"
fi

# Check if main.js has debounce function
echo ""
echo "📁 Checking main.js for required functions..."
if [ -f "js/main.js" ]; then
    echo "✅ main.js found"
    if grep -q "function debounce" js/main.js; then
        echo "✅ debounce function found"
    else
        echo "❌ debounce function not found"
    fi
    if grep -q "function initializePerformanceMonitoring" js/main.js; then
        echo "✅ initializePerformanceMonitoring function found"
    else
        echo "❌ initializePerformanceMonitoring function not found"
    fi
else
    echo "❌ main.js not found"
fi

# Check if index.html has PayPal integration
echo ""
echo "📁 Checking PayPal integration in index.html..."
if [ -f "index.html" ]; then
    echo "✅ index.html found"
    if grep -q "paypal.com/sdk/js" index.html; then
        echo "✅ PayPal SDK script found"
    else
        echo "❌ PayPal SDK script not found"
    fi
    if grep -q "paypal-container" index.html; then
        echo "✅ PayPal container found"
    else
        echo "❌ PayPal container not found"
    fi
    if grep -q "handleSuccessfulPurchase" index.html; then
        echo "✅ PayPal success handler found"
    else
        echo "❌ PayPal success handler not found"
    fi
else
    echo "❌ index.html not found"
fi

# Check if Supabase library is included
echo ""
echo "📁 Checking Supabase integration..."
if grep -q "@supabase/supabase-js" index.html; then
    echo "✅ Supabase library included"
else
    echo "❌ Supabase library not included"
fi

# Check if test file exists
echo ""
echo "📁 Checking test files..."
if [ -f "test-purchase-flow.html" ]; then
    echo "✅ Test file found"
else
    echo "❌ Test file not found"
fi

echo ""
echo "🎯 Validation complete!"
echo ""
echo "🚀 Next Steps:"
echo "1. Open http://localhost:8080 in your browser"
echo "2. Open http://localhost:8080/test-purchase-flow.html for testing"
echo "3. Check browser console for any JavaScript errors"
echo "4. Try a PayPal test purchase"
echo ""
echo "🔧 If you encounter issues:"
echo "- Check the browser console for errors"
echo "- Verify Supabase credentials are correct"
echo "- Ensure PayPal sandbox credentials are valid"
echo "- Test individual components using the test page"
