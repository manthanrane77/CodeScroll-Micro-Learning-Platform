# Studio - AI-Powered Social Blogging Platform

A full-stack social blogging platform with AI-powered writing assistance, built with Next.js, Spring Boot, and Google Genkit.

## ✨ Features

### Core Features
- 📝 **Post Creation** with rich content and image uploads
- 🤖 **AI Writing Assistant** - Grammar checking, content simplification, and post generation
- 👍 **Like/Dislike System** - React to posts
- 💬 **Commenting System** - Engage with content
- 🔖 **Save Posts** - Bookmark your favorite content
- 👤 **User Profiles** - View your posts and pending submissions
- ⚙️ **Profile Editing** - Update avatar, name, and password

### Admin Features
- 🛡️ **Admin Dashboard** - Manage all platform content
- ✅ **Post Approval Workflow** - Review and approve/reject submissions
- 📊 **Dynamic Statistics** - Real-time counts of posts, users, and comments
- 👥 **User Management** - View and manage user accounts

### Authentication & Security
- 🔐 **JWT Authentication** - Secure token-based auth
- 🔑 **Role-Based Access Control** - Admin and user roles
- 🛡️ **Protected Routes** - Secure admin and user areas
- 🔒 **Password Encryption** - BCrypt hashing

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.3.3 with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **AI Integration:** Google Genkit
- **State Management:** React Context API

### Backend
- **Framework:** Spring Boot 3.2.12
- **Language:** Java 21
- **Build Tool:** Maven
- **Database:** H2 (file-based) / MySQL
- **Authentication:** JWT with HS256
- **Security:** Spring Security, BCrypt

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **Java** 21+ (JDK 23 recommended)
- **Maven** 3.8+

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Set JAVA_HOME (if needed):
```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-23'
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

3. Build the project:
```bash
mvn clean package -DskipTests
```

4. Run the backend:
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Backend will start on `http://localhost:8081`

### Frontend Setup

1. Navigate to project root:
```bash
cd d:\studio
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api
```

4. Run development server:
```bash
npm run dev
```

Frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
studio/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/example/backend/
│   │       ├── config/     # Security, CORS, Data initialization
│   │       ├── controller/ # REST API endpoints
│   │       ├── dto/        # Data Transfer Objects
│   │       ├── model/      # JPA entities
│   │       ├── repository/ # Database repositories
│   │       └── service/    # Business logic
│   └── src/main/resources/
│       ├── application.properties
│       └── db/migration/   # Database migrations
├── src/
│   ├── app/                # Next.js pages
│   │   ├── admin/         # Admin dashboard
│   │   ├── create/        # Post creation
│   │   ├── login/         # Authentication
│   │   ├── profile/       # User profiles
│   │   └── saved/         # Saved posts
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── ...
│   ├── ai/                 # AI Genkit flows
│   │   └── flows/         # Grammar check, simplify, generate
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utilities, types, API calls
└── ai-service/             # Node.js AI service
```

## 🔑 Default Access

The application no longer creates demo accounts. You must:
1. Register a new account at `/register`
2. To make an admin, manually update the database

### Creating an Admin User

Access H2 Console at `http://localhost:8081/h2-console`:
- JDBC URL: `jdbc:h2:file:./data/devdb`
- Username: `sa`
- Password: (leave empty)

Run SQL:
```sql
-- Find your user ID
SELECT * FROM users WHERE email = 'your@email.com';

-- Add ADMIN role (replace 1 with your user_id)
INSERT INTO user_roles (user_id, role_id) VALUES (1, 2);
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Posts
- `GET /api/posts?status=approved` - Get approved posts
- `GET /api/posts?status=pending` - Get pending posts
- `GET /api/posts/{id}` - Get single post
- `POST /api/posts` - Create new post
- `PATCH /api/posts/{id}/status` - Update post status (admin)
- `DELETE /api/posts/{id}` - Delete post (admin)

### Users
- `GET /api/user/{id}` - Get user profile
- `PUT /api/user/{id}/profile` - Update profile
- `PUT /api/user/{id}/password` - Change password

### Uploads
- `POST /api/upload` - Upload image

## 🤖 AI Features

The platform integrates Google Genkit for AI-powered writing assistance:

1. **Grammar Checker** - Real-time grammar and spelling corrections
2. **Content Simplifier** - Simplify complex paragraphs
3. **Post Generator** - AI-generated content suggestions

## 🎨 UI Components

Built with shadcn/ui components:
- Forms with validation
- Modals and dialogs
- Cards and layouts
- Toast notifications
- Tabs and navigation
- Avatars and badges

## 📝 Database Schema

### Users Table
- id (PK)
- email (unique)
- password_hash
- full_name
- photo_url
- is_active
- created_at

### Posts Table
- id (PK)
- title
- content
- topic
- image_url
- status (pending/approved)
- likes
- dislikes
- author_id (FK)
- created_at

### Comments Table
- id (PK)
- content
- post_id (FK)
- author_id (FK)
- created_at

### Roles & User_Roles
- Roles: USER, ADMIN
- Many-to-many relationship with users

## 🔧 Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:

```properties
# Server port
server.port=8081

# Database (H2)
spring.datasource.url=jdbc:h2:file:./data/devdb
spring.jpa.hibernate.ddl-auto=update

# JWT Configuration
jwt.secret=your-256-bit-secret-key-here
jwt.expiration-ms=86400000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Frontend Configuration
Edit `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api
```

## 🚢 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `NEXT_PUBLIC_API_BASE_URL`
4. Deploy

### Backend (Railway/Render)
1. Create `Dockerfile` (if needed)
2. Push to GitHub
3. Connect to Railway/Render
4. Configure environment variables
5. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [shadcn/ui](https://ui.shadcn.com/)
- [Google Genkit](https://firebase.google.com/docs/genkit)
- [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ using Next.js and Spring Boot
