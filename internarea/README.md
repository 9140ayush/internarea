# InternArea - Internship & Job Portal

A modern MERN stack application with TypeScript and React i18next for multi-language support.

## 🚀 Features

- **Multi-language Support**: English, Spanish, Hindi, Portuguese, Chinese, and French
- **Internship & Job Listings**: Browse and apply for opportunities
- **User Authentication**: Firebase-based authentication
- **Admin Panel**: Manage applications and post opportunities
- **Video Resume**: Upload and manage video resumes
- **Avatar System**: Generate and manage user avatars
- **Responsive Design**: Modern UI with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 13+** with TypeScript
- **React i18next** for internationalization
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **Firebase** for authentication
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MongoDB instance
- Firebase project

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd internarea
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the `internarea` directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_ENVIRONMENT=development
   
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd ../backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   ```

4. **Run the backend server**
   ```bash
   npm start
   # or
   npm run dev
   ```

## 🌐 Internationalization

The application supports multiple languages:

- **English** (en) - Default
- **Spanish** (es)
- **Hindi** (hi)
- **Portuguese** (pt)
- **Chinese** (zh)
- **French** (fr) - Requires OTP verification

### Adding New Languages

1. Create a new translation file in `src/locales/`
2. Add the language to the i18n configuration in `src/config/i18n.ts`
3. Update the language selector component

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_ENVIRONMENT=production
   NEXT_PUBLIC_PRODUCTION_API_URL=https://your-backend-url.com
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Backend Deployment (Render)

1. **Connect your repository to Render**
2. **Set environment variables** in Render dashboard
3. **Configure build command**: `npm install`
4. **Configure start command**: `npm start`

### Environment Variables for Production

#### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_PRODUCTION_API_URL=https://your-backend-url.com
```

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
```

## 🔧 API Configuration

The application uses a centralized API configuration in `src/config/api.js`:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_PRODUCTION_API_URL || 'https://your-backend-url.com')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
```

## 🐛 Common Issues & Solutions

### Invalid Hook Call Error
- **Issue**: `useTranslation()` called outside React component
- **Solution**: Ensure `useTranslation()` is called at the component level, not inside `useEffect`

### Hydration Mismatch
- **Issue**: Server-side rendering differs from client-side
- **Solution**: Use `isClient` state to prevent rendering until client-side

### API Connection Issues
- **Issue**: Cannot connect to backend
- **Solution**: Check environment variables and ensure backend is running

## 📁 Project Structure

```
internarea/
├── src/
│   ├── Components/          # Reusable components
│   ├── config/             # Configuration files
│   ├── Feature/            # Redux slices
│   ├── firebase/           # Firebase configuration
│   ├── locales/            # Translation files
│   ├── pages/              # Next.js pages
│   ├── store/              # Redux store
│   └── styles/             # Global styles
├── public/                 # Static assets
├── .env.example           # Environment variables example
└── README.md              # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@internarea.com or create an issue in the repository.
