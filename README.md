# MangaVerse 📚

A full-stack web application for manga enthusiasts to discover, rate, and discuss their favorite manga series. Built with Node.js, Express, MongoDB, and EJS templating.

---

## 🎯 Project Overview

**MangaVerse** is a comprehensive manga discussion platform that allows users to:
- Browse and search for manga titles
- Rate manga on a 5-star scale
- Create and participate in discussion threads
- View trending and top-rated manga
- Discover manga by genre, author, and status

This project was developed as a demonstration of full-stack web development skills, implementing RESTful APIs, database operations, user authentication, and dynamic content rendering.

---

## 🚀 Features

### 1. **User Authentication**
- Secure user registration and login
- Password hashing with bcrypt
- Session-based authentication
- Protected routes for authenticated users

### 2. **Manga Catalog**
- Browse comprehensive manga collection
- Search functionality with text indexing
- Filter by genre, status (ongoing/completed/hiatus)
- Detailed manga information pages
- View count tracking

### 3. **Rating System**
- Interactive 5-star rating component
- Real-time rating updates
- Average rating calculation
- User-specific rating tracking
- Visual rating feedback

### 4. **Discussion Forums**
- Create discussion threads for specific manga
- Threaded replies system
- Author-only thread deletion
- Timestamp tracking for posts
- Rich discussion participation

### 5. **Trending & Top-Rated**
- Trending manga based on view count
- Top-rated manga leaderboard
- Time-based filtering options
- Dynamic ranking system

---

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend
- **EJS** - Embedded JavaScript templating
- **CSS3** - Modern responsive styling
- **JavaScript (ES6+)** - Client-side interactivity
- **Font Awesome** - Icon library

### Development Tools
- **Nodemon** - Auto-restart development server
- **dotenv** - Environment variable management
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **connect-flash** - Flash message middleware
- **method-override** - HTTP verb support (DELETE, PUT)

---

## 📁 Project Structure

```
Animeverse/
├── app.js                      # Main application entry point
├── package.json                # Project dependencies
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
│
├── config/
│   ├── database.js             # MongoDB connection setup
│   └── seed.js                 # Database seed script
│
├── models/
│   ├── User.js                 # User schema with authentication
│   ├── Manga.js                # Manga schema with ratings
│   ├── Rating.js               # User-manga rating relationship
│   └── Thread.js               # Discussion thread schema
│
├── middleware/
│   └── auth.js                 # Authentication middleware
│
├── routes/
│   ├── auth.js                 # Authentication routes
│   ├── manga.js                # Manga CRUD routes
│   ├── discussions.js          # Discussion forum routes
│   └── index.js                # Home, search, trending routes
│
├── views/
│   ├── partials/
│   │   ├── navbar.ejs          # Navigation bar
│   │   ├── footer.ejs          # Footer component
│   │   └── flash.ejs           # Flash messages
│   ├── auth/
│   │   ├── login.ejs           # Login page
│   │   └── signup.ejs          # Registration page
│   ├── manga/
│   │   ├── list.ejs            # Manga listing page
│   │   └── detail.ejs          # Manga detail with ratings
│   ├── discussions/
│   │   ├── list.ejs            # Discussion threads list
│   │   ├── create.ejs          # Create discussion form
│   │   └── detail.ejs          # Thread with replies
│   ├── index.ejs               # Homepage
│   ├── trending.ejs            # Trending manga page
│   ├── top-rated.ejs           # Top-rated manga page
│   ├── search.ejs              # Search results page
│   ├── 404.ejs                 # 404 error page
│   └── error.ejs               # Generic error page
│
└── public/
    ├── css/
    │   └── style.css           # Main stylesheet
    └── js/
        ├── main.js             # Core JavaScript functionality
        └── rating.js           # Rating system logic
```

---

## 📊 Database Schema (MongoDB CRUD Operations)

### 1. **User Collection**
```javascript
{
  username: String,          // Unique username
  email: String,             // Unique email
  password: String,          // Bcrypt hashed password
  createdAt: Date           // Registration timestamp
}
```

**CRUD Operations:**
- **CREATE**: User signup (`POST /auth/signup`)
- **READ**: Login validation, user info display
- **UPDATE**: (Future: profile updates)
- **DELETE**: (Future: account deletion)

