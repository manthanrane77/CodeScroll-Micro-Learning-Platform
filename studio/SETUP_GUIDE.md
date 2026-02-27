# Code Scroller - Setup Guide for New Developers

This guide will help you set up and run the Code Scroller project on your local machine.

---

## 📋 Prerequisites

Before starting, make sure you have the following installed:

### Required Software

1. **Java Development Kit (JDK) 21 or higher**
   - Download: https://adoptium.net/ or https://www.oracle.com/java/technologies/downloads/
   - Verify installation: `java -version`

2. **Node.js 18+ and npm**
   - Download: https://nodejs.org/
   - Verify installation: `node -v` and `npm -v`

3. **Maven 3.8+** (for building Java backend)
   - Download: https://maven.apache.org/download.cgi
   - Or use Maven wrapper (included in project)
   - Verify installation: `mvn -v`

4. **Git**
   - Download: https://git-scm.com/
   - Verify installation: `git --version`

5. **VS Code** (Recommended IDE)
   - Download: https://code.visualstudio.com/

### ⚠️ No Database Installation Required!

**This project uses H2 Database** - a lightweight, file-based database that:
- ✅ **Auto-creates** on first run
- ✅ **No installation needed** - embedded in the application
- ✅ **No configuration required** - works out of the box
- ✅ **Stores data** in `backend/data/devdb.mv.db` file

**You don't need to install MySQL, PostgreSQL, or any other database!**

---

## 🚀 Quick Start Guide

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Kunal-sonawanee/studio.git

# Navigate to project directory
cd studio
```

---

### Step 2: Backend Setup (Spring Boot)

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Set Java Environment (Windows PowerShell)
```powershell
# Set JAVA_HOME (adjust path to your JDK installation)
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-23'
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Verify Java version
java -version
```

#### 2.3 Build the Backend
```bash
# Clean and build the project (skip tests for faster build)
mvn clean package -DskipTests
```

**Expected Output:**
```
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

#### 2.4 Start the Backend Server
```bash
# Run the Spring Boot application
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Expected Output:**
```
Started BackendApplication in X seconds
Tomcat started on port 8081 (http)
```

**Backend will be running at:** `http://localhost:8081`

---

### Step 3: Frontend Setup (Next.js)

Open a **NEW TERMINAL** (keep backend running) and follow these steps:

#### 3.1 Navigate to Project Root
```bash
cd studio  # or navigate back to root directory
```

#### 3.2 Install Dependencies
```bash
# Install all Node.js dependencies
npm install
```

**This will take a few minutes...**

#### 3.3 Create Environment File (Optional)
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_BASE=http://localhost:8081/api" > .env.local
```

#### 3.4 Start the Frontend Development Server
```bash
# Start Next.js development server
npm run dev
```

**Expected Output:**
```
▲ Next.js 15.3.3
- Local:        http://localhost:3000
- Network:      http://10.x.x.x:3000

✓ Ready in X.Xs
```

**Frontend will be running at:** `http://localhost:3000`

---

### Step 4: Access the Application

1. **Open your browser** and go to: `http://localhost:3000`
2. **You should see the Code Scroller home page!**

---

## 🔧 Configuration Details

### Backend Configuration

**File:** `backend/src/main/resources/application.properties`

```properties
# Server Configuration
server.port=8081

# Database (H2 - File-based, Auto-created)
spring.datasource.url=jdbc:h2:file:./data/devdb
spring.datasource.username=sa
spring.datasource.password=

# H2 Console (for database inspection)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA/Hibernate (Auto-creates tables)
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# JWT Secret
jwt.secret=your-secret-key-here-change-in-production
jwt.expiration=86400000
```

**Note:** The database file will be automatically created at `backend/data/devdb.mv.db` when you first run the backend. No manual database setup required!

### Frontend Configuration

**File:** `.env.local` (create if not exists)

```env
NEXT_PUBLIC_API_BASE=http://localhost:8081/api
```

---

## 📁 Project Structure Overview

```
studio/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/          # Java source code
│   │   │   └── resources/     # Configuration files
│   │   └── test/              # Test files
│   ├── target/                # Compiled JAR files
│   ├── uploads/               # Uploaded images storage
│   ├── data/                  # H2 database files
│   └── pom.xml               # Maven dependencies
│
├── src/                       # Next.js Frontend
│   ├── app/                  # Pages (App Router)
│   ├── components/           # React components
│   ├── lib/                  # Utilities & API calls
│   └── hooks/                # Custom React hooks
│
├── docs/                      # Documentation
├── package.json              # Node.js dependencies
├── next.config.ts            # Next.js configuration
└── tsconfig.json             # TypeScript configuration
```

---

## 🧪 Testing the Setup

### 1. Check Backend Health
Open browser or use curl:
```bash
curl http://localhost:8081/api/posts
```

### 2. Check H2 Database Console
- URL: `http://localhost:8081/h2-console`
- JDBC URL: `jdbc:h2:file:./data/devdb`
- Username: `sa`
- Password: (leave empty)

### 3. Test Frontend
- Navigate to `http://localhost:3000`
- You should see the post feed
- Try registering a new account

---

## 👤 Create First Admin User

By default, only regular users can register. To create an admin:

