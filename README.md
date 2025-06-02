# SweetBox Chatbot - Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Direct GitHub Deployment (Recommended)

1. **Create a GitHub Repository:**
   - Go to GitHub and create a new repository
   - Copy all the project files to your repository

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Build Settings:**
   - Framework Preset: Other
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Option 2: Vercel CLI Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Environment Variables

If you plan to use Google Sheets integration, add these environment variables in Vercel:

- `GOOGLE_SHEETS_API_KEY`: Your Google Sheets API key
- `GOOGLE_SHEETS_ID`: Your spreadsheet ID

### Features Included

- WhatsApp-style chat interface
- Customer management system
- Product catalog with 8 sweet box varieties
- Real-time customization (size, lamination, quantity)
- Price calculation
- Order processing
- Mobile-responsive design
- Google Sheets integration ready

### Post-Deployment

After deployment, your app will be available at: `https://your-project-name.vercel.app`

Share this URL with your customers to start taking orders through the chatbot!