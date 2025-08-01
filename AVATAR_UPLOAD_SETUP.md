# Avatar/Profile Picture Upload Feature Setup

This document provides instructions for setting up the full-featured avatar/profile picture upload feature in your MERN + TypeScript stack project.

## Features Implemented

### Frontend (React + TypeScript)
- ✅ Profile page with avatar preview
- ✅ File upload from local storage
- ✅ DiceBear Avatars API integration
- ✅ Circular avatar display (WhatsApp-style)
- ✅ Real-time preview and validation
- ✅ Loading states and error handling

### Backend (Node.js + Express)
- ✅ API routes for avatar management
- ✅ Cloudinary integration for image storage
- ✅ MongoDB integration for user data
- ✅ Multer for file handling
- ✅ Image transformation and optimization

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install cloudinary multer dotenv
```

#### Configure Cloudinary
1. Sign up for a free Cloudinary account at https://cloudinary.com/
2. Get your credentials from the dashboard
3. Create a `.env` file in the backend directory:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
DATABASE_URL=mongodb://localhost:27017/internshala-clone
```

#### Start the Backend Server
```bash
cd backend
npm start
```

### 2. Frontend Setup

#### Install Dependencies
```bash
cd internarea
npm install cloudinary
```

#### Start the Frontend Development Server
```bash
cd internarea
npm run dev
```

## API Endpoints

### Avatar Upload
- **POST** `/api/avatar/upload`
  - Upload an image file to Cloudinary
  - Body: `FormData` with `avatar` file and `userId`

### Generate DiceBear Avatar
- **POST** `/api/avatar/generate-dicebear`
  - Generate avatar using DiceBear API
  - Body: `{ seed: string, style: string, userId: string }`

### Get User Avatar
- **GET** `/api/avatar/:userId`
  - Retrieve user's avatar information

### Delete Avatar
- **DELETE** `/api/avatar/:userId`
  - Remove user's avatar

## Usage

### 1. Upload Image
1. Navigate to the profile page
2. Click "Upload Image" button
3. Select an image file (max 5MB)
4. The image will be uploaded to Cloudinary and displayed

### 2. Generate DiceBear Avatar
1. Click "Generate Avatar" button
2. Choose an avatar style (Avataaars, Bottts, Pixel Art, etc.)
3. Enter a seed or generate a random one
4. Preview the avatar and click "Generate Avatar"

### 3. Remove Avatar
1. Click "Remove" button to delete the current avatar
2. The avatar will be removed from both Cloudinary and database

## File Structure

```
backend/
├── Model/
│   └── User.js              # User model with avatar support
├── Routes/
│   └── avatar.js            # Avatar upload routes
├── index.js                 # Main server file
└── .env                     # Environment variables

internarea/
├── src/
│   ├── Components/
│   │   └── AvatarUpload.tsx # Avatar upload component
│   └── pages/
│       └── profile/
│           └── index.tsx    # Updated profile page
```

## Features

### Image Upload
- Supports JPG, PNG, GIF, WebP formats
- 5MB file size limit
- Automatic image optimization and cropping
- Circular transformation for consistent display

### DiceBear Integration
- 6 different avatar styles available
- Real-time preview
- Random seed generation
- Consistent avatar generation based on seed

### User Experience
- Loading states during upload/generation
- Error handling and user feedback
- Responsive design
- Accessibility features

## Security Considerations

1. **File Validation**: Only image files are accepted
2. **Size Limits**: 5MB maximum file size
3. **Cloudinary Security**: Images are stored securely in Cloudinary
4. **Input Sanitization**: All inputs are validated and sanitized

## Troubleshooting

### Common Issues

1. **Cloudinary Configuration Error**
   - Ensure all environment variables are set correctly
   - Verify Cloudinary credentials are valid

2. **File Upload Fails**
   - Check file size (must be < 5MB)
   - Ensure file is an image format
   - Verify backend server is running

3. **CORS Errors**
   - Ensure backend CORS is configured correctly
   - Check that frontend is making requests to correct backend URL

4. **Database Connection Issues**
   - Verify MongoDB is running
   - Check connection string in environment variables

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | Yes |
| `DATABASE_URL` | MongoDB connection string | Yes |

## Next Steps

1. **Authentication Integration**: Connect with your existing auth system
2. **User Management**: Implement user registration/login
3. **Avatar History**: Add ability to view previous avatars
4. **Advanced Features**: Add avatar cropping, filters, etc.
5. **Performance**: Implement image caching and CDN

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all dependencies are installed
3. Ensure environment variables are set correctly
4. Check browser console and server logs for errors 