### Method 1: Via H2 Console
1. Go to `http://localhost:8081/h2-console`
2. Login with credentials above
3. Run these SQL commands:

```sql
-- Find your user ID
SELECT id, email, full_name FROM users WHERE email = 'your-email@example.com';

-- Grant ADMIN role (role_id 2 is ADMIN, 1 is USER)
INSERT INTO user_roles (user_id, role_id) VALUES (YOUR_USER_ID, 2);
```

### Method 2: Via Backend Code
Edit `backend/src/main/java/com/example/backend/config/DataInitializer.java` to create a default admin.

---

## 🐛 Common Issues & Troubleshooting

### Issue 1: Backend Port Already in Use
**Error:** `Port 8081 is already in use`

**Solution:**
```powershell
# Windows: Kill process on port 8081
Get-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess | Stop-Process -Force

# Linux/Mac: Kill process on port 8081
lsof -ti:8081 | xargs kill -9
```

### Issue 2: Frontend Port Already in Use
**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001

# Or kill the process using port 3000
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Issue 3: Java Version Mismatch
**Error:** `Unsupported class file major version`

**Solution:**
- Ensure you're using JDK 21 or higher
- Check: `java -version`
- Update JAVA_HOME environment variable

### Issue 4: Maven Build Fails
**Error:** `Cannot resolve dependencies`

**Solution:**
```bash
# Clear Maven cache and rebuild
mvn clean install -U -DskipTests
```

### Issue 5: Database Connection Error
**Error:** `Unable to connect to database`

**Solution:**
- **The database is auto-created!** No setup needed.
- Ensure the `backend/data/` directory is writable
- If issues persist, delete `backend/data/devdb.mv.db` and restart (it will recreate automatically)
- The database file is created on first backend startup

### Issue 6: CORS Errors in Browser
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
- Check `backend/src/main/java/com/example/backend/config/WebConfig.java`
- Ensure `http://localhost:3000` is in allowed origins
- Restart backend server

### Issue 7: Image Upload Fails
**Error:** `Failed to upload image`

**Solution:**
- Ensure `backend/uploads/` directory exists
- Check file permissions
- Verify file size (max 10MB)

---

## 📝 Development Workflow

### Starting Development

1. **Start Backend First:**
   ```bash
   cd backend
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

2. **Start Frontend (new terminal):**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8081/api`
   - H2 Console: `http://localhost:8081/h2-console`

### Making Changes

#### Backend Changes:
1. Edit Java files
2. Stop backend (Ctrl+C)
3. Rebuild: `mvn clean package -DskipTests`
4. Restart: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

#### Frontend Changes:
- Changes auto-reload with Hot Module Replacement (HMR)
- No need to restart the server

---

## 🔑 Default Accounts

After first run, the system creates default roles:
- **USER** (role_id: 1)
- **ADMIN** (role_id: 2)

**No default users are created** - you need to register!

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Posts
- `GET /api/posts?status=approved` - Get all approved posts
- `GET /api/posts?status=pending` - Get pending posts (admin)
- `POST /api/posts` - Create new post
- `PUT /api/posts/{id}/status` - Approve/reject post (admin)
- `DELETE /api/posts/{id}` - Delete post (admin)
- `POST /api/posts/{id}/like` - Like post
- `POST /api/posts/{id}/dislike` - Dislike post

### Comments
- `POST /api/posts/{id}/comments` - Add comment

### User Profile
- `GET /api/user/{id}` - Get user profile
- `PUT /api/user/{id}/profile` - Update profile
- `PUT /api/user/{id}/password` - Change password

### File Upload
- `POST /api/uploads` - Upload image file

---

## 📦 Build for Production

### Backend Production Build
```bash
cd backend
mvn clean package -Dmaven.test.skip=true
```

### Frontend Production Build
```bash
npm run build
npm start
```

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Logs:**
   - Backend: Look at terminal where backend is running
   - Frontend: Check browser console (F12)

2. **Review Documentation:**
   - `PROJECT_REPORT.md` - Complete project documentation
   - `UML_DIAGRAMS.md` - System architecture diagrams
   - `README.md` - Project overview

3. **Common Commands:**
   ```bash
   # Check if ports are in use
   netstat -ano | findstr :8081  # Windows
   netstat -ano | findstr :3000
   
   # Check Java processes
   jps -l
   
   # Check Node processes
   tasklist | findstr node  # Windows
   ```

---

## ✅ Verification Checklist

Before starting development, ensure:

- [ ] Java 21+ installed and in PATH
- [ ] Node.js 18+ installed
- [ ] Maven installed (or use included wrapper)
- [ ] Project cloned from GitHub
- [ ] Backend builds successfully (`mvn clean package -DskipTests`)
- [ ] Backend starts on port 8081
- [ ] Database auto-created in `backend/data/` ✨ (automatic, no action needed)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend starts on port 3000
- [ ] Can access `http://localhost:3000` in browser
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can create a post
- [ ] Can view posts in feed

---

## 🎉 You're All Set!

You should now have Code Scroller running locally. Happy coding! 🚀

---

**Project:** Code Scroller  
**Repository:** https://github.com/Kunal-sonawanee/studio  
**Last Updated:** November 4, 2025
