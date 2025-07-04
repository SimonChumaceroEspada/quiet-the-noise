#!/bin/bash

# Guía paso a paso para configurar el enlace de descarga

echo "🚀 GUÍA: Configurar enlace de descarga para QuietTheNoise.zip"
echo "================================================================="
echo ""
echo "PASO 1: Subir archivo a Google Drive"
echo "------------------------------------"
echo "1. Ve a https://drive.google.com"
echo "2. Haz clic en 'Nuevo' → 'Subir archivo'"
echo "3. Selecciona el archivo: book/QuietTheNoise.zip"
echo "4. Espera a que se suba completamente"
echo ""
echo "PASO 2: Hacer el archivo público"
echo "--------------------------------"
echo "1. Haz clic derecho en el archivo subido"
echo "2. Selecciona 'Compartir'"
echo "3. En 'Acceso general', cambia a 'Cualquier persona con el enlace'"
echo "4. Asegúrate que esté en 'Lector' (no Editor)"
echo "5. Copia el enlace que aparece"
echo ""
echo "PASO 3: Convertir el enlace"
echo "----------------------------"
echo "El enlace se verá así:"
echo "https://drive.google.com/file/d/1ABC123XYZ789/view?usp=sharing"
echo ""
echo "Necesitas extraer el ID: 1ABC123XYZ789"
echo "Y convertirlo a:"
echo "https://drive.google.com/uc?export=download&id=1ABC123XYZ789"
echo ""
echo "PASO 4: Actualizar el código"
echo "-----------------------------"
echo "Una vez que tengas el ID, ejecuta:"
echo "update_download_link.sh [TU_FILE_ID]"
echo ""
echo "================================================================="
echo "💡 ALTERNATIVA RÁPIDA:"
echo "También puedes usar Dropbox, WeTransfer, o cualquier servicio"
echo "de hosting de archivos que genere enlaces directos de descarga."
echo "================================================================="
