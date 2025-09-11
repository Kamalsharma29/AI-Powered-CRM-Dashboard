# 🤖 Google Gemini AI Setup Guide

## Overview
Your CRM now uses Google Gemini AI instead of OpenAI for email generation. Gemini AI provides free API access with generous limits.

## 🆓 Why Google Gemini AI?

### Benefits:
- **Completely Free**: No credit card required
- **Generous Limits**: 60 requests per minute, 1500 requests per day
- **High Quality**: Advanced AI model comparable to GPT-3.5
- **Easy Setup**: Simple API key generation
- **No Billing**: Never worry about unexpected charges

## 🚀 Setup Instructions

### Step 1: Get Your Free API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Configure Environment
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Gemini API key to `.env.local`:
   ```env
   GEMINI_API_KEY=your-actual-api-key-here
   ```

### Step 3: Test the Integration
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/ai-email` page
3. Fill out the form and generate an email
4. Verify that emails are generated successfully

## 📊 API Limits (Free Tier)

- **Requests per minute**: 60
- **Requests per day**: 1,500
- **Tokens per minute**: 32,000
- **Cost**: FREE forever

## 🔧 Features Supported

✅ **Email Generation Types**:
- Introduction emails
- Follow-up emails
- Proposal emails
- Closing emails
- Custom emails

✅ **Personalization**:
- Lead name and company
- Email tone selection
- Context-aware content
- Professional formatting

## 🛠️ Troubleshooting

### Common Issues:

1. **"API Key not found" error**:
   - Ensure `GEMINI_API_KEY` is set in `.env.local`
   - Restart your development server

2. **"Rate limit exceeded" error**:
   - Wait a minute before trying again
   - Free tier has 60 requests per minute limit

3. **"Invalid API key" error**:
   - Verify your API key is correct
   - Generate a new API key if needed

## 🔄 Migration from OpenAI

The migration is complete! Changes made:

1. ✅ Removed OpenAI dependency
2. ✅ Added Google Gemini AI
3. ✅ Updated API routes
4. ✅ Modified email parsing
5. ✅ Updated UI references
6. ✅ Created setup documentation

## 📝 API Usage Example

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const result = await model.generateContent(prompt);
const response = await result.response;
const text = response.text();
```

## 🎯 Next Steps

1. Get your free Gemini API key
2. Update your `.env.local` file
3. Test email generation
4. Enjoy unlimited free AI-powered emails!

---

**Note**: Keep your API key secure and never commit it to version control. The `.env.local` file is already in `.gitignore`.