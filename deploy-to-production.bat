@echo off
REM 🚀 DEPLOY SCRIPT PARA NETLIFY - PayPal Hosted Button Production (Windows)
REM Este script automatiza el proceso de deploy a Netlify con validaciones

echo 🚀 INICIANDO DEPLOY A PRODUCCIÓN - Quiet the Noise
echo ==================================================

REM 1. Verificar que estamos en el directorio correcto
echo ℹ️  Verificando directorio del proyecto...
if not exist "package.json" (
    echo ❌ No se encuentra package.json. Ejecuta desde la raíz del proyecto.
    pause
    exit /b 1
)
if not exist "netlify-deploy" (
    echo ❌ No se encuentra netlify-deploy/. Ejecuta desde la raíz del proyecto.
    pause
    exit /b 1
)
echo ✅ Directorio correcto verificado

REM 2. Verificar archivos críticos
echo ℹ️  Verificando archivos críticos...
set missing_files=0

if not exist "netlify-deploy\index.html" (
    echo ❌ Falta: netlify-deploy\index.html
    set missing_files=1
)
if not exist "netlify-deploy\netlify.toml" (
    echo ❌ Falta: netlify-deploy\netlify.toml
    set missing_files=1
)
if not exist "netlify-deploy\js\config.js" (
    echo ❌ Falta: netlify-deploy\js\config.js
    set missing_files=1
)
if not exist "netlify-deploy\js\paypal-hosted-handler.js" (
    echo ❌ Falta: netlify-deploy\js\paypal-hosted-handler.js
    set missing_files=1
)
if not exist "netlify-deploy\js\purchase-handler.js" (
    echo ❌ Falta: netlify-deploy\js\purchase-handler.js
    set missing_files=1
)
if not exist "netlify-deploy\js\production-email.js" (
    echo ❌ Falta: netlify-deploy\js\production-email.js
    set missing_files=1
)
if not exist "netlify-deploy\css\styles.css" (
    echo ❌ Falta: netlify-deploy\css\styles.css
    set missing_files=1
)
if not exist "netlify-deploy\assets\book-cover.jpg" (
    echo ❌ Falta: netlify-deploy\assets\book-cover.jpg
    set missing_files=1
)

if %missing_files%==1 (
    echo ❌ Archivos críticos faltantes. No se puede continuar.
    pause
    exit /b 1
)
echo ✅ Todos los archivos críticos presentes

REM 3. Verificar configuración PayPal
echo ℹ️  Verificando configuración PayPal...
findstr /c:"DG2V4FLX49RM8" netlify-deploy\index.html >nul
if errorlevel 1 (
    echo ❌ Button ID PayPal no encontrado
    pause
    exit /b 1
)
findstr /c:"BAAdtIP4N39_Grc65N4rXgCcuW2TEEB5MyXfq1r3BGmNWFTaK3OMhKc_3zIZl4oI622oMTkhOcSJ_OriNo" netlify-deploy\index.html >nul
if errorlevel 1 (
    echo ❌ Client ID PayPal no encontrado
    pause
    exit /b 1
)
echo ✅ Configuración PayPal de producción verificada

REM 4. Verificar configuración Supabase
echo ℹ️  Verificando configuración Supabase...
findstr /c:"qfuyqrlspdvxoxkgvlss.supabase.co" netlify-deploy\js\config.js >nul
if errorlevel 1 (
    echo ❌ Configuración Supabase no encontrada
    pause
    exit /b 1
)
echo ✅ Configuración Supabase verificada

REM 5. Verificar netlify.toml
echo ℹ️  Verificando netlify.toml...
findstr /c:"publish = \"netlify-deploy\"" netlify.toml >nul
if errorlevel 1 (
    echo ❌ netlify.toml no apunta a netlify-deploy/
    pause
    exit /b 1
)
echo ✅ netlify.toml configurado correctamente

REM 6. Crear backup
echo ℹ️  Creando backup de configuración...
set backup_dir=backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set backup_dir=%backup_dir: =%
mkdir "%backup_dir%" 2>nul
copy "netlify-deploy\js\config.js" "%backup_dir%\" >nul
copy "netlify-deploy\index.html" "%backup_dir%\" >nul
echo ✅ Backup creado en %backup_dir%\

