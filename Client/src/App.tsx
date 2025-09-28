// Import modular layout components
import { Navbar } from './components/layout/Navbar.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { MobileMenu } from './components/layout/MobileMenu.tsx';
import { ContentHeader } from './components/layout/ContentHeader.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { useAuth } from './hooks/useAuth.ts';
import { AuthPage } from './components/auth/AuthPage.tsx';
import { Dashboard } from './components/dashboard/Dashboard.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';
import { UserManagement } from './components/admin/UserManagement.tsx';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Crown,
  UserCog,
  UserCheck,
  // MessageSquare,
  // BarChart3,
  // FileText,
  Cloud,
} from 'lucide-react';

function AppContent() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  type NavigationKey = keyof typeof navigationConfig;
  const [activeView, setActiveView] = useState<NavigationKey>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Close menus when view changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [activeView]);

  // Navigation configuration
  const navigationConfig = {
    dashboard: {
      label: 'Dashboard',
      icon: LayoutDashboard,
      component: Dashboard,
      roles: ['admin', 'staff', 'user'],
      description: 'Analytics and overview',
      color: 'text-primary',
      bgColor: 'bg-primary/10 dark:bg-primary/20',
      borderColor: 'border-primary/20 dark:border-primary/30',
    },
    users: {
      label: 'User Management',
      icon: Users,
      component: UserManagement,
      roles: ['admin'],
      description: 'Manage users and permissions',
      color: 'text-secondary-foreground',
      bgColor: 'bg-secondary/10 dark:bg-secondary/20',
      borderColor: 'border-secondary/20 dark:border-secondary/30',
    },
  };
  type UserRole = 'admin' | 'staff' | 'user';

  // Role configuration
  const roleConfig: Record<
    UserRole,
    {
      icon: React.ElementType;
      color: string;
      label: string;
      badge: string;
      variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    }
  > = {
    admin: {
      icon: Crown,
      color: 'text-warning',
      label: 'Admin',
      badge: 'bg-warning/20 text-warning-foreground border border-warning/30',
      variant: 'warning',
    },
    staff: {
      icon: UserCog,
      color: 'text-primary',
      label: 'Staff',
      badge: 'bg-primary/20 text-primary-foreground border border-primary/30',
      variant: 'info',
    },
    user: {
      icon: UserCheck,
      color: 'text-success',
      label: 'User',
      badge: 'bg-success/20 text-success-foreground border border-success/30',
      variant: 'success',
    },
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted'>
        <div className='text-center'>
          <div className='w-20 h-20 mx-auto mb-6 relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl animate-pulse'></div>
            <Cloud className='w-12 h-12 text-primary-foreground absolute inset-0 m-auto' />
          </div>
          <h1 className='text-2xl font-bold text-foreground mb-2'>CloudBlitz</h1>
          <p className='text-muted-foreground'>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const userRoleConfig = roleConfig[(user?.role as UserRole) || 'user'];
  // const UserRoleIcon = userRoleConfig.icon;

  // Filter navigation based on user role
  const allowedNavItems = Object.entries(navigationConfig)
    .filter(([, config]) => config.roles.includes(user?.role || 'user'))
    .map(([id, config]) => ({ id, ...config }));

  const ActiveComponent = navigationConfig[activeView]?.component;

  return (
    <div className='min-h-screen bg-background text-foreground transition-colors duration-200'>
      {/* Top Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        userMenuOpen={userMenuOpen}
        setUserMenuOpen={setUserMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        user={user ?? {}}
        userRoleConfig={userRoleConfig}
        logout={logout}
        // onSettingsClick={handleSettings}
        // onProfileClick={handleProfile}
        // notificationCount={3}
        // searchValue={searchQuery}
        // onSearchChange={setSearchQuery}
      />
      <div className='flex'>
        {/* Desktop Sidebar */}
        <Sidebar
          allowedNavItems={allowedNavItems}
          activeView={activeView}
          setActiveView={(v: string) => setActiveView(v as NavigationKey)}
        />
        {/* Main Content */}
        <main className='flex-1 min-h-[calc(100vh-4rem)]'>
          <ContentHeader
            label={navigationConfig[activeView]?.label}
            description={navigationConfig[activeView]?.description}
            userRoleConfig={userRoleConfig}
          />
          {/* Page Content */}
          <div className='p-4 lg:p-8'>
            <div className='max-w-7xl mx-auto'>
              {ActiveComponent && <ActiveComponent role={user?.role} />}
            </div>
          </div>
        </main>
      </div>
      {/* Mobile Menu */}
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        user={user ?? {}}
        userRoleConfig={userRoleConfig}
        allowedNavItems={allowedNavItems}
        activeView={activeView}
        setActiveView={(v: string) => setActiveView(v as NavigationKey)}
        logout={logout}
      />
      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div className='fixed inset-0 z-10' onClick={() => setUserMenuOpen(false)} />
      )}
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
