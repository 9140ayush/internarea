# 🚀 InternArea Deployment Guide

This guide covers all the fixes and improvements made to prepare the InternArea project for deployment.

## ✅ Issues Fixed

### 1. Invalid Hook Call Error
**Problem**: `useTranslation()` was being called inside `useEffect`, which violates React's rules of hooks.

**Files Fixed**:
- `src/Components/LanguageSelector.tsx`
- `src/pages/index.tsx`
- `src/pages/videoResume/index.tsx`

**Solution**: Moved `useTranslation()` to the component level:
```tsx
// ❌ Before (Invalid)
useEffect(() => {
  const { useTranslation } = await import('react-i18next');
  const { i18n, t } = useTranslation(); // Invalid hook call
}, []);

// ✅ After (Correct)
const { t, i18n } = useTranslation(); // Proper hook usage
```

### 2. Centralized API Configuration
**Problem**: Hardcoded API URLs scattered throughout the codebase.

**Solution**: Created centralized API configuration in `src/config/api.js`:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_PRODUCTION_API_URL || 'https://internarea-h88w.onrender.com')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
```

**Files Updated**:
- `src/pages/userapplication/index.tsx`
- `src/pages/postInternship/index.tsx`
- `src/pages/postJob/index.tsx`
- `src/pages/job/index.tsx`
- `src/pages/internship/index.tsx`
- `src/pages/detailjob/[id]/index.tsx`
- `src/pages/detailiternship/[id]/index.tsx`
- `src/pages/applications/index.tsx`
- `src/pages/detailapplication/[id]/index.tsx`
- `src/pages/adminlogin/index.tsx`
- `test-production.js`

### 3. Enhanced i18n Configuration
**Improvements**:
- Added proper language detection configuration
- Improved hydration handling
- Added preloading for better performance

```typescript
// Enhanced configuration in src/config/i18n.ts
detection: {
  order: ['localStorage', 'navigator', 'htmlTag'],
  caches: ['localStorage'],
  lookupLocalStorage: 'i18nextLng',
},
react: {
  useSuspense: false,
  bindI18n: 'languageChanged loaded',
  bindI18nStore: 'added removed',
},
load: 'languageOnly',
preload: ['en', 'es', 'hi', 'pt', 'zh', 'fr'],
```

## 🔧 Environment Configuration

### Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ENVIRONMENT=development
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_PRODUCTION_API_URL=https://your-backend-url.com
```

## 📦 New Scripts Added

### Package.json Scripts
```json
{
  "scripts": {
    "deploy": "bash scripts/deploy.sh",
    "type-check": "tsc --noEmit",
    "build:prod": "NODE_ENV=production next build"
  }
}
```

### Deployment Script
Created `scripts/deploy.sh` with:
- Node.js version checking
- Dependency installation
- Build verification
- TypeScript compilation check
- Environment variable validation
- Linting (if available)

## 🚀 Deployment Steps

### 1. Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. Backend (Render)
1. Connect repository to Render
2. Set environment variables
3. Configure build: `npm install`
4. Configure start: `npm start`

### 3. Environment Variables Setup

#### Vercel Dashboard
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_PRODUCTION_API_URL=https://your-backend-url.com
```

#### Render Dashboard
```env
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
```

## 🐛 Common Issues & Solutions

### 1. Invalid Hook Call Error
**Error**: "Invalid hook call. Hooks can only be called inside of the body of a function component."
**Solution**: Ensure `useTranslation()` is called at component level, not inside `useEffect`.

### 2. Hydration Mismatch
**Error**: Server-side rendering differs from client-side
**Solution**: Use `isClient` state to prevent rendering until client-side.

### 3. API Connection Issues
**Error**: Cannot connect to backend
**Solution**: 
- Check environment variables
- Ensure backend is running
- Verify API endpoints in `src/config/api.js`

### 4. TypeScript Errors
**Error**: TypeScript compilation fails
**Solution**: Run `npm run type-check` to identify and fix type issues.

## 📋 Pre-Deployment Checklist

- [ ] All `useTranslation()` hooks are at component level
- [ ] All API calls use centralized configuration
- [ ] Environment variables are properly set
- [ ] TypeScript compilation passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Tests pass (if available)
- [ ] Backend is deployed and accessible
- [ ] Database is properly configured
- [ ] Firebase configuration is set up

## 🔍 Testing

### Local Testing
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build:prod
```

### Production Testing
```bash
# Run deployment script
npm run deploy

# Test API endpoints
curl https://your-backend-url.com/api/health

# Test frontend
curl https://your-frontend-url.com
```

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [React i18next Documentation](https://react.i18next.com/)

## 🆘 Support

If you encounter issues during deployment:

1. Check the console logs for errors
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check the deployment script output
5. Review the pre-deployment checklist

For additional support, create an issue in the repository or contact the development team. 