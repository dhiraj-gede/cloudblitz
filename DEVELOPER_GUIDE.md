# CloudBlitz Developer Guide

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/dhiraj-gede/cloudblitz.git
   cd cloudblitz
   ```

2. **Install Dependencies**
   - Backend:
     ```bash
     cd Server
     npm install
     ```
   - Frontend:
     ```bash
     cd ../Client
     npm install
     ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` in both `Server` and `Client` folders.
   - Edit values as needed (see README for details).

4. **Start Development Servers**
   - Backend:
     ```bash
     cd Server
     npm run dev
     ```
   - Frontend:
     ```bash
     cd Client
     npm run dev
     ```
   - Access frontend at [http://localhost:5173](http://localhost:5173)
   - Access backend at [http://localhost:5000](http://localhost:5000)
   - API docs at [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## Testing

- **Backend:**
  ```bash
  cd Server
  npm test
  npm run test:watch
  npm run test:coverage
  ```
- **Frontend:**
  ```bash
  cd Client
  npm run test
  npm run test:coverage
  ```

## Linting & Formatting
- Pre-commit hooks run ESLint and Prettier automatically.
- Manual lint/format:
  ```bash
  npm run lint
  npm run format
  ```

## Docker Setup
- Start all services:
  ```bash
  docker-compose up -d
  ```
- Stop services:
  ```bash
  docker-compose down
  ```

## Deployment
- Backend: Deploy Node.js + MongoDB on cloud (AWS, DigitalOcean, etc.)
- Frontend: Deploy on Vercel, Netlify, or cloud platforms
- Set environment variables for production

## API Documentation
- Interactive docs at `/api-docs` (Swagger UI)
- Update `Server/src/swaggerDef.ts` for schema changes

## Troubleshooting
- Check `.env` files for correct values
- Ensure MongoDB is running
- Review logs in terminal for errors

## Contributing
1. Fork the repo
2. Create a feature branch
3. Make changes, add tests
4. Commit and push
5. Submit a pull request

---
For architecture, see ARCHITECTURE.md. For more, see README.md.
# 🔧 CloudBlitz Developer Guide

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Architecture Overview](#architecture-overview)
- [API Development](#api-development)
- [Frontend Development](#frontend-development)
- [Database Management](#database-management)
- [Troubleshooting](#troubleshooting)

## 🚀 Getting Started

### Initial Setup
1. **Clone and Setup**
   ```bash
   git clone https://github.com/dhiraj-gede/cloudblitz.git
   cd cloudblitz
   ```

2. **Environment Setup**
   ```bash
   # Backend setup
   cd Server
   npm install
   cp .env.example .env
   
   # Frontend setup
   cd ../Client
   npm install
   cp .env.example .env
   ```

3. **Start Development**
   ```bash
   # Terminal 1: Backend
   cd Server && npm run dev
   
   # Terminal 2: Frontend
   cd Client && npm run dev
   ```

## 🛠️ Development Environment

### Required Tools
- **Node.js 18+** - Runtime environment
- **npm** - Package manager
- **MongoDB** - Database (local or Atlas)
- **Docker** - Containerization (optional)
- **VS Code** - Recommended IDE

### Recommended VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**
- **Thunder Client** (for API testing)

### AI Development Tools
- **GitHub Copilot** - AI pair programming
- **Cursor** - AI-powered code editor
- **Codeium** - AI autocomplete
- **Tabnine** - AI assistant
- **Mintlify** - Documentation

## 📝 Code Standards

### TypeScript Guidelines
```typescript
// Use explicit types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
}

// Prefer type over interface for unions
type Status = 'new' | 'in-progress' | 'closed';

// Use generics for reusable types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

### Naming Conventions
- **Files**: kebab-case (`user-service.ts`)
- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions**: camelCase (`getUserById`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces**: PascalCase with I prefix (`IUser`)

### Code Organization
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── forms/        # Form components
│   └── layout/       # Layout components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── services/         # API services
├── types/            # TypeScript types
├── utils/            # Utility functions
└── constants/        # Application constants
```

## 🧪 Testing Guidelines

### Backend Testing
```typescript
// Example test structure
describe('User Controller', () => {
  beforeEach(() => {
    // Setup test data
  });

  afterEach(() => {
    // Cleanup
  });

  test('should create user successfully', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe(userData.name);
  });
});
```

### Frontend Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import UserForm from './UserForm';

test('should submit form with valid data', () => {
  const onSubmit = jest.fn();
  render(<UserForm onSubmit={onSubmit} />);
  
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'John Doe' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(onSubmit).toHaveBeenCalledWith({ name: 'John Doe' });
});
```

