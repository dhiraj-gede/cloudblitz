# 🏗️ CloudBlitz System Architecture

## 📊 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Client  │◄──►│  Express API    │◄──►│   MongoDB       │
│   (Port 5173)   │    │  (Port 5000)    │    │   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
    ┌────▼────┐              ┌────▼────┐              ┌────▼────┐
    │ Vite    │              │ Node.js │              │ Mongoose│
    │ Build   │              │ Runtime │              │ ODM     │
    └─────────┘              └─────────┘              └─────────┘
```

## 🔄 Request Flow

### 1. Authentication Flow
```
Client → POST /api/auth/login
       → Validate credentials
       → Generate JWT token
       → Return token + user data
       → Store token in localStorage
       → Include token in subsequent requests
```

### 2. Enquiry Management Flow
```
Client → GET /api/enquiries
       → Authenticate JWT token
       → Check user permissions
       → Query MongoDB
       → Return filtered results
       → Display in React components
```

## 🗂️ Data Models

### User Model
```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'staff' | 'user';
  createdAt: Date;
  updatedAt: Date;
}
```

### Enquiry Model
```typescript
interface Enquiry {
  _id: ObjectId;
  title: string;
  description: string;
  status: 'new' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: ObjectId; // Reference to User
  createdBy: ObjectId;   // Reference to User
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;      // Soft delete
}
```

## 🛡️ Security Architecture

### Authentication & Authorization
```
┌─────────────────┐
│   JWT Token     │
│   ┌─────────────┤
│   │ Header      │ → Algorithm & Token Type
│   ├─────────────┤
│   │ Payload     │ → User ID, Role, Expiration
│   ├─────────────┤
│   │ Signature   │ → Secret Key Verification
│   └─────────────┘
```

### Role-Based Access Control (RBAC)
```
Admin    → Full access to all resources
  ├── User management (CRUD)
  ├── Enquiry management (CRUD)
  └── System settings

Staff    → Limited access to enquiries
  ├── Enquiry management (assigned only)
  ├── Status updates
  └── View user profiles

User     → Basic access
  ├── Create enquiries
  ├── View own enquiries
  └── Update profile
```

## 🏗️ Frontend Architecture

### Component Hierarchy
```
App.tsx
├── Router
├── Layout
│   ├── Header
│   │   ├── Navigation
│   │   ├── UserMenu
│   │   └── Notifications
│   ├── Sidebar
│   │   ├── MainMenu
│   │   └── QuickActions
│   └── Footer
└── Pages
    ├── Dashboard
    ├── Enquiries
    │   ├── EnquiryList
    │   ├── EnquiryForm
    │   └── EnquiryDetails
    ├── Users (Admin)
    └── Profile
```

### State Management
```
Context API
├── AuthContext     → User authentication state
├── ThemeContext    → UI theme preferences
└── NotificationContext → Toast notifications

Local State (useState)
├── Form data
├── Loading states
└── Component-specific data

Server State (Custom hooks)
├── API data caching
├── Optimistic updates
└── Error handling
```

## 🗄️ Backend Architecture

### Layered Architecture
```
┌─────────────────────────────────────────┐
│                Routes                   │ ← HTTP endpoints
├─────────────────────────────────────────┤
│              Controllers                │ ← Business logic
├─────────────────────────────────────────┤
│               Services                  │ ← Data processing
├─────────────────────────────────────────┤
│                Models                   │ ← Data access layer
├─────────────────────────────────────────┤
│               Database                  │ ← MongoDB storage
└─────────────────────────────────────────┘
```

-------------------+        +-------------------+        +-------------------+
### Middleware Stack
```
Request Pipeline:
-------------------+        +-------------------+        +-------------------+
1. CORS middleware       → Cross-origin handling
2. Body parser          → JSON parsing
3. Authentication       → JWT verification
4. Authorization        → Role checking
5. Validation           → Input validation
6. Route handler        → Business logic
7. Error handling       → Error responses
8. Logging              → Request logging
```
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
### Production Environment
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Vercel    │    │   Cloud Server  │    │   MongoDB       │
│   Static Files  │    │   API Server    │    │   Atlas         │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Performance Considerations

### Frontend Optimization
- **Code splitting** with React.lazy()
- **Lazy loading** for routes and components
- **Memoization** with React.memo() and useMemo()
- **Virtual scrolling** for large lists
- **Image optimization** with proper formats
- **Bundle analysis** with webpack-bundle-analyzer

### Backend Optimization
- **Database indexing** on frequently queried fields
- **Query optimization** with MongoDB aggregation
- **Caching** with Redis for session data
- **Rate limiting** to prevent abuse
- **Pagination** for large datasets
- **Connection pooling** for database connections

### Database Schema Optimization
```javascript
// Indexing strategy
db.users.createIndex({ email: 1 }, { unique: true });
db.enquiries.createIndex({ status: 1, createdAt: -1 });
db.enquiries.createIndex({ assignedTo: 1 });
db.enquiries.createIndex({ createdBy: 1 });

// Compound indexes for complex queries
db.enquiries.createIndex({ 
  status: 1, 
  priority: 1, 
  createdAt: -1 
});
```

## 🔄 CI/CD Pipeline

### Development Workflow
```
1. Developer commits code
2. Pre-commit hooks run (lint, format)
3. Push to feature branch
4. Automated tests run
5. Code review & approval
6. Merge to develop branch
7. Integration tests run
8. Deploy to staging environment
9. Manual testing & approval
10. Merge to main branch
11. Deploy to production
```

### Pipeline Tools
- **GitHub Actions** for CI/CD automation
- **ESLint + Prettier** for code quality
- **Jest + Supertest** for automated testing
- **Docker** for containerization
- **Husky** for git hooks
- **Semantic versioning** for releases

## 📈 Monitoring & Analytics

### Application Monitoring
- **Health checks** for API endpoints
- **Error tracking** with structured logging
- **Performance metrics** (response times, throughput)
- **Database monitoring** (query performance, connections)
- **User analytics** (page views, user interactions)

### Logging Strategy
```typescript
// Structured logging format
{
  timestamp: "2024-01-01T00:00:00Z",
  level: "info",
  service: "cloudblitz-api",
  userId: "user_123",
  action: "create_enquiry",
  metadata: {
    enquiryId: "enq_456",
    duration: 150
  }
}
```

---

This architecture provides a solid foundation for a scalable, maintainable enquiry management system with modern development practices and AI-powered development tools integration.