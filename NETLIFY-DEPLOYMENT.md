# Netlify Deployment Guide for Quiet the Noise Landing Page

## Option 1: Manual Deployment (Drag & Drop)

### Quick Setup (5 minutes)
1. **Prepare the files:**
   ```bash
   # Remove node_modules from deployment
   rm -rf node_modules
   ```

2. **Create a ZIP file of your project:**
   - Select all files EXCEPT `node_modules` and `wordpress-theme` folders
   - Create a ZIP file called `quiet-the-noise-site.zip`

3. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub, GitLab, or email
   - Click "Add new site" > "Deploy manually"
   - Drag & drop your ZIP file or browse to select it
   - Your site will be deployed instantly!

### Files to Include in ZIP:
- ✅ index.html
- ✅ contact.html, privacy-policy.html, etc.
- ✅ css/ folder
- ✅ js/ folder  
- ✅ assets/ folder
- ✅ netlify.toml
- ✅ robots.txt
- ✅ sitemap.xml
- ❌ node_modules/ (exclude)
- ❌ wordpress-theme/ (exclude)
- ❌ .git/ (exclude if present)

## Option 2: Git-Based Deployment (Recommended)

### Setup Git Repository
1. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Quiet the Noise landing page"
   ```

2. **Create GitHub Repository:**
   - Go to [github.com](https://github.com)
   - Create new repository: `quiet-the-noise-landing-page`
   - Don't initialize with README (we already have files)

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/quiet-the-noise-landing-page.git
   git branch -M main
   git push -u origin main
   ```

### Deploy from Git
1. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your repository

2. **Configure Build Settings:**
   - Build command: `npm run build` (optional)
   - Publish directory: `.` (root folder)
   - Click "Deploy site"

## Option 3: Netlify CLI Deployment

### Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Login and Deploy
```bash
# Login to Netlify
netlify login

# Deploy from your project folder
cd /path/to/your/project
netlify deploy

# For production deployment
netlify deploy --prod
```

## Post-Deployment Configuration

### 1. Custom Domain Setup
1. In Netlify dashboard, go to "Domain settings"
2. Add your custom domain (e.g., quietthenoise.com)
3. Configure DNS records as instructed by Netlify

### 2. HTTPS & SSL
- Automatically enabled by Netlify
- Force HTTPS redirects are configured in netlify.toml

### 3. Environment Variables (for Stripe)
1. Go to Site settings > Environment variables
2. Add your Stripe keys:
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key (for backend)

### 4. Form Handling (if needed)
- Netlify automatically handles forms with `netlify` attribute
- No additional configuration needed

### 5. Analytics Setup
1. Enable Netlify Analytics (paid feature)
2. Or add Google Analytics tracking code to your HTML

## Testing Your Deployment

### Pre-Deploy Checklist
- [ ] All images load correctly
- [ ] All links work (internal and external)
- [ ] Contact forms submit properly
- [ ] Stripe payment integration works
- [ ] Mobile responsiveness is maintained
- [ ] SEO meta tags are present
- [ ] Site loads quickly (under 3 seconds)

### Performance Optimization
- CSS and JS minification configured
- Image optimization enabled
- Proper caching headers set
- CDN distribution automatic

## Troubleshooting

### Common Issues:
1. **404 errors:** Check netlify.toml redirects
2. **Slow loading:** Optimize images in assets/ folder
3. **Stripe not working:** Verify environment variables
4. **Mobile issues:** Test responsive design

### Getting Help:
- Netlify Support: [netlify.com/support](https://netlify.com/support)
- Netlify Community: [community.netlify.com](https://community.netlify.com)

## Maintenance

### Regular Updates:
1. Monitor site performance with Netlify Analytics
2. Update content as needed
3. Test all forms and payment processing monthly
4. Keep dependencies updated

### Backup Strategy:
- Git repository serves as backup
- Netlify keeps deployment history
- Download site files from Netlify if needed

---

**Your site will be available at:** `https://[random-name].netlify.app`

You can change this to a custom domain in the Netlify dashboard settings.
