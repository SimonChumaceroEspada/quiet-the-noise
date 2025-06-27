-- SQL script to create the required tables for Quiet the Noise purchase flow
-- Run this in your Supabase SQL editor if the tables don't exist

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    paypal_transaction_id TEXT UNIQUE,
    purchase_date TIMESTAMPTZ DEFAULT NOW(),
    book_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pending_emails table
CREATE TABLE IF NOT EXISTS pending_emails (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    transaction_id TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_transaction_id ON purchases(paypal_transaction_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_pending_emails_status ON pending_emails(status);
CREATE INDEX IF NOT EXISTS idx_pending_emails_created ON pending_emails(created_at);

-- Add Row Level Security (RLS) policies
-- Note: Adjust these policies based on your security requirements

-- Enable RLS on both tables
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_emails ENABLE ROW LEVEL SECURITY;

-- Create policies for purchases table
-- Allow anonymous users to insert purchases (for the purchase flow)
CREATE POLICY IF NOT EXISTS "Allow anonymous insert purchases" ON purchases
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow service role full access
CREATE POLICY IF NOT EXISTS "Allow service role full access purchases" ON purchases
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Create policies for pending_emails table
-- Allow anonymous users to insert pending emails
CREATE POLICY IF NOT EXISTS "Allow anonymous insert pending_emails" ON pending_emails
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow service role full access
CREATE POLICY IF NOT EXISTS "Allow service role full access pending_emails" ON pending_emails
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions
GRANT INSERT ON purchases TO anon;
GRANT INSERT ON pending_emails TO anon;

-- Insert test data (optional - for testing purposes)
-- Remove this section if you don't want test data
INSERT INTO purchases (name, email, paypal_transaction_id, book_sent) VALUES 
    ('Test User', 'test@example.com', 'TEST-SETUP-' || extract(epoch from now()), false)
ON CONFLICT (paypal_transaction_id) DO NOTHING;

INSERT INTO pending_emails (email, name, transaction_id, status) VALUES 
    ('test@example.com', 'Test User', 'TEST-EMAIL-' || extract(epoch from now()), 'pending')
ON CONFLICT DO NOTHING;
