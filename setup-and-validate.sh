#!/bin/bash

# Automated Setup Script for Quiet the Noise Purchase Flow
# This script helps configure and validate the purchase flow setup

echo "🚀 Quiet the Noise - Purchase Flow Setup Script"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    case $2 in
        "success") echo -e "${GREEN}✅ $1${NC}" ;;
        "error") echo -e "${RED}❌ $1${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $1${NC}" ;;
        "info") echo -e "${BLUE}ℹ️  $1${NC}" ;;
        *) echo "$1" ;;
    esac
}

# Check if required files exist
check_files() {
    print_status "Checking required files..." "info"
    
    files=(
        "index.html"
        "js/config.js"
        "js/main.js"
        "js/purchase-handler.js"
        "test-purchase-flow.html"
    )
    
    missing_files=()
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            print_status "Found: $file" "success"
        else
            print_status "Missing: $file" "error"
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        print_status "All required files present" "success"
        return 0
    else
        print_status "Missing files detected" "error"
        return 1
    fi
}

# Check JavaScript functions in files
check_js_functions() {
    print_status "Checking JavaScript functions..." "info"
    
    # Check if functions exist in purchase-handler.js
    if grep -q "handleSuccessfulPurchase" js/purchase-handler.js; then
        print_status "handleSuccessfulPurchase function found" "success"
    else
        print_status "handleSuccessfulPurchase function missing" "error"
    fi
    
    if grep -q "savePurchaseData" js/purchase-handler.js; then
        print_status "savePurchaseData function found" "success"
    else
        print_status "savePurchaseData function missing" "error"
    fi
    
    if grep -q "sendEBookEmail" js/purchase-handler.js; then
        print_status "sendEBookEmail function found" "success"
    else
        print_status "sendEBookEmail function missing" "error"
    fi
}

# Check configuration
check_config() {
    print_status "Checking configuration..." "info"
    
    if [ ! -f "js/config.js" ]; then
        print_status "config.js not found" "error"
        return 1
    fi
    
    # Check if config has required fields
    if grep -q "SUPABASE_URL" js/config.js; then
        print_status "SUPABASE_URL configuration found" "success"
    else
        print_status "SUPABASE_URL configuration missing" "error"
    fi
    
    if grep -q "SUPABASE_ANON_KEY" js/config.js; then
        print_status "SUPABASE_ANON_KEY configuration found" "success"
    else
        print_status "SUPABASE_ANON_KEY configuration missing" "error"
    fi
    
    if grep -q "SMTP_EMAIL" js/config.js; then
        print_status "SMTP_EMAIL configuration found" "success"
    else
        print_status "SMTP_EMAIL configuration missing" "warning"
    fi
}

# Check HTML includes
check_html_includes() {
    print_status "Checking HTML script includes..." "info"
    
    if [ ! -f "index.html" ]; then
        print_status "index.html not found" "error"
        return 1
    fi
    
    # Check for Supabase script
    if grep -q "supabase-js" index.html; then
        print_status "Supabase library included in index.html" "success"
    else
        print_status "Supabase library missing from index.html" "error"
    fi
    
    # Check for PayPal script
    if grep -q "paypal.com/sdk" index.html; then
        print_status "PayPal SDK included in index.html" "success"
    else
        print_status "PayPal SDK missing from index.html" "error"
    fi
    
    # Check for config.js
    if grep -q "config.js" index.html; then
        print_status "config.js included in index.html" "success"
    else
        print_status "config.js missing from index.html" "error"
    fi
    
    # Check for purchase-handler.js
    if grep -q "purchase-handler.js" index.html; then
        print_status "purchase-handler.js included in index.html" "success"
    else
        print_status "purchase-handler.js missing from index.html" "error"
    fi
}

# Create backup of important files
create_backup() {
    print_status "Creating backup of configuration files..." "info"
    
    backup_dir="backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$backup_dir"
    
    files_to_backup=(
        "js/config.js"
        "js/main.js"
        "js/purchase-handler.js"
        "index.html"
    )
    
    for file in "${files_to_backup[@]}"; do
        if [ -f "$file" ]; then
            cp "$file" "$backup_dir/"
            print_status "Backed up: $file" "success"
        fi
    done
    
    print_status "Backup created in: $backup_dir" "info"
}

# Validate setup with test server
validate_with_server() {
    print_status "Starting local test server..." "info"
    
    # Check if Python is available
    if command -v python3 &> /dev/null; then
        print_status "Starting Python HTTP server on port 8000..." "info"
        print_status "Open http://localhost:8000/test-purchase-flow.html to test" "info"
        print_status "Press Ctrl+C to stop the server" "warning"
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        print_status "Starting Python HTTP server on port 8000..." "info"
        print_status "Open http://localhost:8000/test-purchase-flow.html to test" "info"
        print_status "Press Ctrl+C to stop the server" "warning"
        python -m http.server 8000
    else
        print_status "Python not found. Please install Python or use another web server" "error"
        print_status "You can also use: npx serve . or php -S localhost:8000" "info"
    fi
}

# Main setup function
main() {
    echo
    print_status "Starting setup validation..." "info"
    echo
    
    # Run all checks
    check_files
    echo
    
    check_js_functions
    echo
    
    check_config
    echo
    
    check_html_includes
    echo
    
    # Ask if user wants to create backup
    read -p "Do you want to create a backup of current files? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        create_backup
        echo
    fi
    
    # Ask if user wants to start test server
    read -p "Do you want to start a local test server? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        validate_with_server
    else
        echo
        print_status "Setup validation complete!" "success"
        print_status "Next steps:" "info"
        print_status "1. Fix any errors shown above" "info"
        print_status "2. Configure your Supabase credentials in js/config.js" "info"
        print_status "3. Run the SQL commands in supabase-tables-setup.sql" "info"
        print_status "4. Open test-purchase-flow.html in a web browser to test" "info"
        print_status "5. Check TROUBLESHOOTING.md if you encounter issues" "info"
    fi
}

# Check if script is run from project directory
if [ ! -f "package.json" ] && [ ! -f "index.html" ]; then
    print_status "Please run this script from the project root directory" "error"
    exit 1
fi

# Run main function
main
