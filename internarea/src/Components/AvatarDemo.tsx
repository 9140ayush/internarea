import React from 'react';
import AvatarUpload from './AvatarUpload';

const AvatarDemo: React.FC = () => {
  const [demoAvatar, setDemoAvatar] = React.useState('');

  const handleAvatarChange = (newAvatar: string) => {
    setDemoAvatar(newAvatar);
    console.log('Avatar changed to:', newAvatar);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Avatar Upload Demo
      </h2>
      
      <div className="text-center mb-6">
        <p className="text-gray-600 mb-4">
          This demo showcases the avatar upload functionality with both file upload and DiceBear avatar generation.
        </p>
        
        {demoAvatar && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Current Avatar URL:</p>
            <code className="text-xs bg-gray-100 p-2 rounded break-all">
              {demoAvatar}
            </code>
          </div>
        )}
      </div>

      <AvatarUpload
        currentAvatar={demoAvatar}
        onAvatarChange={handleAvatarChange}
        userId="demo-user"
      />

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Features Demonstrated:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• File upload with drag & drop support</li>
          <li>• Image validation (type and size)</li>
          <li>• Cloudinary integration for secure storage</li>
          <li>• DiceBear avatar generation with 6 different styles</li>
          <li>• Real-time preview and validation</li>
          <li>• Loading states and error handling</li>
          <li>• Circular avatar display (WhatsApp-style)</li>
        </ul>
      </div>
    </div>
  );
};

export default AvatarDemo; 