REM 7. Pre-deploy checklist
echo.
echo ℹ️  PRE-DEPLOY CHECKLIST:
echo =====================
echo ✅ Archivos críticos presentes
echo ✅ PayPal Button ID: DG2V4FLX49RM8
echo ✅ PayPal Client ID: BAAdtIP4N39_Grc65N4rXgCcuW2TEEB5MyXfq1r3BGmNWFTaK3OMhKc_3zIZl4oI622oMTkhOcSJ_OriNo
echo ✅ Supabase URL: qfuyqrlspdvxoxkgvlss.supabase.co
echo ✅ Publish directory: netlify-deploy
echo ✅ Backup creado: %backup_dir%\

REM 8. Confirmación del usuario
echo.
set /p confirm="¿Proceder con el deploy a producción? [y/N]: "
if /i not "%confirm%"=="y" (
    echo ⚠️  Deploy cancelado por el usuario
    pause
    exit /b 0
)

REM 9. Git operations
echo ℹ️  Preparando repositorio Git...

REM Verificar si Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git no está instalado o no está en el PATH
    echo ℹ️  Debes hacer el commit y push manualmente:
    echo    git add .
    echo    git commit -m "PayPal hosted button integration - Production ready"
    echo    git push origin main
    pause
    exit /b 1
)

REM Verificar si hay cambios
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo ❌ Error verificando estado de Git
    pause
    exit /b 1
)

REM Agregar cambios
echo ℹ️  Agregando cambios al repositorio...
git add netlify-deploy/
git add *.md
git add netlify.toml

REM Commit
echo ℹ️  Creando commit...
git commit -m "PayPal hosted button integration - Production ready

- Integrated official PayPal hosted button (ID: DG2V4FLX49RM8)
- Added paypal-hosted-handler.js for robust button management
- Enhanced error handling and fallback mechanisms
- Added paypal-test.html for production debugging
- Updated all production files in netlify-deploy/
- Ready for live customer transactions"

if errorlevel 1 (
    echo ℹ️  No hay cambios para commit o error en commit
)

REM Push
echo ℹ️  Enviando cambios al repositorio...
git push origin main
if errorlevel 1 (
    echo ❌ Error enviando cambios. Verifica tu conexión y permisos.
    pause
    exit /b 1
)
echo ✅ Cambios enviados a GitHub

REM 10. Post-deploy instructions
echo.
echo 🎉 DEPLOY COMPLETADO EXITOSAMENTE!
echo =================================
echo.
echo ℹ️  PRÓXIMOS PASOS:
echo 1. Ir a tu dashboard de Netlify
echo 2. Verificar que el deploy automático se inició
echo 3. Una vez completado, probar:
echo    • Página principal: https://tu-sitio.netlify.app/
echo    • Página de test: https://tu-sitio.netlify.app/paypal-test.html
echo.
echo ℹ️  VALIDACIONES RECOMENDADAS:
echo • ✅ Botón PayPal se carga correctamente
echo • ✅ Console sin errores JavaScript
echo • ✅ Prueba de compra con cuenta sandbox
echo • ✅ Verificar datos en Supabase
echo • ✅ Confirmar recepción de email
echo.
echo ⚠️  IMPORTANTE:
echo • Haz una compra de prueba SANDBOX antes de anunciar
echo • Monitorea los logs de la consola en las primeras horas
echo • Ten el dashboard de Supabase abierto para verificar datos
echo.
echo ✅ ¡El sistema está listo para recibir clientes reales! 🚀

REM 11. Abrir URLs importantes
echo.
set /p open_urls="¿Abrir URLs importantes en el navegador? [y/N]: "
if /i "%open_urls%"=="y" (
    start https://app.netlify.com/sites
    start https://supabase.com/dashboard/project/qfuyqrlspdvxoxkgvlss
    echo ✅ URLs importantes abiertas en el navegador
) else (
    echo ℹ️  URLs importantes:
    echo • Netlify: https://app.netlify.com/sites
    echo • Supabase: https://supabase.com/dashboard/project/qfuyqrlspdvxoxkgvlss
)

echo.
echo ✅ Deploy script completado. ¡Buena suerte con las ventas! 💰
pause
