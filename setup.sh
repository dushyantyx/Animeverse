#!/bin/bash

# MangaVerse Quick Setup Script
# This script helps set up the project for first-time users

echo "🚀 MangaVerse Setup Script"
echo "=========================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and update MONGODB_URI with your database connection!"
    echo "   - For MongoDB Atlas: Get connection string from https://cloud.mongodb.com"
    echo "   - For local MongoDB: mongodb://localhost:27017/mangaverse"
    echo ""
    read -p "Press Enter after you've updated .env file..."
else
    echo "✅ .env file already exists"
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

# Ask if user wants to seed database
echo ""
read -p "🌱 Do you want to seed the database with sample data? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npm run seed
    if [ $? -eq 0 ]; then
        echo "✅ Database seeded successfully"
        echo ""
        echo "📋 Test credentials:"
        echo "   Username: admin"
        echo "   Password: admin123"
    else
        echo "❌ Failed to seed database"
        echo "   Make sure MongoDB is running and .env is configured correctly"
    fi
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the server:"
echo "   npm start       (production mode)"
echo "   npm run dev     (development mode with auto-reload)"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
