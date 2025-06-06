@echo off
echo Creating Netlify deployment package...
echo.

REM Create a temporary directory for deployment files
if not exist "netlify-deploy" mkdir netlify-deploy

REM Copy essential files and folders
echo Copying files...
copy index.html netlify-deploy\
copy contact.html netlify-deploy\
copy privacy-policy.html netlify-deploy\
copy refund-policy.html netlify-deploy\
copy terms-of-service.html netlify-deploy\
copy robots.txt netlify-deploy\
copy sitemap.xml netlify-deploy\
copy netlify.toml netlify-deploy\
copy README.md netlify-deploy\

REM Copy folders
xcopy css netlify-deploy\css\ /E /I
xcopy js netlify-deploy\js\ /E /I
xcopy assets netlify-deploy\assets\ /E /I

echo.
echo Files copied to netlify-deploy folder
echo.
echo Manual ZIP creation:
echo 1. Open the 'netlify-deploy' folder
echo 2. Select all files and folders inside it
echo 3. Right-click and choose 'Send to > Compressed folder'
echo 4. Name it 'quiet-the-noise-site.zip'
echo 5. Upload this ZIP to Netlify
echo.
echo Press any key to open the netlify-deploy folder...
pause >nul
explorer netlify-deploy
