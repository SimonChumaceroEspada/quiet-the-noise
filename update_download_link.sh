#!/bin/bash

# Script para actualizar el enlace de descarga del eBook

if [ -z "$1" ]; then
    echo "❌ Error: Debes proporcionar el ID del archivo de Google Drive"
    echo ""
    echo "Uso: ./update_download_link.sh [GOOGLE_DRIVE_FILE_ID]"
    echo ""
    echo "Ejemplo: ./update_download_link.sh 1ABC123XYZ789"
    echo ""
    echo "Para obtener el ID:"
    echo "1. Sube QuietTheNoise.zip a Google Drive"
    echo "2. Compártelo públicamente"
    echo "3. Copia el ID de la URL de compartir"
    exit 1
fi

FILE_ID="$1"
DOWNLOAD_URL="https://drive.google.com/uc?export=download&id=${FILE_ID}"

echo "🔧 Actualizando enlace de descarga..."
echo "File ID: $FILE_ID"
echo "Download URL: $DOWNLOAD_URL"
echo ""

# Actualizar config.js
echo "📝 Actualizando config.js..."
sed -i "s|EBOOK_DOWNLOAD_URL: '[^']*'|EBOOK_DOWNLOAD_URL: '$DOWNLOAD_URL'|g" js/config.js

# Actualizar simple-working-email.js
echo "📝 Actualizando simple-working-email.js..."
sed -i "s|const downloadLink = '[^']*';|const downloadLink = '$DOWNLOAD_URL';|g" js/simple-working-email.js

# Actualizar purchase-handler.js si existe la función
echo "📝 Actualizando purchase-handler.js..."
sed -i "s|\${window.location.origin}/book/QuietTheNoise.zip|$DOWNLOAD_URL|g" js/purchase-handler.js

echo ""
echo "✅ ¡Enlace de descarga actualizado exitosamente!"
echo ""
echo "🧪 Para probar:"
echo "1. Refresca la página de pruebas"
echo "2. Haz clic en '💯 Test SIMPLE Working Email'"
echo "3. Verifica que el email contenga el enlace correcto"
echo ""
echo "🌐 El enlace de descarga ahora es:"
echo "$DOWNLOAD_URL"
