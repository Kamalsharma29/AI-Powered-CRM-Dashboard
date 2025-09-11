# Vercel Deployment Guide

## Environment Variables Setup for Vercel

To fix the authentication error on Vercel, you need to properly configure environment variables:

### 1. Go to Vercel Dashboard
- Visit [vercel.com](https://vercel.com)
- Select your CRM Dashboard project
- Go to **Settings** → **Environment Variables**

### 2. Add Required Environment Variables

#### Essential Variables:
```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-strong-secret-key-32-characters-minimum
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crm-dashboard
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET=your-jwt-secret-key
```

#### Important Notes:

**NEXTAUTH_SECRET:**
- Must be at least 32 characters long
- Generate using: `openssl rand -base64 32`
- Or use online generator: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

**NEXTAUTH_URL:**
- Replace `your-app-name` with your actual Vercel domain
- Example: `https://crm-dashboard-kamal.vercel.app`

**MONGODB_URI:**
- Use MongoDB Atlas for production
- Don't use localhost in production

### 3. Redeploy After Setting Variables
- After adding all environment variables
- Go to **Deployments** tab
- Click **Redeploy** on the latest deployment

### 4. Common Issues & Solutions

**Error: `net::ERR_ABORTED`**
- Cause: Missing or invalid NEXTAUTH_SECRET
- Solution: Set proper NEXTAUTH_SECRET (32+ characters)

**Database Connection Error:**
- Cause: Using localhost MongoDB URI
- Solution: Use MongoDB Atlas connection string

**Authentication Not Working:**
- Check NEXTAUTH_URL matches your Vercel domain
- Ensure all environment variables are set
- Redeploy after changes

### 5. Quick Fix Commands

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 6. Database Setup (MongoDB Atlas)

**Create Production Database:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (free tier available)
3. Create database user with read/write permissions
4. Get connection string and add to Vercel environment variables

**Seed Production Users:**
```bash
# Install dependencies locally first
npm install

# Set your MongoDB Atlas URI
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/crm-dashboard"

# Run production seeding script
node scripts/seed-production-users.js
```

### 7. Verification Steps

1. ✅ Check all environment variables are set in Vercel
2. ✅ Verify NEXTAUTH_URL matches your domain
3. ✅ Ensure NEXTAUTH_SECRET is 32+ characters
4. ✅ Set up MongoDB Atlas and seed users
5. ✅ Redeploy the application
6. ✅ Test authentication on live site

### 8. Default Login Credentials

After running the seeding script, use these credentials:

**Admin Login:**
- Email: `admin@crm.com`
- Password: `admin123`

**Employee Login:**
- Email: `employee@crm.com`
- Password: `employee123`

**Manager Login:**
- Email: `manager@crm.com`
- Password: `manager123`

---

**Need Help?**
- Check Vercel deployment logs for specific errors
- Verify environment variables in Vercel dashboard
- Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Test locally first with same environment variables
- Run the production seeding script to create demo users