#!/bin/bash

echo "🚀 Preparando deployment a Netlify..."

# Verificar que las dependencias están instaladas
if [ ! -d "netlify/functions/node_modules" ]; then
    echo "📦 Instalando dependencias..."
    cd netlify/functions && npm install && cd ../..
fi

echo "✅ Proyecto listo para deployment"
echo ""
echo "📋 SIGUIENTE PASO:"
echo "1. Ve a https://netlify.com"
echo "2. Haz login con tu cuenta"
echo "3. Arrastra esta carpeta completa a Netlify"
echo "4. Una vez desplegado, configura las variables de entorno"
echo ""
echo "🔑 Variables de entorno a configurar en Netlify:"
echo "SUPABASE_URL"
echo "SUPABASE_ANON_KEY"  
echo "SUPABASE_SERVICE_ROLE_KEY"
echo "SITE_URL"
echo "EMAIL_USER"
echo "EMAIL_PASS"
echo ""
echo "⚠️  NO subas el archivo .env a git por seguridad"
