#!/bin/bash

# Quick Test Script - Opens test page in browser with local server
# This script starts a local server and opens the test page automatically

echo "🧪 Starting Quick Test Environment"
echo "================================="

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python not found. Please install Python to run local server."
    echo "Alternative: Open test-purchase-flow.html directly in browser"
    echo "Note: Some features may not work with file:// protocol"
    exit 1
fi

echo "🚀 Starting local server on http://localhost:8000"
echo "📱 Test page will open at: http://localhost:8000/test-purchase-flow.html"
echo "⏹️  Press Ctrl+C to stop the server"
echo

# Start server in background
$PYTHON_CMD -m http.server 8000 &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Try to open browser (cross-platform)
TEST_URL="http://localhost:8000/test-purchase-flow.html"

if command -v start &> /dev/null; then
    # Windows
    start "$TEST_URL"
elif command -v open &> /dev/null; then
    # macOS
    open "$TEST_URL"
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open "$TEST_URL"
else
    echo "🌐 Please open this URL in your browser:"
    echo "   $TEST_URL"
fi

echo
echo "🔧 Quick Test Checklist:"
echo "1. ✅ Click 'Check System Components'"
echo "2. ✅ Click 'Test Supabase Connection'"  
echo "3. ✅ Click 'Simulate Purchase'"
echo "4. ✅ Click 'View Recent Purchases'"
echo "5. ✅ Check browser console for any errors"
echo
echo "💡 Tips:"
echo "- Double-click the results area to clear it"
echo "- Press Ctrl+L to clear results with keyboard"
echo "- Check TROUBLESHOOTING.md if you see errors"
echo

# Function to handle cleanup
cleanup() {
    echo
    echo "🛑 Stopping server..."
    kill $SERVER_PID 2>/dev/null
    echo "✅ Server stopped. Goodbye!"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Keep script running
echo "⌨️  Press Ctrl+C to stop the server and exit"
wait $SERVER_PID
