#!/bin/bash

# InternArea Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 Starting InternArea deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the internarea directory."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node --version)"
    exit 1
fi

print_status "Node.js version check passed: $(node --version)"

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build the application
print_status "Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    print_status "Build completed successfully!"
else
    print_error "Build failed!"
    exit 1
fi

# Check environment variables
print_status "Checking environment variables..."

# Required environment variables
REQUIRED_VARS=(
    "NEXT_PUBLIC_API_URL"
    "NEXT_PUBLIC_ENVIRONMENT"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    print_warning "Missing environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    print_warning "Please set these variables before deployment."
fi

# Run tests (if available)
if [ -f "package.json" ] && grep -q "\"test\":" package.json; then
    print_status "Running tests..."
    npm test
fi

# Check for TypeScript errors
print_status "Checking TypeScript compilation..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    print_status "TypeScript compilation check passed!"
else
    print_error "TypeScript compilation failed!"
    exit 1
fi

# Lint the code (if available)
if [ -f "package.json" ] && grep -q "\"lint\":" package.json; then
    print_status "Running linter..."
    npm run lint
fi

print_status "Deployment preparation completed successfully!"
print_status "You can now deploy to your preferred platform:"
echo ""
echo "For Vercel:"
echo "  vercel --prod"
echo ""
echo "For Netlify:"
echo "  netlify deploy --prod"
echo ""
echo "For manual deployment, the built files are in the .next directory."

exit 0 