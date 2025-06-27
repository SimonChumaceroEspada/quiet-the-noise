#!/bin/bash
# Netlify Deploy Script - Actualiza todos los archivos automáticamente

echo "🚀 Actualizando archivos para Netlify deploy..."

# Copiar archivo HTML principal
echo "📄 Copiando index.html..."
cp index.html netlify-deploy/index.html

# Copiar archivos CSS
echo "🎨 Copiando archivos CSS..."
cp css/styles.css netlify-deploy/css/styles.css

# Copiar archivos JavaScript esenciales
echo "⚙️ Copiando archivos JavaScript..."
cp js/config.js netlify-deploy/js/config.js
cp js/purchase-handler.js netlify-deploy/js/purchase-handler.js
cp js/production-email.js netlify-deploy/js/production-email.js
cp js/backup-email-service.js netlify-deploy/js/backup-email-service.js
cp js/debug-supabase.js netlify-deploy/js/debug-supabase.js
cp js/debug-paypal.js netlify-deploy/js/debug-paypal.js
cp js/system-health-monitor.js netlify-deploy/js/system-health-monitor.js
cp js/production-validation.js netlify-deploy/js/production-validation.js
cp js/main.js netlify-deploy/js/main.js
cp js/simple-email-test.js netlify-deploy/js/simple-email-test.js

# Copiar archivos de assets
echo "🖼️ Copiando assets..."
cp assets/* netlify-deploy/assets/

# Verificar archivos copiados
echo "📋 Verificando archivos..."
echo "Files in netlify-deploy:"
ls -la netlify-deploy/
echo ""
echo "JavaScript files:"
ls -la netlify-deploy/js/
echo ""
echo "CSS files:"
ls -la netlify-deploy/css/
echo ""
echo "Assets:"
ls -la netlify-deploy/assets/

echo "✅ Actualización completa para Netlify!"
echo "📤 Archivos listos para deploy en la carpeta netlify-deploy/"
