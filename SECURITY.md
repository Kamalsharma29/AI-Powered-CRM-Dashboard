# 🔐 CRM Security Configuration Guide

## Overview
Your AI-Powered CRM Dashboard includes comprehensive security features to protect user data and prevent unauthorized access.

## 🛡️ Security Features Implemented

### 1. Authentication & Authorization
- **NextAuth.js Integration**: Secure JWT-based authentication
- **Role-Based Access Control**: Admin and Employee roles with different permissions
- **Protected Routes**: Middleware protection for sensitive pages and API endpoints
- **Session Management**: Configurable session timeout (24 hours default)

### 2. Password Security
- **Password Strength Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - Optional special characters
- **Real-time Password Validation**: Live feedback during registration
- **Password Hashing**: bcrypt with salt for secure storage

### 3. Rate Limiting
- **API Rate Limiting**: 100 requests per 15-minute window
- **Account Lockout**: 5 failed login attempts = 30-minute lockout
- **IP-based Tracking**: Prevents brute force attacks

### 4. Security Headers
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-XSS-Protection**: Cross-site scripting protection
- **Content Security Policy**: Restricts resource loading
- **Referrer Policy**: Controls referrer information

### 5. File Upload Security
- **File Size Limits**: Maximum 5MB per file
- **File Type Validation**: Only allowed extensions (jpg, jpeg, png, pdf, doc, docx)
- **MIME Type Checking**: Prevents malicious file uploads

### 6. Database Security
- **MongoDB Connection**: Secure local connection with authentication
- **Input Validation**: Prevents NoSQL injection attacks
- **Data Sanitization**: Clean user inputs before database operations

## 📋 Environment Variables

### Required Security Variables
```env
# Authentication
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
JWT_SECRET=your-jwt-secret-here-change-in-production

# Session Configuration
SESSION_MAX_AGE=86400  # 24 hours

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes

# Password Requirements
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SYMBOLS=false

# Account Security
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME_MS=1800000  # 30 minutes

# File Upload
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx
```

### Optional Email Configuration
```env
# Email Notifications
EMAIL_FROM=noreply@yourcrm.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🔧 Security Configuration Files

### 1. Security Config (`src/lib/security-config.ts`)
- Centralized security settings
- Password validation functions
- Rate limiting helpers
- Account lockout management

### 2. Middleware (`src/middleware.ts`)
- Route protection
- Rate limiting enforcement
- Security headers injection
- Role-based access control

### 3. NextAuth Configuration (`src/app/api/auth/[...nextauth]/route.ts`)
- Authentication provider setup
- JWT configuration
- Session callbacks
- User role management

## 🚀 Production Security Checklist

### Before Deployment:
- [ ] Change all default secrets in `.env.local`
- [ ] Set strong `NEXTAUTH_SECRET` and `JWT_SECRET`
- [ ] Configure proper `NEXTAUTH_URL` for production
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Enable MongoDB authentication
- [ ] Set up backup and recovery procedures
- [ ] Configure monitoring and logging

### Environment-Specific Settings:
```env
# Production
NODE_ENV=production
DEBUG_MODE=false
LOG_LEVEL=error

# Development
NODE_ENV=development
DEBUG_MODE=true
LOG_LEVEL=info
```

## 🔍 Security Monitoring

### Built-in Security Features:
1. **Failed Login Tracking**: Monitors and blocks suspicious login attempts
2. **Rate Limit Monitoring**: Tracks API usage patterns
3. **Session Management**: Automatic session cleanup and timeout
4. **Input Validation**: Prevents malicious data injection

### Recommended Additional Monitoring:
1. **Log Analysis**: Monitor application logs for security events
2. **Database Monitoring**: Track unusual database access patterns
3. **Network Monitoring**: Monitor for DDoS and other network attacks
4. **File System Monitoring**: Watch for unauthorized file changes

## 🆘 Security Incident Response

### If Security Breach Suspected:
1. **Immediate Actions**:
   - Change all authentication secrets
   - Revoke all active sessions
   - Enable additional logging
   - Block suspicious IP addresses

2. **Investigation**:
   - Review application logs
   - Check database for unauthorized changes
   - Analyze network traffic patterns
   - Identify affected user accounts

3. **Recovery**:
   - Restore from clean backups if necessary
   - Update security configurations
   - Notify affected users
   - Implement additional security measures

## 📞 Support

For security-related questions or to report vulnerabilities:
- Review this documentation
- Check application logs
- Test security features in development environment
- Implement additional security measures as needed

## 🔄 Regular Security Maintenance

### Monthly Tasks:
- [ ] Review and rotate authentication secrets
- [ ] Update dependencies for security patches
- [ ] Review user access permissions
- [ ] Analyze security logs for patterns

### Quarterly Tasks:
- [ ] Conduct security audit
- [ ] Test backup and recovery procedures
- [ ] Review and update security policies
- [ ] Train team on security best practices

---

**Remember**: Security is an ongoing process. Regularly review and update your security measures to protect against evolving threats.