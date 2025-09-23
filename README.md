# 🚀 CloudBlitz - Enquiry Management System

A modern, fullstack enquiry management system built with React + Vite (Frontend) and Node.js + Express + MongoDB (Backend), leveraging AI-powered development tools for optimal efficiency.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Workflow](#development-workflow)
- [API Documentation](#api-documentation)
- [Docker Setup](#docker-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Staff, User)
- Protected routes and API endpoints

### 📝 Enquiry Management
- CRUD operations for enquiries
- Status tracking (New, In Progress, Closed)
- Assignment to staff members
- Advanced filtering and search
- Soft delete functionality

### 👥 User Management (Admin Only)
- User creation and management
- Role assignment
- Staff assignment to enquiries

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Component library with Radix UI
- Toast notifications
- Modal dialogs
- Loading states and error handling

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless component library
- **Lucide React** - Icon library
- **React Router DOM** - Client-side routing
- **Class Variance Authority** - Component variants

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **Docker** - Containerization
- **Jest** - Testing framework
- **Supertest** - API testing

## 📁 Project Structure

```
cloudblitz/
├── Client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── routes/        # Route configurations
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
│
├── Server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # Express routes
│   │   ├── middlewares/   # Custom middleware
│   │   ├── lib/           # Utility libraries
│   │   └── app.ts         # Express application setup
│   └── package.json
│
├── docker-compose.yml     # Docker services configuration
├── .gitignore            # Git ignore rules
├── .lintstagedrc         # Lint-staged configuration
├── LICENSE               # MIT License
└── README.md             # Project documentation
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Docker** (optional, for containerized development)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/dhiraj-gede/cloudblitz.git
cd cloudblitz
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd Server
npm install
```

#### Frontend Setup
```bash
cd ../Client
npm install
```

### 3. Environment Configuration

#### Backend Environment (.env)
```bash
cd ../Server
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cloudblitz
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

#### Frontend Environment (.env)
```bash
cd ../Client
cp .env.example .env
```

Edit the `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=CloudBlitz
```

### 4. Start Development Servers

#### Start Backend (Terminal 1)
```bash
cd Server
npm run dev
```

#### Start Frontend (Terminal 2)
```bash
cd Client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔄 Development Workflow

### Branch Strategy (GitFlow)
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `hotfix/*` - Production hotfixes
- `release/*` - Release preparation

### Code Quality
- **Pre-commit hooks** ensure code quality
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/enquiry-management

# Make changes and commit
git add .
git commit -m "feat: add enquiry CRUD operations"

# Push to remote
git push origin feature/enquiry-management

# Create pull request to develop branch
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Enquiry Endpoints
- `GET /api/enquiries` - Get all enquiries (with filters)
- `POST /api/enquiries` - Create new enquiry
- `GET /api/enquiries/:id` - Get enquiry by ID
- `PUT /api/enquiries/:id` - Update enquiry
- `DELETE /api/enquiries/:id` - Soft delete enquiry

### User Endpoints (Admin Only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🐳 Docker Setup

### Development with Docker Compose
```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker Build
```bash
# Build backend image
cd Server
docker build -t cloudblitz-backend .

# Build frontend image
cd ../Client
docker build -t cloudblitz-frontend .
```

## 🚀 Deployment

### Environment Setup
1. **Backend**: Deploy on cloud platforms (AWS, DigitalOcean, etc.)
2. **Frontend**: Deploy on Vercel, Netlify, or cloud platforms
3. **Database**: MongoDB Atlas or self-hosted MongoDB

### Production Environment Variables
- Set all environment variables for production
- Configure CORS origins
- Set up SSL certificates
- Configure domain names

## 🧪 Testing

### Backend Testing
The backend includes a comprehensive test suite using Jest and Supertest.

```bash
cd Server
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

**Current Test Coverage:**
- ✅ API Health Check endpoints
- ✅ Express server setup and configuration
- ✅ Error handling for non-existent routes
- ✅ JSON response validation

### Frontend Testing
```bash
cd Client
npm run test            # Run all tests
npm run test:coverage   # Coverage report
```

### Test Structure
```
Server/src/__tests__/
├── setup.ts           # Test environment setup
└── app.test.ts        # API endpoint tests
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with AI-powered development tools
- Thanks to the open-source community
- Inspired by modern web development practices

---

**⚡ Happy Coding with AI! ⚡**