### Test Commands
```bash
# Backend tests
cd Server
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Frontend tests
cd Client
npm test                 # Run all tests
npm run test:ui         # UI mode
npm run test:coverage   # Coverage report
```

## 🏗️ Architecture Overview

### Backend Architecture
```
src/
├── app.ts              # Express app setup
├── controllers/        # Request handlers
├── models/            # Database models
├── routes/            # Route definitions
├── middlewares/       # Custom middleware
├── lib/               # Utilities & configs
└── __tests__/         # Test files
```

### Frontend Architecture
```
src/
├── App.tsx            # Main app component
├── components/        # Reusable components
├── pages/            # Page components
├── layouts/          # Layout components
├── routes/           # Route configurations
├── hooks/            # Custom hooks
├── services/         # API services
├── types/            # Type definitions
└── utils/            # Utility functions
```

### Data Flow
1. **Frontend** → API request via service
2. **Route** → Middleware → Controller
3. **Controller** → Model → Database
4. **Response** ← Controller ← Model
5. **Frontend** ← API response

## 🛠️ API Development

### Creating New Endpoints
1. **Define Model**
   ```typescript
   // models/enquiry.ts
   import mongoose from 'mongoose';
   
   const enquirySchema = new mongoose.Schema({
     title: { type: String, required: true },
     description: { type: String, required: true },
     status: { 
       type: String, 
       enum: ['new', 'in-progress', 'closed'],
       default: 'new'
     }
   });
   
   export default mongoose.model('Enquiry', enquirySchema);
   ```

2. **Create Controller**
   ```typescript
   // controllers/enquiry.controller.ts
   import { Request, Response } from 'express';
   import Enquiry from '../models/enquiry';
   
   export const createEnquiry = async (req: Request, res: Response) => {
     try {
       const enquiry = new Enquiry(req.body);
       await enquiry.save();
       res.status(201).json({ data: enquiry, success: true });
     } catch (error) {
       res.status(400).json({ error: error.message, success: false });
     }
   };
   ```

3. **Define Routes**
   ```typescript
   // routes/enquiry.routes.ts
   import express from 'express';
   import { createEnquiry } from '../controllers/enquiry.controller';
   import { authenticate } from '../middlewares/auth';
   
   const router = express.Router();
   
   router.post('/', authenticate, createEnquiry);
   
   export default router;
   ```

### Middleware Development
```typescript
// middlewares/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## ⚛️ Frontend Development

### Component Development
```typescript
// components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button = ({ children, variant, size, className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Custom Hooks
```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react';

export const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
```

## 🗄️ Database Management

### Schema Design
```typescript
// User Schema
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwordHash: String,
  role: 'admin' | 'staff' | 'user',
  createdAt: Date,
  updatedAt: Date
}

// Enquiry Schema
{
  _id: ObjectId,
  title: String,
  description: String,
  status: 'new' | 'in-progress' | 'closed',
  priority: 'low' | 'medium' | 'high',
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date (soft delete)
}
```

### Migration Scripts
```bash
# Create migration directory
mkdir Server/src/migrations

# Run migration script
npm run migrate:up
npm run migrate:down
```

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Check MongoDB status
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux

# Start MongoDB
brew services start mongodb        # macOS
sudo systemctl start mongod        # Linux
```

#### 2. Port Already in Use
```bash
# Find process using port
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

#### 3. TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
rm -rf dist
npm install
```

#### 4. ESLint Issues
```bash
# Fix auto-fixable issues
npm run lint:fix

# Check specific file
npx eslint src/app.ts
```

### Development Tips

1. **Use TypeScript Strict Mode**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "noImplicitReturns": true
     }
   }
   ```

2. **Environment Variables**
   ```typescript
   // lib/config.ts
   import { z } from 'zod';
   
   const envSchema = z.object({
     PORT: z.string().transform(Number),
     MONGODB_URI: z.string(),
     JWT_SECRET: z.string(),
   });
   
   export const config = envSchema.parse(process.env);
   ```

3. **Error Handling**
   ```typescript
   // lib/errors.ts
   export class AppError extends Error {
     constructor(
       public message: string,
       public statusCode: number = 500
     ) {
       super(message);
       this.name = 'AppError';
     }
   }
   
   // Middleware
   export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
     if (err instanceof AppError) {
       return res.status(err.statusCode).json({
         error: err.message,
         success: false
       });
     }
     
     res.status(500).json({
       error: 'Internal server error',
       success: false
     });
   };
   ```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Happy Development! 🚀**