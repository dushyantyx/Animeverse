#!/bin/bash

# MangaVerse Quick Start Script
# This script helps you set up and run the application

echo "🚀 MangaVerse Setup & Start Script"
echo "=================================="
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB status..."
if pgrep -x "mongod" > /dev/null
then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    sudo systemctl start mongod
    sleep 2
    if pgrep -x "mongod" > /dev/null
    then
        echo "✅ MongoDB started successfully"
    else
        echo "❌ Failed to start MongoDB. Please start it manually:"
        echo "   sudo systemctl start mongod"
        exit 1
    fi
fi

echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating default .env file..."
    cat > .env << EOL
PORT=3000
MONGO_URI=mongodb://localhost:27017/mangaverse
SESSION_SECRET=$(openssl rand -base64 32)
EOL
    echo "✅ .env file created with random session secret"
else
    echo "✅ .env file exists"
fi

echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""

# Ask if user wants to seed database
echo "🌱 Do you want to populate the database with sample data? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]
then
    echo "🌱 Seeding database..."
    node config/seed.js
    echo "✅ Database seeded successfully!"
    echo ""
    echo "📝 Test Login Credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
else
    echo "⏭️  Skipping database seeding"
fi

echo ""
echo "=================================="
echo "🎉 Setup Complete!"
echo ""
echo "To start the server:"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo "=================================="
