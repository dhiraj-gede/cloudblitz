# CloudBlitz Frontend

Modern React application built with TypeScript, Vite, and Tailwind CSS for the CloudBlitz Enquiry Management System.

## 🚀 Technology Stack

- **React 19.1.1** - Latest React with modern features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.7** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router v7** - Client-side routing

## 🛠️ Development Tools

- **ESLint 9** - Code linting and quality
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **lint-staged** - Pre-commit code checks

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.local
```

## 🏃‍♂️ Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧹 Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# Type checking
npm run type-check
```

## 🔧 Environment Variables

Create a `.env.local` file with:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration  
VITE_APP_NAME=CloudBlitz
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── enquiry/        # Enquiry management components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🎨 UI Components

Built with Radix UI primitives for accessibility:
- Dialog/Modal components
- Dropdown menus
- Form components
- Toast notifications

## 🔒 Authentication

- JWT token management
- Role-based access control
- Protected routes
- Persistent authentication state

## 🚦 Git Hooks

Pre-commit hooks automatically:
- Run ESLint and fix issues
- Format code with Prettier
- Check TypeScript types

## 🐛 Troubleshooting

### Development Server Issues
```bash
# Clear cache and restart
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### TypeScript Errors
```bash
# Run type checking
npm run type-check
```

### Linting Issues
```bash
# Auto-fix ESLint problems
npm run lint:fix
```

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
