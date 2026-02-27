# Code Scroller - UML Diagrams

This document contains PlantUML code for generating various UML diagrams for the Code Scroller project.

## How to Use

1. Copy the PlantUML code below
2. Paste it into [PlantUML Online Editor](https://www.plantuml.com/plantuml/uml/)
3. Or use VS Code with PlantUML extension
4. Generate PNG/SVG images

---

## 1. Entity Relationship Diagram (ER Diagram)

```plantuml
@startuml Code_Scroller_ER_Diagram

!define Table(name,desc) class name as "desc" << (T,#FFAAAA) >>
!define primary_key(x) <b>PK: x</b>
!define foreign_key(x) <color:red>FK: x</color>
!define unique(x) <color:blue>UQ: x</color>

skinparam linetype ortho

entity "User" as user {
  primary_key(id : BIGINT)
  --
  full_name : VARCHAR(255)
  unique(email : VARCHAR(255))
  password : VARCHAR(255)
  photo_url : VARCHAR(255)
  created_at : TIMESTAMP
  is_active : BOOLEAN
}

entity "Role" as role {
  primary_key(id : BIGINT)
  --
  unique(name : VARCHAR(50))
}

entity "User_Roles" as user_roles {
  foreign_key(user_id : BIGINT)
  foreign_key(role_id : BIGINT)
}

entity "Post" as post {
  primary_key(id : BIGINT)
  --
  title : VARCHAR(255)
  content : TEXT
  topic : VARCHAR(100)
  image_url : VARCHAR(500)
  status : VARCHAR(20)
  likes : INT
  dislikes : INT
  author_name : VARCHAR(255)
  author_email : VARCHAR(255)
  author_avatar_url : VARCHAR(500)
  created_at : TIMESTAMP
  foreign_key(user_id : BIGINT)
}

entity "Comment" as comment {
  primary_key(id : BIGINT)
  --
  content : TEXT
  author_name : VARCHAR(255)
  author_email : VARCHAR(255)
  avatar_url : VARCHAR(500)
  created_at : TIMESTAMP
  foreign_key(post_id : BIGINT)
}

user ||--o{ user_roles : "has"
role ||--o{ user_roles : "assigned to"
user ||--o{ post : "creates"
post ||--o{ comment : "has"

@enduml
```

---

## 2. Class Diagram

```plantuml
@startuml Code_Scroller_Class_Diagram

skinparam classAttributeIconSize 0
skinparam linetype ortho

' Model Classes
package "Model Layer" {
  class User {
    - id: Long
    - fullName: String
    - email: String
    - password: String
    - photoUrl: String
    - createdAt: LocalDateTime
    - isActive: boolean
    - roles: Set<Role>
    --
    + getId(): Long
    + setId(id: Long): void
    + getFullName(): String
    + setFullName(name: String): void
    + getEmail(): String
    + setEmail(email: String): void
    + getRoles(): Set<Role>
  }

  class Role {
    - id: Long
    - name: String
    --
    + getId(): Long
    + getName(): String
    + setName(name: String): void
  }

  class Post {
    - id: Long
    - title: String
    - content: String
    - topic: String
    - imageUrl: String
    - status: String
    - likes: Integer
    - dislikes: Integer
    - authorName: String
    - authorEmail: String
    - authorAvatarUrl: String
    - createdAt: LocalDateTime
    - comments: List<Comment>
    --
    + getId(): Long
    + getTitle(): String
    + setTitle(title: String): void
    + getStatus(): String
    + setStatus(status: String): void
    + getLikes(): Integer
    + setLikes(likes: Integer): void
  }

  class Comment {
    - id: Long
    - content: String
    - authorName: String
    - authorEmail: String
    - avatarUrl: String
    - createdAt: LocalDateTime
    - post: Post
    --
    + getId(): Long
    + getContent(): String
    + setContent(content: String): void
    + getPost(): Post
    + setPost(post: Post): void
  }
}

' Repository Layer
package "Repository Layer" {
  interface UserRepository {
    + findByEmail(email: String): Optional<User>
    + existsByEmail(email: String): boolean
    + save(user: User): User
    + findById(id: Long): Optional<User>
  }

  interface RoleRepository {
    + findByName(name: String): Optional<Role>
    + save(role: Role): Role
  }

  interface PostRepository {
    + findAll(): List<Post>
    + findById(id: Long): Optional<Post>
    + findByTitleContainingIgnoreCase(q: String): List<Post>
    + save(post: Post): Post
    + deleteById(id: Long): void
  }

  interface CommentRepository {
    + findByPostId(postId: Long): List<Comment>
    + save(comment: Comment): Comment
    + deleteById(id: Long): void
  }
}

' Service Layer
package "Service Layer" {
  class AuthService {
    - userRepository: UserRepository
    - roleRepository: RoleRepository
    - passwordEncoder: PasswordEncoder
    - jwtUtil: JwtUtil
    --
    + register(request: RegisterRequest): AuthResponse
    + login(request: LoginRequest): AuthResponse
    + createToken(user: User): String
  }

  class PostService {
    - postRepository: PostRepository
    - commentRepository: CommentRepository
    --
    + create(post: Post): Post
    + get(id: Long): Optional<Post>
    + listAll(): List<Post>
    + search(q: String): List<Post>
    + updateStatus(id: Long, status: String): Optional<Post>
    + delete(id: Long): void
    + addCommentToPost(post: Post, ...): Comment
    + toPostDto(post: Post): PostResponseDto
  }

  class UserService {
    - userRepository: UserRepository
    - passwordEncoder: PasswordEncoder
    --
    + getUserById(id: Long): Optional<User>
    + updateProfile(id: Long, request: UpdateProfileRequest): User
    + changePassword(id: Long, request: ChangePasswordRequest): void
  }

  class CommentService {
    - commentRepository: CommentRepository
    --
    + getCommentsByPostId(postId: Long): List<Comment>
    + deleteComment(id: Long): void
  }
}

' Controller Layer
package "Controller Layer" {
  class AuthController {
    - authService: AuthService
    --
    + register(request: RegisterRequest): ResponseEntity
    + login(request: LoginRequest): ResponseEntity
  }

  class PostController {
    - postService: PostService
    --
    + list(q: String, status: String): List<PostResponseDto>
    + get(id: Long): ResponseEntity<PostResponseDto>
    + create(dto: PostResponseDto): ResponseEntity
    + updateStatus(id: Long, body: Map): ResponseEntity
    + delete(id: Long): ResponseEntity<Void>
    + like(id: Long): ResponseEntity
    + dislike(id: Long): ResponseEntity
    + addComment(id: Long, body: Map): ResponseEntity
  }

  class UserController {
    - userService: UserService
    --
    + getUser(id: Long): ResponseEntity<UserDto>
    + updateProfile(id: Long, request: UpdateProfileRequest): ResponseEntity
    + changePassword(id: Long, request: ChangePasswordRequest): ResponseEntity
  }

  class UploadController {
    --
    + uploadFile(file: MultipartFile): ResponseEntity<Map>
  }
}

' Security Layer
package "Security Layer" {
  class JwtUtil {
    - SECRET_KEY: String
    - EXPIRATION_TIME: long
    --
    + generateToken(email: String, role: String): String
    + extractEmail(token: String): String
    + validateToken(token: String): boolean
  }

  class JwtAuthFilter {
    - jwtUtil: JwtUtil
    --
    + doFilterInternal(request, response, filterChain): void
  }

  class SecurityConfig {
    - jwtAuthFilter: JwtAuthFilter
    --
    + securityFilterChain(http: HttpSecurity): SecurityFilterChain
    + passwordEncoder(): PasswordEncoder
    + corsConfigurationSource(): CorsConfigurationSource
  }
}

' Relationships
User "1" *-- "many" Role : has
User "1" -- "many" Post : creates
Post "1" *-- "many" Comment : contains

UserRepository ..> User : manages
RoleRepository ..> Role : manages
PostRepository ..> Post : manages
CommentRepository ..> Comment : manages

AuthService --> UserRepository : uses
AuthService --> RoleRepository : uses
AuthService --> JwtUtil : uses
PostService --> PostRepository : uses
PostService --> CommentRepository : uses
UserService --> UserRepository : uses
CommentService --> CommentRepository : uses

AuthController --> AuthService : uses
PostController --> PostService : uses
UserController --> UserService : uses

SecurityConfig --> JwtAuthFilter : configures
JwtAuthFilter --> JwtUtil : uses

@enduml
```

---

## 3. Use Case Diagram

```plantuml
@startuml Code_Scroller_Use_Case_Diagram

left to right direction
skinparam packageStyle rectangle

actor "Guest User" as guest
actor "Registered User" as user
actor "Admin" as admin

rectangle "Code Scroller System" {
  ' Guest Use Cases
  usecase "View Feed" as UC1
  usecase "Register Account" as UC2
  usecase "Login" as UC3
  
  ' User Use Cases
  usecase "Create Post" as UC4
  usecase "Like/Dislike Post" as UC5
  usecase "Comment on Post" as UC6
  usecase "Delete Own Comment" as UC7
  usecase "Save Post" as UC8
  usecase "View Saved Posts" as UC9
  usecase "Edit Profile" as UC10
  usecase "Change Password" as UC11
  usecase "Upload Avatar" as UC12
  usecase "Use AI Grammar Check" as UC13
  usecase "Use AI Simplify" as UC14
  usecase "Toggle Theme" as UC15
  
  ' Admin Use Cases
  usecase "Approve Post" as UC16
  usecase "Reject Post" as UC17
  usecase "Delete Any Post" as UC18
  usecase "View All Users" as UC19
  usecase "Delete User" as UC20
  usecase "View All Comments" as UC21
  usecase "Delete Any Comment" as UC22
  usecase "View Dashboard Stats" as UC23
}

' Guest relationships
guest --> UC1
guest --> UC2
guest --> UC3

' User relationships (inherits from guest)
user --|> guest
user --> UC4
user --> UC5
user --> UC6
user --> UC7
user --> UC8
user --> UC9
user --> UC10
user --> UC11
user --> UC12
user --> UC13
user --> UC14
user --> UC15

' Admin relationships (inherits from user)
admin --|> user
admin --> UC16
admin --> UC17
admin --> UC18
admin --> UC19
admin --> UC20
admin --> UC21
admin --> UC22
admin --> UC23

' Include relationships
UC4 ..> UC12 : <<include>>
UC10 ..> UC12 : <<include>>

' Extend relationships
UC4 ..> UC13 : <<extend>>
UC4 ..> UC14 : <<extend>>

@enduml
```

---

## 4. Sequence Diagram - User Registration and Login

```plantuml
@startuml Code_Scroller_Registration_Login_Sequence

actor User
participant "Frontend\n(Next.js)" as Frontend
participant "AuthController" as Controller
participant "AuthService" as Service
participant "UserRepository" as Repo
participant "JwtUtil" as JWT
participant "Database\n(H2)" as DB

== User Registration ==
User -> Frontend: Enter registration details\n(name, email, password)
activate Frontend

Frontend -> Controller: POST /api/auth/register\n{fullName, email, password}
activate Controller

Controller -> Service: register(request)
activate Service

Service -> Repo: existsByEmail(email)
activate Repo
Repo -> DB: SELECT * FROM users\nWHERE email = ?
activate DB
DB --> Repo: false
deactivate DB
Repo --> Service: false
deactivate Repo

Service -> Service: Hash password (BCrypt)

Service -> Repo: save(user)
activate Repo
Repo -> DB: INSERT INTO users\n(full_name, email, password_hash, ...)
activate DB
DB --> Repo: User created
deactivate DB
Repo --> Service: User entity
deactivate Repo

Service -> Repo: findByName("USER")
activate Repo
Repo -> DB: SELECT * FROM roles\nWHERE name = 'USER'
activate DB
DB --> Repo: Role entity
deactivate DB
Repo --> Service: Role entity
deactivate Repo

Service -> Service: Assign USER role

Service -> JWT: generateToken(email, "user")
activate JWT
JWT --> Service: JWT token
deactivate JWT

Service --> Controller: AuthResponse\n{token, user}
deactivate Service

Controller --> Frontend: 200 OK\n{token, user}
deactivate Controller

Frontend -> Frontend: Store token & user\nin localStorage

Frontend --> User: Registration successful\nRedirect to home
deactivate Frontend

== User Login ==
User -> Frontend: Enter login credentials\n(email, password)
activate Frontend

Frontend -> Controller: POST /api/auth/login\n{email, password}
activate Controller

Controller -> Service: login(request)
activate Service

Service -> Repo: findByEmail(email)
activate Repo
Repo -> DB: SELECT * FROM users\nWHERE email = ?
activate DB
DB --> Repo: User entity
deactivate DB
Repo --> Service: Optional<User>
deactivate Repo

Service -> Service: Verify password\n(BCrypt.matches)

alt Password matches
  Service -> JWT: generateToken(email, role)
  activate JWT
  JWT --> Service: JWT token
  deactivate JWT
  
  Service --> Controller: AuthResponse\n{token, user}
  Controller --> Frontend: 200 OK\n{token, user}
  
  Frontend -> Frontend: Store token & user\nin localStorage
  
  Frontend --> User: Login successful\nRedirect to home
else Password incorrect
  Service --> Controller: Exception\n"Invalid credentials"
  Controller --> Frontend: 401 Unauthorized
  Frontend --> User: Show error message
end

deactivate Service
deactivate Controller
deactivate Frontend

@enduml
```

---

## 5. Sequence Diagram - Create and Approve Post

```plantuml
@startuml Code_Scroller_Post_Creation_Approval_Sequence

actor User
actor Admin
participant "Frontend" as FE
participant "UploadController" as Upload
participant "PostController" as PostCtrl
participant "PostService" as PostSvc
participant "PostRepository" as PostRepo
participant "Database" as DB

== Create Post (User) ==
User -> FE: Fill post form\n(title, content, topic, image)
activate FE

FE -> Upload: POST /api/uploads\nMultipartFile
activate Upload
Upload -> Upload: Generate UUID filename
Upload -> Upload: Save file to\n/backend/uploads/
Upload --> FE: 200 OK\n{url: "http://localhost:8081/uploads/..."}
deactivate Upload

FE -> PostCtrl: POST /api/posts\n{title, content, topic, imageUrl, author}
activate PostCtrl

PostCtrl -> PostSvc: create(post)
activate PostSvc

PostSvc -> PostSvc: Set status = "pending"

PostSvc -> PostRepo: save(post)
activate PostRepo
PostRepo -> DB: INSERT INTO posts\n(title, content, status='pending', ...)
activate DB
DB --> PostRepo: Post created
deactivate DB
PostRepo --> PostSvc: Post entity
deactivate PostRepo

PostSvc --> PostCtrl: Post entity
deactivate PostSvc

PostCtrl --> FE: 201 Created\nPostResponseDto
deactivate PostCtrl

FE --> User: Success notification\n"Post submitted for approval"
deactivate FE

== Admin Approval ==
Admin -> FE: Navigate to Admin Panel
activate FE

FE -> PostCtrl: GET /api/posts?status=pending
activate PostCtrl

PostCtrl -> PostSvc: listAll()
activate PostSvc
PostSvc -> PostRepo: findAll()
activate PostRepo
PostRepo -> DB: SELECT * FROM posts\nWHERE status = 'pending'
activate DB
DB --> PostRepo: List of pending posts
deactivate DB
PostRepo --> PostSvc: List<Post>
deactivate PostRepo
PostSvc --> PostCtrl: List<Post>
deactivate PostSvc

PostCtrl --> FE: 200 OK\nList<PostResponseDto>
deactivate PostCtrl

FE --> Admin: Display pending posts
deactivate FE

Admin -> FE: Click "Approve" on post
activate FE

FE -> PostCtrl: PUT /api/posts/{id}/status\n{status: "approved"}
activate PostCtrl

PostCtrl -> PostSvc: updateStatus(id, "approved")
activate PostSvc

PostSvc -> PostRepo: findById(id)
activate PostRepo
PostRepo -> DB: SELECT * FROM posts\nWHERE id = ?
activate DB
DB --> PostRepo: Post entity
deactivate DB
PostRepo --> PostSvc: Optional<Post>
deactivate PostRepo

PostSvc -> PostSvc: Set post.status = "approved"

PostSvc -> PostRepo: save(post)
activate PostRepo
PostRepo -> DB: UPDATE posts\nSET status = 'approved'\nWHERE id = ?
activate DB
DB --> PostRepo: Updated
deactivate DB
PostRepo --> PostSvc: Post entity
deactivate PostRepo

PostSvc --> PostCtrl: Post entity
deactivate PostSvc

PostCtrl --> FE: 200 OK\nPostResponseDto
deactivate PostCtrl

FE --> Admin: Success notification\n"Post approved"
deactivate FE

@enduml
```

---

## 6. Activity Diagram - User Post Creation Flow

```plantuml
@startuml Code_Scroller_Post_Creation_Activity

start

:User navigates to\nCreate Post page;

:Fill in post details;
note right
  - Title
  - Content
  - Select Topic
end note

if (Has image?) then (yes)
  :Click "Select Image";
  :Choose image file;
  :Upload image to server;
  
  if (Upload successful?) then (yes)
    :Store image URL;
  else (no)
    :Show error message;
    stop
  endif
else (no)
  :Continue without image;
endif

if (Use AI Grammar Check?) then (yes)
  :Click "Check Grammar";
  :AI analyzes content;
  :Display suggestions;
  :User reviews corrections;
endif

if (Use AI Simplify?) then (yes)
  :Click "Simplify Content";
  :AI simplifies text;
  :Display simplified version;
  :User accepts/rejects;
endif

:Click "Publish Post";

:Validate form inputs;

if (All fields valid?) then (yes)
  :Send POST request to backend;
  
  :Backend creates post\nwith status = "pending";
  
  :Save post to database;
  
  :Return success response;
  
  :Show success toast\n"Post submitted for approval";
  
  :Redirect to home page;
  
  stop
else (no)
  :Show validation errors;
  :Return to form;
  
  stop
endif

@enduml
```

---

## 7. Activity Diagram - Admin Post Moderation

```plantuml
@startuml Code_Scroller_Admin_Moderation_Activity

start

:Admin logs in;

:Navigate to Admin Panel;

:View Dashboard Statistics;
note right
  - Total Posts
  - Pending Approvals
  - Total Users
  - Total Comments
end note

:Click "Post Management" tab;

partition "Review Pending Posts" {
  :Fetch all pending posts;
  
  :Display posts in grid;
  
  repeat
    :Select a post to review;
    
    :Read post content;
    :View post image;
    :Check topic and author;
    
    if (Post meets guidelines?) then (yes)
      :Click "Approve" button;
      
      :Confirm approval;
      
      if (Confirmed?) then (yes)
        :Update post status\nto "approved";
        
        :Save to database;
        
        :Show success toast\n"Post approved";
        
        :Post now visible\nin public feed;
      else (no)
        :Cancel action;
      endif
    else (no)
      :Click "Reject" button;
      
      :Show confirmation dialog;
      
      if (Confirmed?) then (yes)
        :Delete post permanently;
        
        :Remove from database;
        
        :Show toast\n"Post rejected";
      else (no)
        :Cancel action;
      endif
    endif
    
    :Refresh post lists;
    
  repeat while (More pending posts?) is (yes)
  -> no;
}

:Switch to "Approved" tab;

partition "Manage Approved Posts" {
  :View all approved posts;
  
  if (Need to delete any?) then (yes)
    :Click "Reject" on post;
    
    :Confirm deletion;
    
    :Delete post;
    
    :Show confirmation;
  endif
}

:Review complete;

stop

@enduml
```

---

## 8. Data Flow Diagram (DFD) - Level 0 (Context Diagram)

```plantuml
@startuml Code_Scroller_DFD_Level_0

!define RECTANGLE rectangle
!define ENTITY actor
!define PROCESS circle

skinparam backgroundcolor transparent

ENTITY "Guest User" as guest
ENTITY "Registered User" as user
ENTITY "Admin" as admin

PROCESS "Code Scroller\nSystem" as system

guest --> system : View posts, Register, Login
system --> guest : Post feed, Registration confirmation

user --> system : Create posts, Comments,\nLikes, Profile updates
system --> user : Post status, Comment confirmations,\nUpdated profile

admin --> system : Approve/Reject posts,\nManage users, Moderate comments
system --> admin : Dashboard stats,\nUser/Post/Comment lists

@enduml
```

---

## 9. Data Flow Diagram - Level 1

```plantuml
@startuml Code_Scroller_DFD_Level_1

!define PROCESS circle
!define DATASTORE database

actor "User" as user
actor "Admin" as admin

PROCESS "1.0\nAuthentication" as auth
PROCESS "2.0\nPost Management" as posts
PROCESS "3.0\nComment System" as comments
PROCESS "4.0\nUser Profile" as profile
PROCESS "5.0\nAdmin Panel" as adminpanel
PROCESS "6.0\nFile Upload" as upload

DATASTORE "D1: Users" as db_users
DATASTORE "D2: Posts" as db_posts
DATASTORE "D3: Comments" as db_comments
DATASTORE "D4: Roles" as db_roles

' User to Processes
user --> auth : Login/Register credentials
user --> posts : Post data, Likes/Dislikes
user --> comments : Comment text
user --> profile : Profile updates, Password change
user --> upload : Image files

' Admin to Processes
admin --> adminpanel : Moderation actions
admin --> posts : Approve/Reject decisions

' Processes to User
auth --> user : JWT Token, User info
posts --> user : Post list, Post status
comments --> user : Comment list
profile --> user : Updated profile
upload --> user : Image URL

' Processes to Admin
adminpanel --> admin : Dashboard stats
posts --> admin : Pending posts list

' Processes to Datastores
auth --> db_users : Create/Verify user
auth --> db_roles : Assign role

posts --> db_posts : Create/Update/Delete post
posts <-- db_posts : Read posts

comments --> db_comments : Create/Delete comment
comments <-- db_comments : Read comments

profile --> db_users : Update user info
profile <-- db_users : Read user data

adminpanel <-- db_users : Read all users
adminpanel <-- db_posts : Read all posts
adminpanel <-- db_comments : Read all comments

upload --> db_posts : Store image URL

@enduml
```

---

## 10. Component Diagram

```plantuml
@startuml Code_Scroller_Component_Diagram

skinparam componentStyle rectangle

package "Frontend (Next.js 15)" {
  component "Pages" as pages {
    component [Home Page]
    component [Login/Register]
    component [Create Post]
    component [Profile]
    component [Admin Panel]
  }
  
  component "Components" as components {
    component [Post Card]
    component [Comment Section]
    component [Post Feed]
    component [App Layout]
  }
  
  component "State Management" as state {
    component [Auth Context]
    component [Saved Posts Hook]
  }
  
  component "API Layer" as api {
    component [Auth API]
    component [Posts API]
    component [User API]
  }
  
  component "UI Library" as ui {
    component [shadcn/ui]
  }
}

package "Backend (Spring Boot 3.2)" {
  component "Controllers" as controllers {
    component [Auth Controller]
    component [Post Controller]
    component [User Controller]
    component [Upload Controller]
  }
  
  component "Services" as services {
    component [Auth Service]
    component [Post Service]
    component [User Service]
  }
  
  component "Security" as security {
    component [JWT Filter]
    component [JWT Util]
    component [Security Config]
  }
  
  component "Repositories" as repos {
    component [User Repository]
    component [Post Repository]
    component [Comment Repository]
  }
  
  component "Models" as models {
    component [User]
    component [Post]
    component [Comment]
    component [Role]
  }
}

package "AI Service (Node.js)" {
  component [Genkit Flows]
  component [Grammar Check]
  component [Simplify Text]
  component [Post Assist]
}

database "H2 Database" {
  component [Users Table]
  component [Posts Table]
  component [Comments Table]
  component [Roles Table]
}

' Frontend connections
pages --> components : uses
pages --> state : reads/writes
pages --> api : calls
components --> ui : uses

api --> controllers : HTTP REST

' Backend connections
controllers --> services : calls
controllers --> security : protected by
services --> repos : uses
repos --> models : manages
repos --> "H2 Database" : persists

security --> services : validates

' AI Service connections
pages --> "AI Service" : calls
"AI Service" --> [Genkit Flows] : executes

@enduml
```

---

## 11. Deployment Diagram

```plantuml
@startuml Code_Scroller_Deployment_Diagram

node "Client Browser" {
  component [Next.js Frontend\nPort: 3000] as frontend
  component [Local Storage] as localStorage
}

node "Application Server" {
  component [Spring Boot Backend\nPort: 8081] as backend
  component [H2 Database\nFile: ./data/devdb] as h2db
  component [File System\n/uploads/] as filesystem
}

node "AI Service Server" {
  component [Node.js AI Service\nPort: 9002] as aiservice
  component [Google Genkit] as genkit
}

cloud "External Services" {
  component [Google AI\n(Gemini)] as googleai
}

frontend --> backend : HTTP/REST\n(JSON)
frontend --> aiservice : HTTP\n(AI Requests)
frontend --> localStorage : Read/Write\n(Token, Saved Posts)

backend --> h2db : JDBC\n(SQL Queries)
backend --> filesystem : File I/O\n(Image Upload/Serve)

aiservice --> genkit : SDK Calls
genkit --> googleai : API Calls\n(AI Processing)

note right of frontend
  Development: localhost:3000
  Production: Vercel/Similar
end note

note right of backend
  Development: localhost:8081
  File-based H2 Database
  Embedded Tomcat
end note

note right of aiservice
  Development: localhost:9002
  AI-powered features
end note

@enduml
```

---

## 12. State Diagram - Post Lifecycle

```plantuml
@startuml Code_Scroller_Post_State_Diagram

[*] --> Draft : User starts\ncreating post

Draft --> Uploading : Add image

Uploading --> Draft : Upload complete

Draft --> Submitting : Click Publish

Submitting --> Pending : POST /api/posts\nstatus = 'pending'

Pending --> Approved : Admin approves\nPUT /posts/{id}/status

Pending --> Rejected : Admin rejects\nDELETE /posts/{id}

Approved --> Published : Visible in\npublic feed

Published --> Approved : User likes/\ndislikes/comments

Approved --> Deleted : Admin deletes\nDELETE /posts/{id}

Rejected --> [*]
Deleted --> [*]

note right of Pending
  Waiting for admin review
  Not visible to public
end note

note right of Approved
  Visible to all users
  Can receive engagement
end note

@enduml
```

---

## 13. State Diagram - User Authentication State

```plantuml
@startuml Code_Scroller_Auth_State_Diagram

[*] --> Guest : Open application

Guest --> Registering : Click Register

Registering --> Guest : Cancel

Registering --> Authenticated : Registration\nsuccess

Guest --> LoggingIn : Click Login

LoggingIn --> Guest : Cancel/\nWrong credentials

LoggingIn --> Authenticated : Login success\nJWT token received

Authenticated --> ViewingProfile : View Profile

ViewingProfile --> EditingProfile : Click Edit

EditingProfile --> ViewingProfile : Save changes

Authenticated --> CreatingPost : Create Post

CreatingPost --> Authenticated : Post submitted

Authenticated --> Guest : Logout\nClear token

note right of Authenticated
  JWT token stored
  User data in context
  Can access protected routes
end note

note right of Guest
  Limited access
  Can only view feed
  No create/comment
end note

@enduml
```

---

## How to Generate Diagrams

### Method 1: Online Editor
1. Go to https://www.plantuml.com/plantuml/uml/
2. Copy any diagram code above
3. Paste into the editor
4. Download as PNG, SVG, or PDF

### Method 2: VS Code Extension
1. Install "PlantUML" extension in VS Code
2. Create a `.puml` file with the diagram code
3. Press `Alt+D` to preview
4. Right-click → "Export Current Diagram" to save

### Method 3: Command Line
```bash
# Install PlantUML
npm install -g node-plantuml

# Generate PNG
puml generate diagram.puml -o output.png
```

---

## Diagram Descriptions

1. **ER Diagram**: Shows database schema with tables, columns, and relationships
2. **Class Diagram**: Complete class structure including all layers (Model, Repository, Service, Controller, Security)
3. **Use Case Diagram**: User roles and their available actions
4. **Sequence Diagrams**: Detailed interaction flows for registration, login, and post management
5. **Activity Diagrams**: Process flows for post creation and admin moderation
6. **Data Flow Diagrams**: System data movement at context and detail levels
7. **Component Diagram**: System architecture with frontend, backend, and AI service components
8. **Deployment Diagram**: Physical deployment architecture
9. **State Diagrams**: Lifecycle states for posts and user authentication

---

**Generated for Code Scroller Project**  
*Last Updated: November 4, 2025*
