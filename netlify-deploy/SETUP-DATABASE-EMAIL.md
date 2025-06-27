# 🔧 Configuración de Base de Datos y Email

## Pasos para activar el sistema completo

### 1. Configurar Supabase (Base de Datos)

1. **Crear cuenta en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. **Crear tabla de compras**
   - Ve a SQL Editor en Supabase
   - Ejecuta este código SQL:
   ```sql
   CREATE TABLE purchases (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     paypal_transaction_id VARCHAR(255),
     purchase_date TIMESTAMP DEFAULT NOW(),
     book_sent BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Habilitar RLS
   ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

   -- Crear política para inserción
   CREATE POLICY "Allow insert for authenticated users" ON purchases
     FOR INSERT WITH CHECK (true);

   -- Crear política para lectura (opcional, para admin)
   CREATE POLICY "Allow read for authenticated users" ON purchases
     FOR SELECT USING (true);
   ```

3. **Obtener credenciales**
   - Ve a Settings → API
   - Copia la **URL** y **anon key**
   - Actualiza `js/config.js`:
   ```javascript
   SUPABASE_URL: 'https://tu-proyecto.supabase.co',
   SUPABASE_ANON_KEY: 'tu-anon-key-aqui',
   ```

### 2. Configurar EmailJS (Envío de Emails)

1. **Crear cuenta en EmailJS**
   - Ve a [emailjs.com](https://emailjs.com)
   - Crea cuenta gratuita (200 emails/mes)

2. **Configurar servicio de email**
   - Ve a Email Services
   - Conecta tu Gmail/Outlook
   - Anota el **Service ID**

3. **Crear plantilla de email**
   - Ve a Email Templates
   - Crea nueva plantilla:
   ```
   Asunto: Tu eBook "Quiet the Noise" - Descarga Inmediata
   
   Hola {{to_name}},
   
   ¡Gracias por tu compra! Aquí tienes tu eBook "Quiet the Noise".
   
   El archivo está adjunto a este email.
   
   Si tienes alguna pregunta, responde a este email.
   
   Saludos,
   Equipo Quiet the Noise
   ```
   - Anota el **Template ID**

4. **Obtener Public Key**
   - Ve a Account → General Settings
   - Copia la **Public Key**

5. **Actualizar configuración**
   - Actualiza `js/config.js`:
   ```javascript
   EMAILJS_SERVICE_ID: 'tu-service-id',
   EMAILJS_TEMPLATE_ID: 'tu-template-id',
   EMAILJS_PUBLIC_KEY: 'tu-public-key',
   ```

### 3. Configurar el archivo del eBook

1. **Verificar archivo**
   - Confirma que `book/QuietTheNoise.zip` existe
   - El archivo debe ser accesible públicamente

2. **Alternativa: Hosting del archivo**
   - Sube el archivo a un servicio como:
     - Google Drive (con enlace público)
     - Dropbox
     - AWS S3
   - Actualiza la URL en `js/database.js`

### 4. Pruebas del Sistema

1. **Probar base de datos**
   ```javascript
   // Abrir consola del navegador y ejecutar:
   savePurchaseData({
     name: 'Test User',
     email: 'test@example.com',
     transactionId: 'TEST123',
     paymentMethod: 'paypal'
   });
   ```

2. **Probar email**
   ```javascript
   // Abrir consola del navegador y ejecutar:
   sendEBook({
     name: 'Test User',
     email: 'tu-email@example.com'
   });
   ```

### 5. Configuración de PayPal (Producción)

Para producción, necesitarás:
1. **Cuenta PayPal Business**
2. **Configurar IPN (Instant Payment Notification)**
   - En tu cuenta PayPal: Account Settings → Notifications
   - URL de IPN: `https://tu-sitio.com/paypal-ipn.php`
3. **Crear botón PayPal real**
   - PayPal Button Factory
   - Configurar return URL: `https://tu-sitio.com/thank-you.html`

### 6. Monitoreo y Logs

1. **Verificar logs en Supabase**
   - Ve a Logs → Realtime
   - Monitorea inserciones en la tabla `purchases`

2. **Verificar envío de emails**
   - Ve a tu servicio de email
   - Revisa el historial de envíos

3. **Debugging**
   - Abre Developer Tools → Console
   - Busca errores en JavaScript

### 7. Seguridad Adicional

1. **Variables de entorno (Recomendado para producción)**
   ```javascript
   // En lugar de hardcodear las keys, usa variables de entorno
   SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
   SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
   ```

2. **Validación de emails**
   - Implementar verificación de formato de email
   - Prevenir spam con reCAPTCHA

3. **Rate limiting**
   - Limitar número de compras por IP
   - Implementar en Supabase con RLS policies

### 8. Troubleshooting Común

**Error: "Supabase not defined"**
- Verificar que el script de Supabase se carga antes que database.js

**Error: "EmailJS not loaded"**
- Verificar que el script de EmailJS se carga correctamente

**Emails no se envían**
- Verificar que el servicio de EmailJS está conectado
- Revisar límites de envío (200/mes en plan gratuito)

**Base de datos no guarda**
- Verificar políticas RLS en Supabase
- Comprobar que las credenciales son correctas

### 9. Backup y Exportación de Datos

```sql
-- Exportar todas las compras
SELECT * FROM purchases ORDER BY created_at DESC;

-- Estadísticas de ventas
SELECT 
  DATE(created_at) as fecha,
  COUNT(*) as compras,
  COUNT(CASE WHEN book_sent = true THEN 1 END) as emails_enviados
FROM purchases 
GROUP BY DATE(created_at)
ORDER BY fecha DESC;
```

## 🚀 Una vez configurado todo:

1. Los usuarios compran a través de PayPal
2. Sus datos se guardan automáticamente en Supabase
3. Reciben el eBook por email inmediatamente
4. Puedes monitorear todas las ventas desde Supabase
5. Sistema completamente automatizado

## 📞 Soporte

Si tienes problemas con la configuración:
1. Revisa los logs del navegador (F12 → Console)
2. Verifica las credenciales en `config.js`
3. Prueba cada componente por separado
4. Contacta al soporte de Supabase o EmailJS si es necesario
