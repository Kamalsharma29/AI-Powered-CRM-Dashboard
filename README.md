# 🚀 AI-Powered CRM Dashboard

A modern, full-stack Customer Relationship Management (CRM) dashboard built with Next.js 15, featuring AI-powered email generation, advanced analytics, and a beautiful dark/light theme system.

![CRM Dashboard](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## ✨ Features

### 🔐 Authentication & Security
- **Secure Authentication** with NextAuth.js
- **Role-based Access Control** (Admin & Employee roles)
- **JWT Token Management** with secure session handling
- **Password Security** with bcrypt hashing
- **Rate Limiting** and security middleware

### 📊 Dashboard & Analytics
- **Interactive Dashboard** with real-time data visualization
- **Advanced Analytics** with charts and metrics
- **Lead Management** system with CRUD operations
- **User Management** for admin users
- **Responsive Design** for all device sizes

### 🎨 UI/UX Features
- **Dark/Light Theme Toggle** with system preference detection
- **Modern UI Components** built with Tailwind CSS
- **Smooth Animations** and transitions
- **Mobile-First Design** approach
- **Professional Layout** with sidebar navigation

### 🤖 AI Integration
- **AI-Powered Email Generation** using Google Gemini API
- **Smart Content Creation** for customer communications
- **Automated Responses** and suggestions

### 🛠️ Technical Features
- **TypeScript** for type safety
- **Server-Side Rendering** with Next.js App Router
- **API Routes** for backend functionality
- **MongoDB Integration** with Mongoose ODM
- **Environment Configuration** for different deployment stages

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 15.5.2
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom React components
- **State Management:** React Context API

### Backend
- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js
- **AI Integration:** Google Gemini API

### DevOps & Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Code Formatting:** Prettier (via ESLint)
- **Version Control:** Git

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Google Gemini API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kamalsharma29/AI-Powered-CRM-Dashboard.git
   cd AI-Powered-CRM-Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/crm-dashboard
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # Google Gemini AI API (Optional)
   GEMINI_API_KEY=your-gemini-api-key-here
   
   # JWT Secret
   JWT_SECRET=your-jwt-secret-here
   ```

4. **Database Setup**
   ```bash
   # Seed initial data (optional)
   npm run seed:users
   npm run seed:leads
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Default Login Credentials
- **Admin:** admin@crm.com / admin123
- **Employee:** employee@crm.com / emp123

### Key Pages
- **Dashboard:** `/dashboard` - Main analytics and overview
- **Leads:** `/leads` - Lead management system
- **Analytics:** `/analytics` - Advanced data visualization
- **AI Email:** `/ai-email` - AI-powered email generation
- **Settings:** `/settings` - User preferences and configuration

## 🏛️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── leads/             # Lead management
│   └── analytics/         # Analytics page
├── components/            # Reusable React components
├── contexts/              # React Context providers
├── lib/                   # Utility functions and configurations
├── models/                # MongoDB/Mongoose models
├── types/                 # TypeScript type definitions
└── middleware.ts          # Next.js middleware for route protection
```

## 🔧 Configuration

### Environment Variables
See `SECURITY.md` for detailed security configuration options.

### Database Models
- **User Model:** Authentication and role management
- **Lead Model:** Customer lead information
- **Analytics Model:** Dashboard metrics and data

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms
- **Netlify:** Use `npm run build` and deploy the `out` folder
- **Railway:** Connect GitHub repository and configure environment
- **Docker:** Use the included Dockerfile for containerization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [MongoDB](https://www.mongodb.com/) for the database
- [Google Gemini](https://ai.google.dev/) for AI capabilities

## 📞 Contact

**Kamal Sharma** - [GitHub](https://github.com/Kamalsharma29) | [LinkedIn](https://www.linkedin.com/in/kamalsharma29/)

Project Link: [https://github.com/Kamalsharma29/AI-Powered-CRM-Dashboard](https://github.com/Kamalsharma29/AI-Powered-CRM-Dashboard)

---

⭐ **Star this repository if you found it helpful!**
