import React from 'react';
import AvatarDemo from '@/Components/AvatarDemo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const AvatarDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Avatar Upload Feature Demo
          </h1>
          <p className="text-gray-600">
            A comprehensive avatar upload system with file upload and DiceBear integration
          </p>
        </div>

        {/* Demo Component */}
        <AvatarDemo />

        {/* Feature Overview */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Frontend Features
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• React + TypeScript implementation</li>
              <li>• File upload with drag & drop</li>
              <li>• Real-time image validation</li>
              <li>• DiceBear avatar generation</li>
              <li>• Circular avatar display</li>
              <li>• Loading states and error handling</li>
              <li>• Responsive design</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Backend Features
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Node.js + Express API</li>
              <li>• Cloudinary integration</li>
              <li>• MongoDB user management</li>
              <li>• Multer file handling</li>
              <li>• Image transformation</li>
              <li>• Security validation</li>
              <li>• Error handling</li>
            </ul>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Technical Implementation
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">API Endpoints</h4>
              <ul className="space-y-1 text-gray-600">
                <li>POST /api/avatar/upload</li>
                <li>POST /api/avatar/generate-dicebear</li>
                <li>GET /api/avatar/:userId</li>
                <li>DELETE /api/avatar/:userId</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Dependencies</h4>
              <ul className="space-y-1 text-gray-600">
                <li>cloudinary</li>
                <li>multer</li>
                <li>mongoose</li>
                <li>axios</li>
                <li>lucide-react</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Features</h4>
              <ul className="space-y-1 text-gray-600">
                <li>5MB file size limit</li>
                <li>Image format validation</li>
                <li>Circular transformation</li>
                <li>6 DiceBear styles</li>
                <li>Real-time preview</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarDemoPage; 