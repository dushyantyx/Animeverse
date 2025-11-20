# 🚀 MangaVerse Deployment Guide - Render.com

## 📋 Prerequisites
- GitHub account
- Render.com account (free)
- Your code pushed to GitHub

---

## 🎯 Step-by-Step Deployment

### **Step 1: Prepare Your Code**

Your project is already configured! The following files have been created:
- ✅ `render.yaml` - Render configuration
- ✅ `.env.example` - Environment variables template
- ✅ `.gitignore` - Files to ignore in Git
- ✅ `package.json` - Already has correct start script

### **Step 2: Push to GitHub**

```bash
# Add all files
git add .

# Commit changes
git commit -m "Prepare for Render deployment"

# Push to GitHub
git push origin main
```

### **Step 3: Create Render Account**

1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### **Step 4: Create New Web Service**

1. **Dashboard** → Click **"New +"** button (top right)
2. Select **"Blueprint"**
3. Click **"Connect Repository"** next to your **Manga** repo
4. If you don't see it, click **"Configure account"** to grant access
5. Repository will appear → Click **"Connect"**

### **Step 5: Render Auto-Configuration**

Render will detect `render.yaml` and automatically:
- ✅ Create Web Service named "mangaverse"
- ✅ Create MongoDB database named "mangaverse-db"
- ✅ Link database to web service
- ✅ Set environment variables

You'll see a screen showing:
- **Web Service**: mangaverse
- **Database**: mangaverse-db

### **Step 6: Review and Deploy**

1. Click **"Apply"** to create both services
2. Render will:
   - Create the database (takes ~2 minutes)
   - Build your web service (npm install)
   - Start your application (npm start)

### **Step 7: Monitor Deployment**

1. Click on **"mangaverse"** web service
2. Watch the **"Logs"** tab
3. Wait for:
   ```
   ✅ Connected to MongoDB
   📦 Database is empty, seeding initial data...
   ✅ Database seeded successfully
   🚀 Server running on http://localhost:10000
   ```
4. Deployment is complete!

### **Step 8: Access Your Live App**

Your app will be available at:
```
https://mangaverse-xxxx.onrender.com
```
(The exact URL will be shown in your Render dashboard)

---

## 🔧 Configuration Details

### **Environment Variables (Auto-Set by Render)**

| Variable | Value | Source |
|----------|-------|--------|
| `MONGODB_URI` | `mongodb+srv://...` | From database |
| `SESSION_SECRET` | Random string | Auto-generated |
| `NODE_ENV` | `production` | Set in render.yaml |
| `PORT` | `10000` | Render default |

### **Free Tier Limits**

- **Web Service**: 
  - 512 MB RAM
  - Sleeps after 15 min inactivity
  - Wakes on request (~30 sec)
  
- **MongoDB**: 
  - 256 MB storage
  - Shared CPU
  - Perfect for this project!

---

## 🐛 Troubleshooting

### **Issue: "Service failed to start"**

**Check logs for:**
1. Missing dependencies → Run `npm install` locally
2. MongoDB connection error → Check database is created
3. Port binding → Render sets PORT automatically

### **Issue: "Database connection timeout"**

**Solution:**
1. Go to **Database** → **mangaverse-db**
2. Check status is "Available"
3. Verify connection string in web service env vars

### **Issue: "App works but no data"**

**Solution:**
The auto-seed runs on first connection. Check logs for:
```
📦 Database is empty, seeding initial data...
✅ Database seeded successfully
```

If not seeded, manually trigger by restarting service:
- Dashboard → **mangaverse** → **Manual Deploy** → **Deploy latest commit**

### **Issue: "Site not loading"**

**Solutions:**
1. Free tier sleeps after 15 min → First request takes 30 sec to wake
2. Check service status is "Live" (green dot)
3. View logs for errors

---

## 🔄 Updating Your Deployed App

### **Automatic Updates (Recommended)**

Render auto-deploys on every git push:

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main

# Render automatically:
# 1. Detects the push
# 2. Rebuilds the app
# 3. Deploys new version
```

### **Manual Deploy**

1. Dashboard → **mangaverse**
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**

---

## 📊 Monitoring Your App

### **View Logs**
1. Dashboard → **mangaverse** → **Logs** tab
2. Real-time logs showing:
   - Server startup
   - Database connections
   - Request errors
   - MongoDB queries

### **View Metrics**
1. Dashboard → **mangaverse** → **Metrics** tab
2. Shows:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

### **Database Management**

Access MongoDB:
1. Dashboard → **mangaverse-db**
2. Click **"Connect"** → Copy connection string
3. Use MongoDB Compass or mongosh:
   ```bash
   mongosh "mongodb+srv://username:password@..."
   ```

---

## 🎓 Test Your Deployment

### **1. Homepage**
- Visit `https://your-app.onrender.com`
- Should see manga catalog

### **2. Test Login**
```
Username: admin
Password: admin123
```

### **3. Test Features**
- ✅ Browse manga
- ✅ Rate a manga (requires login)
- ✅ Create discussion thread
- ✅ Search manga
- ✅ View trending

---

## 💡 Tips for Success

### **Keep Free Tier Active**
- Free services sleep after 15 min inactivity
- Use a service like [UptimeRobot](https://uptimerobot.com) to ping your site every 5 min

### **Custom Domain (Optional)**
1. Buy domain from Namecheap/GoDaddy
2. Render Dashboard → **mangaverse** → **Settings** → **Custom Domain**
3. Add your domain and update DNS records

### **Backup Your Database**
1. Dashboard → **mangaverse-db** → **Backups**
2. Free tier: Manual backups only
3. Paid tier: Automatic daily backups

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Blueprint deployed (web service + database)
- [ ] Build successful (check logs)
- [ ] Database seeded with sample data
- [ ] App accessible via Render URL
- [ ] Login works with test account
- [ ] Manga rating and discussions work

---

## 🆘 Need Help?

**Render Support:**
- Documentation: https://render.com/docs
- Community: https://community.render.com

**Project Issues:**
- Check deployment logs in Render dashboard
- Verify environment variables are set
- Test locally first: `npm run dev`

---

## 🚀 Next Steps

After successful deployment:

1. **Share your live app**: `https://your-app.onrender.com`
2. **Create demo account** for your viva presentation
3. **Prepare viva talking points**:
   - "Deployed using Render.com with free MongoDB"
   - "Auto-deploys on git push via CI/CD"
   - "Uses environment variables for configuration"
   - "Database auto-seeds on first connection"

---

**Your app is now live! 🎊**

Good luck with your viva presentation! 🎓
