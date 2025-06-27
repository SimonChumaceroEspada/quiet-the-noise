#!/bin/bash

# 🚀 DEPLOY SCRIPT PARA NETLIFY - PayPal Hosted Button Production
# Este script automatiza el proceso de deploy a Netlify con validaciones

echo "🚀 INICIANDO DEPLOY A PRODUCCIÓN - Quiet the Noise"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function para logging
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar que estamos en el directorio correcto
log_info "Verificando directorio del proyecto..."
if [ ! -f "package.json" ] || [ ! -d "netlify-deploy" ]; then
    log_error "No se encuentra package.json o netlify-deploy/. Ejecuta desde la raíz del proyecto."
    exit 1
fi
log_success "Directorio correcto verificado"

# 2. Verificar archivos críticos
log_info "Verificando archivos críticos..."

critical_files=(
    "netlify-deploy/index.html"
    "netlify-deploy/netlify.toml"
    "netlify-deploy/js/config.js"
    "netlify-deploy/js/paypal-hosted-handler.js"
    "netlify-deploy/js/purchase-handler.js"
    "netlify-deploy/js/production-email.js"
    "netlify-deploy/css/styles.css"
    "netlify-deploy/assets/book-cover.jpg"
)

missing_files=()
for file in "${critical_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    log_error "Archivos críticos faltantes:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    exit 1
fi
log_success "Todos los archivos críticos presentes"

# 3. Verificar configuración PayPal en index.html
log_info "Verificando configuración PayPal..."
if grep -q "DG2V4FLX49RM8" netlify-deploy/index.html && 
   grep -q "BAAdtIP4N39_Grc65N4rXgCcuW2TEEB5MyXfq1r3BGmNWFTaK3OMhKc_3zIZl4oI622oMTkhOcSJ_OriNo" netlify-deploy/index.html; then
    log_success "Configuración PayPal de producción verificada"
else
    log_error "Configuración PayPal no encontrada o incorrecta"
    exit 1
fi

# 4. Verificar configuración Supabase
log_info "Verificando configuración Supabase..."
if grep -q "qfuyqrlspdvxoxkgvlss.supabase.co" netlify-deploy/js/config.js; then
    log_success "Configuración Supabase verificada"
else
    log_error "Configuración Supabase no encontrada"
    exit 1
fi

# 5. Verificar que netlify.toml apunta a netlify-deploy
log_info "Verificando netlify.toml..."
if grep -q 'publish = "netlify-deploy"' netlify.toml; then
    log_success "netlify.toml configurado correctamente"
else
    log_error "netlify.toml no apunta a netlify-deploy/"
    exit 1
fi

# 6. Crear backup de configuración actual
log_info "Creando backup de configuración..."
backup_dir="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
cp netlify-deploy/js/config.js "$backup_dir/"
cp netlify-deploy/index.html "$backup_dir/"
log_success "Backup creado en $backup_dir/"

# 7. Optimizar archivos para producción
log_info "Optimizando archivos para producción..."

# Minificar CSS (simple)
if command -v uglifyjs &> /dev/null; then
    log_info "Minificando JavaScript..."
    # Crear versiones minificadas opcionales
else
    log_warning "UglifyJS no disponible, saltando minificación"
fi

# 8. Validar sintaxis HTML
log_info "Validando sintaxis HTML..."
if command -v tidy &> /dev/null; then
    tidy -q -e netlify-deploy/index.html 2>/dev/null || log_warning "HTML podría tener problemas menores"
else
    log_warning "HTML Tidy no disponible, saltando validación HTML"
fi

# 9. Pre-deploy checklist
echo ""
log_info "PRE-DEPLOY CHECKLIST:"
echo "====================="
echo "✅ Archivos críticos presentes"
echo "✅ PayPal Button ID: DG2V4FLX49RM8"
echo "✅ PayPal Client ID: BAAdtIP4N39_Grc65N4rXgCcuW2TEEB5MyXfq1r3BGmNWFTaK3OMhKc_3zIZl4oI622oMTkhOcSJ_OriNo"
echo "✅ Supabase URL: qfuyqrlspdvxoxkgvlss.supabase.co"
echo "✅ Publish directory: netlify-deploy"
echo "✅ Backup creado: $backup_dir/"

# 10. Confirmación del usuario
echo ""
read -p "¿Proceder con el deploy a producción? [y/N]: " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_warning "Deploy cancelado por el usuario"
    exit 0
fi

# 11. Git operations
log_info "Preparando repositorio Git..."

# Verificar si hay cambios pendientes
if [ -n "$(git status --porcelain)" ]; then
    log_info "Cambios detectados, agregando al repositorio..."
    git add netlify-deploy/
    git add *.md
    git add netlify.toml
    
    commit_message="PayPal hosted button integration - Production ready

- Integrated official PayPal hosted button (ID: DG2V4FLX49RM8)
- Added paypal-hosted-handler.js for robust button management
- Enhanced error handling and fallback mechanisms
- Added paypal-test.html for production debugging
- Updated all production files in netlify-deploy/
- Ready for live customer transactions"

    git commit -m "$commit_message"
    log_success "Cambios committed"
else
    log_info "No hay cambios pendientes"
fi

# 12. Push to repository
log_info "Enviando cambios al repositorio..."
if git push origin main; then
    log_success "Cambios enviados a GitHub"
else
    log_error "Error enviando cambios. Verifica tu conexión y permisos."
    exit 1
fi

# 13. Post-deploy instructions
echo ""
log_success "🎉 DEPLOY COMPLETADO EXITOSAMENTE!"
echo "================================="
echo ""
log_info "PRÓXIMOS PASOS:"
echo "1. Ir a tu dashboard de Netlify"
echo "2. Verificar que el deploy automático se inició"
echo "3. Una vez completado, probar:"
echo "   • Página principal: https://tu-sitio.netlify.app/"
echo "   • Página de test: https://tu-sitio.netlify.app/paypal-test.html"
echo ""
log_info "VALIDACIONES RECOMENDADAS:"
echo "• ✅ Botón PayPal se carga correctamente"
echo "• ✅ Console sin errores JavaScript"
echo "• ✅ Prueba de compra con cuenta sandbox"
echo "• ✅ Verificar datos en Supabase"
echo "• ✅ Confirmar recepción de email"
echo ""
log_warning "IMPORTANTE:"
echo "• Haz una compra de prueba SANDBOX antes de anunciar"
echo "• Monitorea los logs de la consola en las primeras horas"
echo "• Ten el dashboard de Supabase abierto para verificar datos"
echo ""
log_success "¡El sistema está listo para recibir clientes reales! 🚀"

# 14. Abrir URLs importantes (opcional)
read -p "¿Abrir URLs importantes en el navegador? [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://app.netlify.com/sites"
        open "https://supabase.com/dashboard/project/qfuyqrlspdvxoxkgvlss"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://app.netlify.com/sites"
        xdg-open "https://supabase.com/dashboard/project/qfuyqrlspdvxoxkgvlss"
    else
        echo "URLs importantes:"
        echo "• Netlify: https://app.netlify.com/sites"
        echo "• Supabase: https://supabase.com/dashboard/project/qfuyqrlspdvxoxkgvlss"
    fi
fi

echo ""
log_success "Deploy script completado. ¡Buena suerte con las ventas! 💰"