### 2. **Manga Collection**
```javascript
{
  title: String,            // Manga title
  author: String,           // Author name
  description: String,      // Synopsis
  coverImage: String,       // Cover image URL
  genres: [String],         // Array of genres
  status: String,           // ongoing/completed/hiatus
  chapters: Number,         // Total chapters
  publicationYear: Number,  // Release year
  averageRating: Number,    // Calculated average (0-5)
  ratingCount: Number,      // Total ratings received
  viewCount: Number         // Page view tracking
}
```

**CRUD Operations:**
- **CREATE**: Database seeding, admin manga addition
- **READ**: Browse, search, detail pages
- **UPDATE**: Rating updates, view count increment
- **DELETE**: (Future: admin manga removal)

### 3. **Rating Collection**
```javascript
{
  manga: ObjectId,          // Reference to Manga
  user: ObjectId,           // Reference to User
  rating: Number,           // Rating value (1-5)
  createdAt: Date,         // Rating timestamp
  updatedAt: Date          // Last update timestamp
}
```

**CRUD Operations:**
- **CREATE**: First-time rating (`POST /manga/:id/rate`)
- **READ**: Display user's current rating
- **UPDATE**: Update existing rating (upsert pattern)
- **DELETE**: (Future: remove rating)

### 4. **Thread Collection**
```javascript
{
  title: String,            // Thread title
  content: String,          // Thread content
  manga: ObjectId,          // Reference to Manga
  author: ObjectId,         // Reference to User
  replies: [{              // Embedded replies
    content: String,
    author: ObjectId,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**CRUD Operations:**
- **CREATE**: New thread (`POST /discussions/create`), add reply (`POST /discussions/:id/reply`)
- **READ**: Thread list, thread detail with replies
- **UPDATE**: Automatic `updatedAt` on new replies
- **DELETE**: Thread deletion (`DELETE /discussions/:id`)

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local installation)
- npm

### Quick Setup

```bash
# 1. Install MongoDB (Ubuntu/Debian)
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# 2. Clone and setup
git clone <repo-url>
cd Animeverse
cp .env.example .env
npm install

# 3. Seed database
npm run seed

