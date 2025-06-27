-- Verificar estructura actual de la tabla purchases
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'purchases' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Si la tabla no tiene la columna amount, añadirla
ALTER TABLE purchases 
ADD COLUMN IF NOT EXISTS amount VARCHAR(10) DEFAULT '7.99';

-- Si la tabla no tiene la columna payment_method, añadirla
ALTER TABLE purchases 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'paypal';

-- Verificar estructura después de los cambios
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'purchases' 
AND table_schema = 'public'
ORDER BY ordinal_position;
