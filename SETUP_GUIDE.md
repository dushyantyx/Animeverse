# 🚀 MangaVerse Setup Guide for Teams

## Problem: MongoDB Connection Error When Others Clone Your Repo

When someone clones your repository and runs `npm start`, they get:
```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

This happens because your `.env` file points to `mongodb://localhost:27017` which only works if MongoDB is installed on their computer.

---

## ✅ Solution: 3 Easy Options

### 🌟 **BEST OPTION: MongoDB Atlas (Recommended)**

**Why?** 
- ✅ No MongoDB installation needed
- ✅ Free forever (512MB storage)
- ✅ Works from any computer
- ✅ Perfect for viva demos and team projects

**Setup Steps (5 minutes):**

1. **Create Free Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up with email or Google

2. **Create Database Cluster**
   - Choose "M0 FREE" tier
   - Select region closest to you
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Setup Database Access**
   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Create username (e.g., `mangaverse_admin`)
   - Create password (click "Autogenerate Secure Password")
   - **COPY AND SAVE THIS PASSWORD!**
   - Set role to "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for demo/dev)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" in left menu
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Copy the connection string:
     ```
     mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/
     ```

6. **Update Your .env File**
   ```bash
   # In your project folder
   cp .env.example .env
   nano .env  # or open in any text editor
   ```
   
   Replace the MongoDB line:
   ```env
   # Replace this:
   MONGODB_URI=mongodb://localhost:27017/mangaverse
   
   # With this (replace <username> and <password>):
   MONGODB_URI=mongodb+srv://mangaverse_admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/mangaverse?retryWrites=true&w=majority
   ```

7. **Test It!**
   ```bash
   npm install
   npm run seed    # Load sample data
   npm start       # Server should connect!
   ```

8. **Share with Your Team**
   - Commit `.env.example` to git (NOT `.env`)
   - Share the MongoDB Atlas connection string with team
   - They just need to create their own `.env` file with that string

---

### 💻 **Option 2: Local MongoDB (Traditional Way)**

**Why?**
- Works offline
- Full control over database

**Setup Steps:**

**Ubuntu/Debian:**
```bash
# Install MongoDB
sudo apt-get install -y gnupg curl
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify it's running
sudo systemctl status mongod
```

**macOS:**
```bash
# Install MongoDB via Homebrew
brew tap mongodb/brew
brew update
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify it's running
brew services list
```

**Windows:**
1. Download installer from https://www.mongodb.com/try/download/community
2. Run installer (choose "Complete" installation)
3. Install as Windows Service
4. MongoDB starts automatically

**Then for all platforms:**
```bash
# In your project folder
cp .env.example .env
npm install
npm run seed
npm start
```

**⚠️ Important:** Everyone who clones your repo needs MongoDB installed!

---

### 🐳 **Option 3: Docker (For Advanced Users)**

**Why?**
- Consistent environment
- Easy to share
- No MongoDB installation needed

**Setup Steps:**

1. **Install Docker**
   - Download from https://www.docker.com/get-started

2. **Create docker-compose.yml** (if not exists):
   ```yaml
   version: '3.8'
   services:
     mongodb:
       image: mongo:7.0
       container_name: mangaverse-db
       ports:
         - "27017:27017"
       environment:
         - MONGO_INITDB_DATABASE=mangaverse
       volumes:
         - mongo-data:/data/db
   
   volumes:
     mongo-data:
   ```

3. **Update your .env**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mangaverse
   ```

4. **Run Everything**:
   ```bash
   # Start MongoDB container
   docker-compose up -d
   
   # Setup project
   npm install
   npm run seed
   npm start
   ```

5. **Share with Team**:
   - They need Docker installed
   - Run `docker-compose up -d`
   - No MongoDB installation needed!

**Useful Docker commands:**
```bash
docker-compose up -d      # Start database
docker-compose down       # Stop database
docker-compose logs       # View logs
docker ps                 # See running containers
```

---

## 📋 Checklist for Viva/Demo Day

### Before the Demo:

- [ ] Choose MongoDB option (Atlas recommended)
- [ ] Create `.env` file from `.env.example`
- [ ] Update `MONGODB_URI` with your connection string
- [ ] Change `SESSION_SECRET` to random string
- [ ] Run `npm install`
- [ ] Run `npm run seed` (creates sample data)
- [ ] Test with `npm start`
- [ ] Verify at http://localhost:3000
- [ ] Test login with `admin` / `admin123`
- [ ] Create a backup plan (second MongoDB Atlas cluster?)

### For Team Members:

Share this in your README or team chat:

```
Hey team! To run MangaVerse:

1. Clone the repo
2. Copy .env.example to .env
3. Update MONGODB_URI with our Atlas connection:
   mongodb+srv://mangaverse_admin:PASSWORD@cluster.xxxxx.mongodb.net/mangaverse
4. Run: npm install && npm start
5. Visit: http://localhost:3000

Login: admin / admin123
```

---

## 🆘 Troubleshooting

### Error: "MONGODB_URI is not defined"
**Solution:** Create `.env` file from `.env.example`

### Error: "Authentication failed"
**Solution:** Check username/password in connection string are correct

### Error: "Network timeout"
**Solution:** 
- Check internet connection
- Verify IP whitelist in Atlas (allow 0.0.0.0/0 for testing)

### Error: "Connection refused 127.0.0.1:27017"
**Solution:** 
- If using local MongoDB: `sudo systemctl start mongod`
- If using Atlas: Update `.env` with Atlas connection string

### Seed script fails
**Solution:** 
- Make sure database is connected
- Drop existing data: `mongosh mangaverse --eval "db.dropDatabase()"`
- Run seed again: `npm run seed`

---

## 🎓 For Your Viva

**Examiner might ask:** "What if I want to run this on my computer?"

**Answer:** 
> "The application uses MongoDB Atlas, a free cloud database. I've provided a `.env.example` file with setup instructions. You just need to:
> 1. Copy it to `.env`
> 2. Add your own MongoDB connection string (or I can share mine for demo)
> 3. Run `npm install` and `npm start`
> 
> No MongoDB installation needed! This makes it easy for team collaboration and deployment. The connection string is in environment variables for security, so it's not committed to git."

**Better answer:**
> "I've implemented three deployment options:
> 1. **MongoDB Atlas** (cloud) - recommended for production and demos
> 2. **Local MongoDB** - for offline development
> 3. **Docker** - for containerized deployment
> 
> All configurations are managed through environment variables following twelve-factor app principles."

---

## 📚 Additional Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)
- [Docker MongoDB Guide](https://hub.docker.com/_/mongo)
- [Environment Variables Best Practices](https://12factor.net/config)

---

**Good luck with your viva! 🎉**