# 4. Start server
npm start
```

Visit http://localhost:3000 (Login: admin/admin123)

### Step 6: Start Development Server
```bash
npm run dev
# or
nodemon app.js
```

The application will be available at: **http://localhost:3000**

---

## 🎮 Usage Guide

### For End Users

1. **Browse Manga**
   - Visit homepage to see featured manga
   - Click "Browse All Manga" to view complete catalog
   - Use search bar to find specific titles

2. **Create Account**
   - Click "Sign Up" in navigation
   - Enter username, email, and password
   - Login with credentials

3. **Rate Manga**
   - Click on any manga to view details
   - Scroll to rating section
   - Click stars to rate (1-5 stars)
   - Submit rating (requires login)

4. **Start Discussions**
   - Navigate to manga detail page
   - Click "Start Discussion"
   - Enter title and content
   - Submit to create thread

5. **Reply to Threads**
   - Open any discussion thread
   - Scroll to reply form
   - Enter your reply
   - Submit to participate

---

## 📝 API Routes

### Authentication Routes (`/auth`)
```
GET  /auth/login         - Display login page
POST /auth/login         - Process login
GET  /auth/signup        - Display signup page
POST /auth/signup        - Process registration
POST /auth/logout        - Logout user
```

### Manga Routes (`/manga`)
```
GET  /manga              - List all manga
GET  /manga/:id          - Manga detail page
POST /manga/:id/rate     - Submit/update rating
```

### Discussion Routes (`/discussions`)
```
GET    /discussions              - List all threads
GET    /discussions/create       - Create thread form
POST   /discussions/create       - Process thread creation
GET    /discussions/:id          - Thread detail with replies
POST   /discussions/:id/reply    - Add reply to thread
DELETE /discussions/:id          - Delete thread (author only)
```

### General Routes (`/`)
```
GET /                    - Homepage
GET /trending            - Trending manga
GET /top-rated           - Top-rated manga
GET /search              - Search results
```

---

## 🧪 Testing for Viva/Demonstration

### Feature Demonstration Checklist

#### 1. **CRUD Operations** ✅

**CREATE Operations:**
- [ ] User registration (creates User document)
- [ ] Manga rating submission (creates Rating document)
- [ ] Discussion thread creation (creates Thread document)
- [ ] Reply to thread (updates Thread with embedded reply)

**READ Operations:**
- [ ] View all manga (reads Manga collection)
- [ ] Search manga (text search query)
- [ ] View discussion threads (reads Thread collection)
- [ ] Display user ratings (joins Rating with Manga)

**UPDATE Operations:**
- [ ] Update manga rating (upsert operation)
- [ ] Increment view count (auto on manga detail page)
- [ ] Update thread timestamp (auto on new reply)

**DELETE Operations:**
- [ ] Delete discussion thread (author-only deletion)

#### 2. **Authentication Flow** ✅
- [ ] Signup with new account
- [ ] Login with credentials
- [ ] Access protected routes (rating, create thread)
- [ ] Logout and verify redirect

#### 3. **Template Rendering** ✅
- [ ] Show EJS partials (navbar, footer reused)
- [ ] Demonstrate dynamic content rendering
- [ ] Show flash messages on actions
- [ ] Explain layout composition

#### 4. **JavaScript Interactivity** ✅
- [ ] Interactive star rating (hover, click)
- [ ] Mobile menu toggle
- [ ] User dropdown menu
- [ ] Filter buttons (trending page)
- [ ] Flash message auto-dismiss

#### 5. **Database Relationships** ✅
- [ ] User → Rating → Manga (many-to-many)
- [ ] User → Thread (one-to-many)
- [ ] Manga → Thread (one-to-many)
- [ ] Thread → Replies (embedded documents)

---

## 📚 Key Learning Points for Viva

### 1. **Why EJS over Handlebars?**
- Familiar JavaScript syntax (`<%= %>` tags)
- Easy to learn and implement
- Built-in support for partials (`<%- include() %>`)
- Great for server-side rendering with Express

### 2. **Session vs JWT Authentication**
- Used session-based auth for simplicity
- Sessions stored on server, sessionId in cookie
- Suitable for traditional web applications
- Express-session middleware handles it automatically

### 3. **MongoDB Schema Design**
- **Embedded vs Referenced:** Replies embedded in threads (one-to-few), Ratings as separate collection (many-to-many)
- **Indexes:** Text index on manga title/description for search, compound unique index on (manga, user) for ratings
- **Pre-save Hooks:** Password hashing, timestamp updates

### 4. **RESTful Route Patterns**
```
GET    /resource         - List all (index)
GET    /resource/:id     - Show one (show)
GET    /resource/new     - New form (new)
POST   /resource         - Create (create)
GET    /resource/:id/edit - Edit form (edit)
PUT    /resource/:id     - Update (update)
DELETE /resource/:id     - Delete (destroy)
```

### 5. **Middleware Stack**
```javascript
app.use(express.static('public'))      // Static files
app.use(express.urlencoded())          // Parse form data
app.use(session())                     // Session management
app.use(flash())                       // Flash messages
app.use(methodOverride())              // DELETE/PUT support
app.use(customMiddleware)              // Custom logic
```

---

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running:
```bash
sudo systemctl start mongod
# or check status
sudo systemctl status mongod
```

**2. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change port in `.env` or kill process:
```bash
lsof -ti:3000 | xargs kill -9
```

**3. Session Secret Warning**
```
Warning: connect.session() MemoryStore is not designed for production
```
**Solution:** This is expected in development. For production, use MongoDB session store or Redis.

**4. Module Not Found**
```
Error: Cannot find module 'express'
```
**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Future Enhancements

- [ ] User profile pages with activity history
- [ ] Advanced search with filters (genre, year, status)
- [ ] Pagination for large datasets
- [ ] Image upload for custom manga covers
- [ ] Email verification for signup
- [ ] Password reset functionality
- [ ] Admin dashboard for manga management
- [ ] Reading list / favorites feature
- [ ] Notification system for thread replies
- [ ] Social sharing integration
- [ ] Dark mode toggle
- [ ] Manga recommendations based on ratings

---

## 📄 License

This project is created for educational purposes as part of a web development course.

---

## 👨‍💻 Developer

**MangaVerse** - Full-Stack Manga Discussion Platform

Built with ❤️ using Node.js, Express, MongoDB, and EJS

---

## 📞 Support

For questions or issues during the viva demonstration:

1. Check the troubleshooting section above
2. Verify all dependencies are installed (`npm install`)
3. Ensure MongoDB is running
4. Run seed script for sample data (`node config/seed.js`)
5. Restart the server with Nodemon (`npm run dev`)

**Happy Coding! 🎉**
