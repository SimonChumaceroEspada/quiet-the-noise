# Troubleshooting Guide - Quiet the Noise Purchase Flow

## Common Issues and Solutions

### 1. Supabase Connection Issues

#### Problem: "Supabase not initialized" or "supabase is undefined"
**Solutions:**
- Check that `CONFIG.SUPABASE_URL` and `CONFIG.SUPABASE_ANON_KEY` are properly set in `js/config.js`
- Verify that the Supabase library is loaded before your scripts
- Ensure `initializeSupabase()` is called when the page loads

#### Problem: "Table doesn't exist" errors
**Solutions:**
- Run the SQL commands in `supabase-tables-setup.sql` in your Supabase SQL editor
- Check that your database permissions allow creating tables
- Verify you're using the correct database/project

#### Problem: RLS (Row Level Security) blocking inserts
**Solutions:**
- Run the RLS policies from `supabase-tables-setup.sql`
- In Supabase dashboard, go to Authentication > Policies and verify policies are active
- Temporarily disable RLS for testing: `ALTER TABLE purchases DISABLE ROW LEVEL SECURITY;`

### 2. PayPal Integration Issues

#### Problem: PayPal buttons not appearing
**Solutions:**
- Check that your PayPal client ID is correct in the script tag
- Verify you're using the right PayPal environment (sandbox vs live)
- Look for JavaScript errors in the browser console

#### Problem: Purchase data not saving after PayPal payment
**Solutions:**
- Check that `handleSuccessfulPurchase()` is being called in the PayPal success callback
- Verify the PayPal transaction data is being passed correctly
- Test the database save function independently using the test page

### 3. Email Sending Issues

#### Problem: Emails not being sent
**Solutions:**
- Check that `CONFIG.SMTP_EMAIL` and `CONFIG.SMTP_PASSWORD` are set
- Verify your Supabase Edge Function for email sending is deployed
- Check the `pending_emails` table for entries that haven't been processed

### 4. Testing and Debugging

#### Use the Test Page
1. Open `test-purchase-flow.html` in your browser
2. Run "Check System Components" first
3. Test each component individually
4. Check the browser console for additional error details

#### Debug Steps:
1. **System Check**: Verify all libraries and configs are loaded
2. **Database Connection**: Test Supabase connection and table access
3. **Purchase Simulation**: Test the complete purchase flow
4. **Data Verification**: Check that data is being saved correctly

### 5. Common Configuration Mistakes

#### Config File Issues
```javascript
// ❌ Wrong - missing or incorrect values
const CONFIG = {
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: '',
    // ...
};

// ✅ Correct - properly filled values
const CONFIG = {
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    // ...
};
```

#### Script Loading Order
```html
<!-- ❌ Wrong order -->
<script src="./js/main.js"></script>
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>

<!-- ✅ Correct order -->
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script src="./js/config.js"></script>
<script src="./js/purchase-handler.js"></script>
<script src="./js/main.js"></script>
```

### 6. Database Schema Issues

#### Verify Table Structure
Run this query in Supabase SQL editor to check your tables:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('purchases', 'pending_emails');

-- Check table structure
\d purchases
\d pending_emails
```

#### Check Permissions
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('purchases', 'pending_emails');

-- Check grants
SELECT * FROM information_schema.table_privileges 
WHERE table_name IN ('purchases', 'pending_emails');
```

### 7. Environment-Specific Issues

#### Local Development
- Make sure you're serving files through a web server (not file://)
- Use `python -m http.server` or similar to serve locally
- Check CORS settings if making requests to external APIs

#### Production Deployment
- Verify all environment variables are set correctly
- Check that HTTPS is enabled for PayPal integration
- Ensure Supabase URL and keys are for production environment

### 8. Quick Fixes Checklist

- [ ] All JavaScript files are loading without errors
- [ ] Supabase credentials are correct and active
- [ ] Database tables exist with correct schema
- [ ] RLS policies allow necessary operations
- [ ] PayPal integration is configured correctly
- [ ] Email configuration is complete
- [ ] Test page runs without errors

### 9. Getting Help

If you're still experiencing issues:

1. Run the complete test suite in `test-purchase-flow.html`
2. Check browser console for error messages
3. Verify database logs in Supabase dashboard
4. Test each component individually
5. Compare your setup with the working configuration files

### 10. Monitoring and Maintenance

#### Regular Checks
- Monitor the `pending_emails` table for stuck emails
- Check for failed transactions in the `purchases` table
- Review Supabase logs for errors
- Test the purchase flow periodically

#### Performance Optimization
- Add database indexes for frequently queried columns
- Clean up old test data regularly
- Monitor API rate limits
- Optimize database queries
