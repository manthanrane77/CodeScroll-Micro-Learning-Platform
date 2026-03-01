# Code Scroller - Project Documentation Report

**Version:** 1.0.0  
**Tech Stack:** Next.js 15 + Spring Boot 3.2.12 + H2 Database

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Architecture](#database-architecture)
5. [API Documentation](#api-documentation)
6. [Authentication Flow](#authentication-flow)
7. [Feature Documentation](#feature-documentation)
8. [User Flows](#user-flows)
9. [Admin Panel](#admin-panel)
10. [Deployment Guide](#deployment-guide)

---

## 🎯 Project Overview

**Code Scroller** is a modern social media platform for sharing and discussing technology content. It provides a rich user experience with features like post creation, commenting, liking/disliking, content moderation, and AI-powered content simplification.

### Key Features
- ✅ User authentication (Register/Login with JWT)
- ✅ Post creation with image upload
- ✅ Content approval workflow (Admin moderation)
- ✅ Like/Dislike system
- ✅ Comment system with user-owned deletion
- ✅ User profile management with avatar upload
- ✅ Admin dashboard with user/post/comment management
- ✅ AI-powered content simplification
- ✅ Grammar checking
- ✅ Saved posts functionality
- ✅ Dark/Light theme support

---

## 💻 Technology Stack

### Frontend
- **Framework:** Next.js 15.3.3 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI)
- **State Management:** React Context API
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Fetch API

### Backend
- **Framework:** Spring Boot 3.2.12
- **Language:** Java 23
- **Build Tool:** Maven
- **Database:** H2 (File-based)
- **ORM:** Hibernate/JPA
- **Security:** JWT Authentication, BCrypt Password Hashing
- **Port:** 8081

### AI Service
- **Framework:** Node.js
- **AI SDK:** Google Genkit
- **Features:** Grammar checking, content simplification, post assistance

### Development Tools
- **Version Control:** Git/GitHub
- **Package Manager:** npm (Frontend), Maven (Backend)
- **IDE Support:** VS Code optimized

---

## 📁 Project Structure

### Root Directory
```
studio/
├── frontend/                    # Next.js application
├── backend/                     # Spring Boot application
├── ai-service/                  # AI features service
├── docs/                        # Documentation
├── package.json                 # Frontend dependencies
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── PROJECT_REPORT.md           # This file
```

### Frontend Structure (`/`)
```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Home page (feed)
│   ├── globals.css            # Global styles
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   ├── create/                # Post creation page
│   ├── profile/               # User profile pages
│   │   ├── page.tsx          # Profile view
│   │   └── edit/             # Profile edit page
│   ├── saved/                 # Saved posts page
│   └── admin/                 # Admin dashboard
│       ├── page.tsx          # Dashboard overview
│       └── _components/      # Admin components
│           ├── admin-posts-tab.tsx
│           ├── admin-users-tab.tsx
│           └── admin-comments-tab.tsx
├── components/                # Reusable components
│   ├── app-layout.tsx        # Main app layout with sidebar
│   ├── post-card.tsx         # Post display component
│   ├── post-feed.tsx         # Post feed with filtering
│   ├── comment-section.tsx   # Comment UI with CRUD
│   ├── theme-provider.tsx    # Dark/Light theme
│   ├── theme-toggle.tsx      # Theme switcher
│   └── ui/                   # shadcn/ui components
├── hooks/                    # Custom React hooks
│   ├── use-toast.ts         # Toast notifications
│   ├── use-mobile.tsx       # Mobile detection
│   └── use-saved-posts.ts   # Saved posts state
├── lib/                     # Utilities and helpers
│   ├── auth-context.tsx    # Authentication context
│   ├── auth.ts             # Auth API functions
│   ├── posts.ts            # Post API functions
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
└── ai/                      # AI integration
    ├── genkit.ts           # Genkit configuration
    └── flows/              # AI flows
```

### Backend Structure (`/backend`)
```
backend/
├── src/main/java/com/example/backend/
│   ├── BackendApplication.java       # Main application class
│   ├── config/                       # Configuration classes
│   │   ├── DataInitializer.java    # Database initialization
│   │   ├── SecurityConfig.java     # Security configuration
│   │   ├── WebConfig.java          # Web/CORS configuration
│   │   └── ResourceConfig.java     # Static resource serving
│   ├── model/                       # JPA entities
│   │   ├── User.java               # User entity
│   │   ├── Post.java               # Post entity
│   │   ├── Comment.java            # Comment entity
│   │   └── Role.java               # Role entity (enum)
│   ├── repository/                 # JPA repositories
│   │   ├── UserRepository.java
│   │   ├── PostRepository.java
│   │   ├── CommentRepository.java
│   │   └── RoleRepository.java
│   ├── service/                    # Business logic
│   │   ├── AuthService.java       # Authentication
│   │   ├── PostService.java       # Post operations
│   │   ├── CommentService.java    # Comment operations
│   │   └── UserService.java       # User profile management
│   ├── dto/                       # Data Transfer Objects
│   │   ├── AuthResponse.java     # Auth response with JWT
│   │   ├── UpdateProfileRequest.java
│   │   └── ChangePasswordRequest.java
│   ├── controller/               # REST Controllers
│   │   ├── AuthController.java  # /api/auth
│   │   ├── PostController.java  # /api/posts
│   │   ├── CommentController.java # /api/comments
│   │   ├── UserController.java  # /api/user
│   │   └── UploadController.java # /api/uploads
│   ├── security/                # Security components
│   │   ├── JwtUtil.java        # JWT token utilities
│   │   └── JwtAuthFilter.java  # JWT authentication filter
│   └── web/                    # Web-specific classes
├── src/main/resources/
│   ├── application.properties       # Main configuration
│   ├── application-mysql.properties # MySQL configuration
│   └── db/migration/               # Database migrations
├── uploads/                        # Uploaded files directory
├── data/                          # H2 database files
│   └── devdb.mv.db               # H2 database file
├── pom.xml                       # Maven dependencies
└── target/                       # Compiled output
    └── backend-0.0.1-SNAPSHOT.jar
```

### AI Service Structure (`/ai-service`)
```
ai-service/
├── index.js                # Main server file
├── package.json           # Dependencies
├── flows/                 # AI flow definitions
│   ├── check-grammar.js
│   ├── simplify-paragraph.js
│   └── generate-post-assist.js
└── lib/
    └── provider.js        # AI provider configuration
```

---

## 🗄️ Database Architecture

### Database Type
**H2 Database** (File-based, auto-created)
- **Location:** `backend/data/devdb.mv.db`
- **Connection:** `jdbc:h2:file:./data/devdb`
- **H2 Console:** `http://localhost:8081/h2-console`
- **Username:** sa
- **Password:** (empty)

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    User     │         │    Post     │         │   Comment   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id (PK)     │────┐    │ id (PK)     │────┐    │ id (PK)     │
│ full_name   │    │    │ title       │    │    │ content     │
│ email       │    │    │ content     │    │    │ created_at  │
│ password    │    │    │ topic       │    │    │ author_name │
│ photo_url   │    │    │ image_url   │    │    │ author_email│
│ created_at  │    │    │ status      │    │    │ avatar_url  │
└─────────────┘    │    │ likes       │    │    │ post_id (FK)│
                   │    │ dislikes    │    │    └─────────────┘
┌─────────────┐    │    │ created_at  │    │           │
│    Role     │    │    │ user_id (FK)│    │           │
├─────────────┤    │    └─────────────┘    │           │
│ id (PK)     │    │           │            │           │
│ name        │    └───────────┘            └───────────┘
└─────────────┘
       │
       │
┌─────────────┐
│ user_roles  │ (Join Table)
├─────────────┤
│ user_id (FK)│
│ role_id (FK)│
└─────────────┘
```

### Database Tables

#### 1. `users` Table
| Column      | Type         | Constraints            | Description              |
|-------------|--------------|------------------------|--------------------------|
| id          | BIGINT       | PRIMARY KEY, AUTO_INC  | User ID                  |
| full_name   | VARCHAR(255) | NOT NULL               | User's full name         |
| email       | VARCHAR(255) | UNIQUE, NOT NULL       | User's email (login)     |
| password    | VARCHAR(255) | NOT NULL               | BCrypt hashed password   |
| photo_url   | VARCHAR(255) | NULL                   | Profile picture URL      |
| created_at  | TIMESTAMP    | NOT NULL               | Account creation date    |

**Indexes:**
- Primary Key: `id`
- Unique Index: `email`

#### 2. `posts` Table
| Column      | Type         | Constraints            | Description              |
|-------------|--------------|------------------------|--------------------------|
| id          | BIGINT       | PRIMARY KEY, AUTO_INC  | Post ID                  |
| title       | VARCHAR(255) | NOT NULL               | Post title               |
| content     | TEXT         | NOT NULL               | Post content             |
| topic       | VARCHAR(100) | NOT NULL               | Post category/topic      |
| image_url   | VARCHAR(500) | NULL                   | Post image URL           |
| status      | VARCHAR(20)  | NOT NULL               | 'pending' or 'approved'  |
| likes       | INT          | DEFAULT 0              | Like count               |
| dislikes    | INT          | DEFAULT 0              | Dislike count            |
| created_at  | TIMESTAMP    | NOT NULL               | Post creation date       |
| user_id     | BIGINT       | FOREIGN KEY            | Author user ID           |

**Indexes:**
- Primary Key: `id`
- Foreign Key: `user_id` → `users(id)`
- Index on: `status`, `created_at`

#### 3. `comments` Table
| Column       | Type         | Constraints            | Description              |
|--------------|--------------|------------------------|--------------------------|
| id           | BIGINT       | PRIMARY KEY, AUTO_INC  | Comment ID               |
| content      | TEXT         | NOT NULL               | Comment text             |
| created_at   | TIMESTAMP    | NOT NULL               | Comment creation date    |
| author_name  | VARCHAR(255) | NOT NULL               | Commenter's name         |
| author_email | VARCHAR(255) | NOT NULL               | Commenter's email        |
| avatar_url   | VARCHAR(500) | NULL                   | Commenter's avatar       |
| post_id      | BIGINT       | FOREIGN KEY            | Related post ID          |

**Indexes:**
- Primary Key: `id`
- Foreign Key: `post_id` → `posts(id)`

#### 4. `roles` Table
| Column | Type         | Constraints            | Description              |
|--------|--------------|------------------------|--------------------------|
| id     | BIGINT       | PRIMARY KEY, AUTO_INC  | Role ID                  |
| name   | VARCHAR(50)  | UNIQUE, NOT NULL       | Role name (USER, ADMIN)  |

**Data:**
- USER (id: 1)
- ADMIN (id: 2)

#### 5. `user_roles` Table (Join Table)
| Column  | Type   | Constraints            | Description              |
|---------|--------|------------------------|--------------------------|
| user_id | BIGINT | FOREIGN KEY            | User ID                  |
| role_id | BIGINT | FOREIGN KEY            | Role ID                  |

**Composite Primary Key:** `(user_id, role_id)`

---

## 🔌 API Documentation

### Base URLs
- **Backend API:** `http://localhost:8081/api`
- **Frontend:** `http://localhost:3000`
- **AI Service:** `http://localhost:9002`

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "displayName": "John Doe",
    "photoURL": null,
    "role": "user"
  }
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "displayName": "John Doe",
    "photoURL": "http://localhost:8081/uploads/avatar.jpg",
    "role": "user"
  }
}
```

---

### Post Endpoints

#### GET `/api/posts?status={status}`
Get all posts (optionally filtered by status).

**Query Parameters:**
- `status` (optional): `pending` or `approved`

**Response (200):**
```json
[
  {
    "id": "1",
    "title": "Introduction to React",
    "content": "React is a JavaScript library...",
    "topic": "React",
    "imageUrl": "http://localhost:8081/uploads/post1.jpg",
    "author": {
      "name": "John Doe",
      "email": "john@example.com",
      "avatarUrl": "http://localhost:8081/uploads/avatar.jpg"
    },
    "status": "approved",
    "likes": 10,
    "dislikes": 2,
    "createdAt": "2025-11-04 10:30:00",
    "comments": [...]
  }
]
```

#### POST `/api/posts`
Create a new post (requires authentication).

**Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "title": "My New Post",
  "content": "This is the post content...",
  "topic": "JavaScript",
  "imageUrl": "http://localhost:8081/uploads/image.jpg"
}
```

**Response (201):**
```json
{
  "id": "2",
  "title": "My New Post",
  "status": "pending",
  ...
}
```

#### PUT `/api/posts/{id}/approve`
Approve a pending post (admin only).

**Headers:**
- `Authorization: Bearer {admin_token}`

**Response (200):**
```json
{
  "message": "Post approved successfully"
}
```

#### DELETE `/api/posts/{id}`
Delete a post (admin only).

**Headers:**
- `Authorization: Bearer {admin_token}`

**Response (200):**
```json
{
  "message": "Post deleted successfully"
}
```

---

### Comment Endpoints

#### POST `/api/comments/{postId}`
Add a comment to a post (requires authentication).

**Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "content": "Great post! Very informative."
}
```

**Response (201):**
```json
{
  "id": "c1",
  "content": "Great post! Very informative.",
  "author": {
    "name": "John Doe",
    "email": "john@example.com",
    "avatarUrl": "..."
  },
  "createdAt": "2025-11-04 11:00:00"
}
```

---

### User Profile Endpoints

#### GET `/api/user/{id}`
Get user profile information.

**Response (200):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "displayName": "John Doe",
  "photoURL": "http://localhost:8081/uploads/avatar.jpg",
  "role": "user"
}
```

#### PUT `/api/user/{id}/profile`
Update user profile (requires authentication).

**Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "fullName": "John Updated",
  "photoUrl": "http://localhost:8081/uploads/new-avatar.jpg"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "displayName": "John Updated",
  "photoURL": "http://localhost:8081/uploads/new-avatar.jpg",
  "role": "user"
}
```

#### PUT `/api/user/{id}/password`
Change user password (requires authentication).

**Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

### File Upload Endpoint

#### POST `/api/uploads`
Upload an image file.

**Request:**
- Content-Type: `multipart/form-data`
- Form field: `file`

**Response (200):**
```json
{
  "url": "http://localhost:8081/uploads/uuid-filename.jpg"
}
```

**File Storage:**
- Location: `backend/uploads/`
- Naming: `{UUID}-{original-filename}`
- Access: `http://localhost:8081/uploads/{filename}`

---

## 🔐 Authentication Flow

### JWT Token-Based Authentication

```
┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
│   Client    │                 │   Backend   │                 │  Database   │
│  (Frontend) │                 │  (API)      │                 │   (H2)      │
└──────┬──────┘                 └──────┬──────┘                 └──────┬──────┘
       │                               │                               │
       │  1. POST /api/auth/register   │                               │
       │  { email, password, name }    │                               │
       ├──────────────────────────────>│                               │
       │                               │  2. Hash password (BCrypt)    │
       │                               ├───────────────────────────────>
       │                               │                               │
       │                               │  3. Save user to DB           │
       │                               │<──────────────────────────────┤
       │                               │                               │
       │                               │  4. Generate JWT token        │
       │                               │                               │
       │  5. Return token + user data  │                               │
       │<──────────────────────────────┤                               │
       │                               │                               │
       │  6. Store in localStorage     │                               │
       │     - auth_token              │                               │
       │     - auth_user               │                               │
       │                               │                               │
       │  7. Subsequent API requests   │                               │
       │  Authorization: Bearer {token}│                               │
       ├──────────────────────────────>│                               │
       │                               │  8. Validate JWT              │
       │                               │                               │
       │                               │  9. Extract user info         │
       │                               │     from token                │
       │                               │                               │
       │  10. Return protected data    │                               │
       │<──────────────────────────────┤                               │
       │                               │                               │
```

### Token Structure
```json
{
  "sub": "john@example.com",
  "iat": 1699123456,
  "exp": 1699209856,
  "role": "user"
}
```

### Security Features
- ✅ BCrypt password hashing (cost factor: 10)
- ✅ JWT token expiration (24 hours)
- ✅ CORS configuration (localhost:3000, 3001, 9002)
- ✅ Role-based access control (USER, ADMIN)
- ✅ Protected routes requiring authentication
- ✅ Admin-only endpoints for moderation

---

## ⚡ Feature Documentation

### 1. User Registration & Authentication

**Registration Flow:**
1. User fills registration form (name, email, password)
2. Frontend validates input (email format, password length)
3. POST request to `/api/auth/register`
4. Backend hashes password with BCrypt
5. User saved to database with USER role
6. JWT token generated and returned
7. User automatically logged in
8. Redirected to home page

**Login Flow:**
1. User enters email and password
2. POST request to `/api/auth/login`
3. Backend verifies credentials
4. JWT token generated if valid
5. User data and token returned
6. Stored in localStorage
7. Redirected to home page

---

### 2. Post Creation & Management

**Create Post Flow:**
1. User clicks "Create Post" in sidebar
2. Redirected to `/create` page
3. Fills form:
   - Title
   - Content (with AI assistance)
   - Topic selection
   - Image upload
4. Image uploaded to `/api/uploads` first
5. Post submitted with image URL
6. Post created with status='pending'
7. Admin must approve before it appears in feed

**Post Approval Workflow:**
```
User Creates Post → Status: PENDING → Admin Reviews
                                     ↓
                              [Approve] → Status: APPROVED → Visible in Feed
                                     ↓
                              [Delete] → Post Removed
```

**Post Card Features:**
- Title and content display
- Topic badge
- Author information (avatar, name)
- Like/Dislike buttons with counters
- Comment button (shows comment section)
- Share button (copies link)
- AI Simplify button
- Bookmark/Save button
- Read more/Show less for long content

---

### 3. Comment System

**Comment Features:**
- ✅ Add comments (authenticated users only)
- ✅ View all comments on a post
- ✅ Delete own comments
- ✅ Admin can delete any comment
- ✅ Real-time comment count updates
- ✅ Author information display

**Comment Flow:**
1. User expands post comments
2. Enters comment text
3. POST request to `/api/comments/{postId}`
4. Comment saved to database
5. Comment appears immediately
6. Author can delete their own comment

---

### 4. User Profile Management

**Profile Features:**
- ✅ View profile information
- ✅ Display avatar
- ✅ Show published posts count
- ✅ Show pending posts count
- ✅ Edit profile (name, avatar)
- ✅ Change password

**Profile Edit Flow:**
1. User clicks "Edit Profile" button
2. Redirected to `/profile/edit`
3. Two tabs available:
   - **Profile Tab**: Update name and photo
   - **Password Tab**: Change password
4. Image upload for avatar
5. Submit changes
6. Profile updated in database
7. Auth context updated
8. Redirected back to profile

---

### 5. Admin Dashboard

**Admin Access:**
- Only users with ADMIN role can access
- Accessed via sidebar "Admin" menu
- URL: `/admin`

**Dashboard Statistics:**
- Total approved posts
- Pending approval count
- Total users
- Total comments

**Three Management Tabs:**

1. **Post Management:**
   - View all posts (approved + pending)
   - Approve pending posts
   - Delete any post
   - See post details

2. **User Management:**
   - View all registered users
   - See user post count
   - Last active date
   - Delete user accounts

3. **Comment Management:**
   - View all comments across all posts
   - See comment author
   - Link to parent post
   - Delete any comment

---

### 6. AI Features

**AI Service Integration:**
- Port: 9002
- Framework: Google Genkit
- Model: Gemini

**Available AI Flows:**

1. **Grammar Check:**
   - Endpoint: `/checkGrammar`
   - Checks text for grammar errors
   - Returns corrections

2. **Simplify Content:**
   - Endpoint: `/simplifyParagraph`
   - Simplifies complex text
   - Returns easy-to-understand version

3. **Post Assistance:**
   - Endpoint: `/generatePostAssist`
   - Helps generate post content
   - Provides suggestions

---

### 7. Theme System

**Theme Features:**
- ✅ Dark mode
- ✅ Light mode
- ✅ System preference detection
- ✅ Persistent theme selection
- ✅ Smooth transitions
- ✅ Toggle in sidebar

**Implementation:**
- Uses next-themes library
- Stored in localStorage
- Applied via CSS variables
- Tailwind dark: classes

---

### 8. Saved Posts

**Features:**
- ✅ Save/unsave posts
- ✅ View saved posts page
- ✅ Persistent storage (localStorage)
- ✅ Client-side only
- ✅ Quick access from sidebar

**Storage:**
- Key: `saved_posts`
- Format: JSON array of post IDs
- Synchronized across tabs

---

## 👥 User Flows

### New User Journey

```
1. Landing Page (Feed)
   ↓
2. Click "Login" → See Login/Register prompt
   ↓
3. Click "Sign up" link
   ↓
4. Register Page
   - Enter full name
   - Enter email
   - Enter password
   - Click "Create Account"
   ↓
5. Automatic Login
   ↓
6. Redirected to Home Page
   ↓
7. Welcome toast notification
   ↓
8. Can now:
   - View all approved posts
   - Like/dislike posts
   - Comment on posts
   - Save posts
   - Create new posts
   - Edit profile
```

### Post Creation Journey

```
1. Click "Create Post" in sidebar
   ↓
2. Create Post Page
   ↓
3. Fill Form:
   - Title
   - Content (with AI help)
   - Select Topic
   - Upload Image
   ↓
4. Click "Publish Post"
   ↓
5. Post submitted (status: pending)
   ↓
6. Success notification
   ↓
7. View in Profile → Pending tab
   ↓
8. Wait for admin approval
   ↓
9. Once approved → Appears in feed
```

### Admin Workflow

```
1. Login as admin
   ↓
2. Click "Admin" in sidebar
   ↓
3. Admin Dashboard
   ↓
4. Review Pending Posts:
   - View post details
   - Click "Approve" or "Delete"
   ↓
5. Manage Users:
   - View all users
   - Delete accounts if needed
   ↓
6. Moderate Comments:
   - View all comments
   - Delete inappropriate content
```

---

## 🎨 UI/UX Features

### Design System

**Colors:**
- Primary: Blue
- Destructive: Red
- Muted: Gray
- Background: White/Dark
- Foreground: Black/White

**Typography:**
- Headline: Custom font
- Body: System fonts
- Sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl

**Components:**
- Cards with hover effects
- Buttons (default, outline, ghost, link)
- Input fields with focus states
- Badges for tags
- Avatars with fallbacks
- Dialogs/Modals
- Toast notifications
- Loading spinners

### Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Sidebar:**
- Desktop: Collapsed (64px) → Expands on hover (224px)
- Mobile: Fullwidth

---

## 🚀 Deployment Guide

### Prerequisites
- **Java 23** installed
- **Node.js 18+** installed
- **Maven 3.8+** installed
- **npm** installed

### Backend Deployment

1. **Build the JAR:**
```bash
cd backend
mvn clean package -DskipTests
```

2. **Run the application:**
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

3. **Access:**
- API: `http://localhost:8081/api`
- H2 Console: `http://localhost:8081/h2-console`

### Frontend Deployment

1. **Install dependencies:**
```bash
npm install
```

2. **Development mode:**
```bash
npm run dev
```

3. **Production build:**
```bash
npm run build
npm start
```

4. **Access:**
- App: `http://localhost:3000`

### Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_BASE=http://localhost:8081/api
```

**Backend (application.properties):**
```properties
server.port=8081
spring.datasource.url=jdbc:h2:file:./data/devdb
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your-secret-key-here
```

---

## 🔧 Configuration Files

### Key Configuration Files

1. **`next.config.ts`** - Next.js configuration
2. **`tailwind.config.ts`** - Tailwind CSS configuration
3. **`tsconfig.json`** - TypeScript configuration
4. **`pom.xml`** - Maven dependencies
5. **`application.properties`** - Spring Boot configuration
6. **`package.json`** - Node.js dependencies

---

## 📊 Performance Considerations

### Frontend Optimizations
- Image optimization with Next.js Image
- Code splitting with dynamic imports
- Lazy loading components
- Client-side caching (localStorage)
- React memoization

### Backend Optimizations
- JPA query optimization
- Connection pooling
- Lazy loading relationships
- Indexed database columns
- File-based database for development

---

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Check Java version (must be Java 21+)
   - Verify port 8081 is not in use
   - Check H2 database file permissions

2. **Frontend can't connect to backend:**
   - Verify backend is running
   - Check CORS configuration
   - Verify API_BASE environment variable

3. **Login not working:**
   - Check JWT token in localStorage
   - Verify backend authentication service
   - Check network requests in browser DevTools

4. **Images not uploading:**
   - Verify uploads directory exists
   - Check file permissions
   - Verify endpoint URL is correct

---

## 📝 Future Enhancements

### Planned Features
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Real-time notifications
- [ ] WebSocket for live updates
- [ ] Advanced search and filtering
- [ ] Post categories and tags
- [ ] User following system
- [ ] Post sharing to social media
- [ ] Analytics dashboard
- [ ] Mobile app

---

## 📄 License & Credits

**Project:** Code Scroller  
**Version:** 1.0.0  
**Author:** [Your Name]  
**Repository:** github.com/Kunal-sonawanee/studio

**Technologies Used:**
- Next.js
- Spring Boot
- React
- Tailwind CSS
- shadcn/ui
- H2 Database
- JWT
- Google Genkit

---

## 📞 Support

For issues or questions:
- GitHub Issues: [Repository Issues](https://github.com/Kunal-sonawanee/studio/issues)
- Documentation: This file
- Backend API: See API Documentation section

---

**End of Project Report**

*Last Updated: November 4, 2025*
