# 🚀 CloudBlitz Development Setup Guide

## Current Working Setup

✅ **MongoDB**: Running in Docker container  
✅ **Backend API**: Running locally with ts-node-dev  
✅ **Frontend**: Running locally with Vite  

## Quick Start Commands

### 1. Start MongoDB with Docker
```bash
cd /h/Gremio/cloudblitz
docker-compose -f docker-compose.dev.yml up -d mongodb-dev
```

### 2. Start Backend Server
```bash
cd h:/Gremio/cloudblitz/Server
npm run dev
```
🔗 API Health Check: http://localhost:5000/api/health

### 3. Start Frontend Server
```bash
cd h:/Gremio/cloudblitz/Client
npm run dev
```
🌐 Frontend App: http://localhost:5173

## Service URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Running |
| Backend API | http://localhost:5000 | ✅ Running |
| Health Check | http://localhost:5000/api/health | ✅ Working |
| MongoDB | mongodb://localhost:27017 | ✅ Running in Docker |

## Development Workflow

### Environment Configuration
- **Backend .env**: Configured for Docker MongoDB connection
- **Frontend .env**: Points to local backend API
- **Docker**: Only running MongoDB service

### Recommended VS Code Setup
1. **Terminal 1**: MongoDB Docker container
2. **Terminal 2**: Backend development server
3. **Terminal 3**: Frontend development server
4. **Terminal 4**: Free for commands/testing

### Testing the Setup

#### Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "CloudBlitz API is running",
  "timestamp": "2025-09-22T17:10:25.123Z",
  "version": "1.0.0"
}
```

#### API Info
```bash
curl http://localhost:5000/api
```

## Docker Services Status

### Currently Running
```bash
docker ps
```
Should show:
- `cloudblitz-mongodb-dev` (MongoDB 7.0)

### MongoDB Connection
- **Host**: localhost
- **Port**: 27017
- **Database**: cloudblitz_dev
- **Username**: admin
- **Password**: devpassword

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB container
docker logs cloudblitz-mongodb-dev

# Restart MongoDB
docker-compose -f docker-compose.dev.yml restart mongodb-dev
```

### Backend Issues
```bash
# Check if port 5000 is available
netstat -ano | findstr :5000

# Restart backend
cd h:/Gremio/cloudblitz/Server
npm run dev
```

### Frontend Issues
```bash
# Check if port 5173 is available
netstat -ano | findstr :5173

# Restart frontend
cd h:/Gremio/cloudblitz/Client
npm run dev
```

## Next Steps

### Authentication Implementation (EPIC 2)
Now that the development environment is working, you can proceed with:

1. **User Schema**: Create MongoDB user model
2. **Authentication Routes**: Implement login/register endpoints
3. **JWT Middleware**: Add authentication middleware
4. **Protected Routes**: Secure API endpoints

### Enquiry Management (EPIC 3)
After authentication:

1. **Enquiry Schema**: Create MongoDB enquiry model
2. **CRUD Operations**: Implement enquiry endpoints
3. **Status Management**: Add enquiry status tracking
4. **User Assignment**: Link enquiries to users

## AI Development Tools Integration

### Current Setup Supports
- **GitHub Copilot**: Auto-completion and suggestions
- **Cursor**: AI-powered code editing
- **Codeium**: Intelligent code completion
- **Tabnine**: AI assistant for development

### Recommended Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Thunder Client** (for API testing)

---

**Development environment is ready! 🎉**