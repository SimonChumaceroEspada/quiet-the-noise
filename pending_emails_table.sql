-- Crear tabla para emails pendientes (fallback)
CREATE TABLE IF NOT EXISTS pending_emails (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    transaction_id TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS
ALTER TABLE pending_emails ENABLE ROW LEVEL SECURITY;

-- Política para insertar
CREATE POLICY "Allow insert pending_emails" ON pending_emails
    FOR INSERT WITH CHECK (true);

-- Política para leer
CREATE POLICY "Allow select pending_emails" ON pending_emails
    FOR SELECT USING (true);
