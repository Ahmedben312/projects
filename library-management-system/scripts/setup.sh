#!/bin/bash

echo "Ì∫Ä Setting up Library Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "‚ùå Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep mongod > /dev/null; then
    echo "‚ö†Ô∏è  MongoDB doesn't appear to be running. Please start MongoDB."
    echo "   On macOS: brew services start mongodb-community"
    echo "   On Ubuntu: sudo systemctl start mongod"
    echo "   Or run: mongod"
fi

# Setup backend
echo "Ì≥¶ Setting up backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "‚ùå Backend setup failed"
    exit 1
fi
cd ..

# Setup frontend
echo "Ìæ® Setting up frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "‚ùå Frontend setup failed"
    exit 1
fi
cd ..

echo "‚úÖ Setup completed successfully!"
echo ""
echo "ÌæØ Next steps:"
echo "1. Update backend/.env with your MongoDB connection string"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. Start the frontend: cd frontend && npm run dev"
echo ""
echo "Ìºê The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
