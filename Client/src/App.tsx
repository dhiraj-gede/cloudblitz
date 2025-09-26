import { AuthProvider } from './contexts/AuthContext.tsx';
import { useAuth } from './hooks/useAuth.ts';
import { AuthPage } from './components/auth/AuthPage.tsx';
import { Dashboard } from './components/dashboard/Dashboard.tsx';
import './App.css';
import { ToastProvider } from './contexts/ToastContext.tsx';

function AppContent() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-muted-foreground'>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className='min-h-screen bg-background'>
      <nav className='border-b border-[hsl(var(--border))] bg-card'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-foreground'>CloudBlitz</h1>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-muted-foreground'>Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className='px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground'
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <Dashboard />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
