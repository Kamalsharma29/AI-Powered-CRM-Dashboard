// Security Configuration
// This file contains security-related configurations and utilities

export const SecurityConfig = {
  // Session Configuration
  session: {
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400'), // 24 hours default
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Rate Limiting
  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  },

  // Password Requirements
  password: {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8'),
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE === 'true',
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE === 'true',
    requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS === 'true',
    requireSymbols: process.env.PASSWORD_REQUIRE_SYMBOLS === 'true',
  },

  // Account Security
  account: {
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
    lockoutTimeMs: parseInt(process.env.LOCKOUT_TIME_MS || '1800000'), // 30 minutes
  },

  // File Upload
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf,doc,docx').split(','),
  },

  // API Configuration
  api: {
    version: process.env.API_VERSION || 'v1',
    rateLimit: parseInt(process.env.API_RATE_LIMIT || '1000'),
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  debugMode: process.env.DEBUG_MODE === 'true',
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Password Validation Function
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const config = SecurityConfig.password;

  if (password.length < config.minLength) {
    errors.push(`Password must be at least ${config.minLength} characters long`);
  }

  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (config.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (config.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (config.requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Rate Limiting Helper
export const createRateLimiter = () => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  
  return {
    isAllowed: (identifier: string): boolean => {
      const now = Date.now();
      const record = attempts.get(identifier);
      
      if (!record || now > record.resetTime) {
        attempts.set(identifier, {
          count: 1,
          resetTime: now + SecurityConfig.rateLimit.windowMs,
        });
        return true;
      }
      
      if (record.count >= SecurityConfig.rateLimit.maxRequests) {
        return false;
      }
      
      record.count++;
      return true;
    },
    
    getRemainingAttempts: (identifier: string): number => {
      const record = attempts.get(identifier);
      if (!record || Date.now() > record.resetTime) {
        return SecurityConfig.rateLimit.maxRequests;
      }
      return Math.max(0, SecurityConfig.rateLimit.maxRequests - record.count);
    },
  };
};

// Account Lockout Helper
export const createAccountLockout = () => {
  const failedAttempts = new Map<string, { count: number; lockedUntil?: number }>();
  
  return {
    recordFailedAttempt: (identifier: string): void => {
      const record = failedAttempts.get(identifier) || { count: 0 };
      record.count++;
      
      if (record.count >= SecurityConfig.account.maxLoginAttempts) {
        record.lockedUntil = Date.now() + SecurityConfig.account.lockoutTimeMs;
      }
      
      failedAttempts.set(identifier, record);
    },
    
    isLocked: (identifier: string): boolean => {
      const record = failedAttempts.get(identifier);
      if (!record || !record.lockedUntil) return false;
      
      if (Date.now() > record.lockedUntil) {
        // Unlock the account
        failedAttempts.delete(identifier);
        return false;
      }
      
      return true;
    },
    
    clearFailedAttempts: (identifier: string): void => {
      failedAttempts.delete(identifier);
    },
    
    getRemainingAttempts: (identifier: string): number => {
      const record = failedAttempts.get(identifier);
      if (!record) return SecurityConfig.account.maxLoginAttempts;
      
      return Math.max(0, SecurityConfig.account.maxLoginAttempts - record.count);
    },
  };
};

// Email Configuration
export const EmailConfig = {
  from: process.env.EMAIL_FROM || 'noreply@yourcrm.com',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};

// File Upload Validation
export const validateFileUpload = (file: File): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const config = SecurityConfig.fileUpload;
  
  // Check file size
  if (file.size > config.maxSize) {
    errors.push(`File size must be less than ${(config.maxSize / 1024 / 1024).toFixed(1)}MB`);
  }
  
  // Check file type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !config.allowedTypes.includes(fileExtension)) {
    errors.push(`File type not allowed. Allowed types: ${config.allowedTypes.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default SecurityConfig;