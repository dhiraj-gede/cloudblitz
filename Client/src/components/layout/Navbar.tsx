import React, { useRef } from 'react';
import {
  Sun,
  Moon,
  //   Bell,
  //   HelpCircle,
  Menu,
  Zap,
  ChevronDown,
  Search,
  LogOut,
  Mail,
  //   Settings,
  //   User,
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  userMenuOpen: boolean;
  setUserMenuOpen: (v: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  user: {
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
  };
  userRoleConfig: {
    icon: React.ElementType;
    color: string;
    label: string;
    badge: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  };
  logout: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  notificationCount?: number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  userMenuOpen,
  setUserMenuOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  user,
  userRoleConfig,
  logout,
  //   onSettingsClick,
  //   onProfileClick,
  //   notificationCount = 0,
  searchValue = '',
  onSearchChange,
}) => {
  const UserRoleIcon = userRoleConfig.icon;
  const userMenuRef = useRef<HTMLDivElement>(null);

  const badgeVariants = {
    default: 'bg-secondary text-secondary-foreground border-border',
    success: 'bg-success-bg text-success-fg border-success/20',
    warning: 'bg-warning-bg text-warning-fg border-warning/20',
    error: 'bg-error-bg text-error-fg border-error/20',
    info: 'bg-info-bg text-info-fg border-info/20',
  };

  const handleMenuItemClick = (callback?: () => void) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      callback?.(); // call first
      setUserMenuOpen(false); // then close dropdown
    };
  };

  return (
    <header className='sticky top-0 z-40 bg-header/80 backdrop-blur-glass border-b border-header-border supports-backdrop-blur:bg-header/60'>
      <div className='flex items-center justify-between px-4 lg:px-6 h-16'>
        {/* Left Section - Logo and Mobile Menu */}
        <div className='flex items-center gap-4'>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='lg:hidden p-2 hover:bg-accent rounded-lg smooth-transition focus-ring'
            aria-label='Toggle mobile menu'
          >
            <Menu className='w-5 h-5 text-muted-foreground' />
          </button>

          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg hover-lift'>
              <Zap className='w-5 h-5 text-primary-foreground' />
            </div>
            <div className='hidden sm:block'>
              <h1 className='font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                CloudBlitz
              </h1>
              <p className='text-xs text-muted-foreground font-medium'>Enterprise Workspace</p>
            </div>
          </div>
        </div>

        {/* Center Section - Enhanced Search */}
        <div className='flex-1 max-w-2xl mx-4 lg:mx-8'>
          <div className='relative group'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <input
              type='text'
              placeholder='Search projects, documents, teams...'
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm smooth-transition backdrop-blur-sm group-hover:bg-muted/70'
            />
            {/* Search shortcut hint */}
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2 hidden lg:block'>
              <kbd className='text-xs bg-background border border-border rounded px-1.5 py-1 text-muted-foreground'>
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section - Enhanced Actions */}
        <div className='flex items-center gap-1'>
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className='p-2.5 hover:bg-accent rounded-xl smooth-transition focus-ring group relative'
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className='w-5 h-5 text-amber-500 group-hover:scale-110 smooth-transition' />
            ) : (
              <Moon className='w-5 h-5 text-indigo-500 group-hover:scale-110 smooth-transition' />
            )}
          </button>

          {/* Notifications */}
          {/* <button className='relative p-2.5 hover:bg-accent rounded-xl smooth-transition focus-ring group'>
            <Bell className='w-5 h-5 text-muted-foreground group-hover:text-foreground smooth-transition' />
            {notificationCount > 0 && (
              <>
                <span className='absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse' />
                <span className='absolute -top-1 -right-1 bg-error text-error-fg text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium'>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              </>
            )}
          </button> */}

          {/* Help */}
          {/* <button className='p-2.5 hover:bg-accent rounded-xl smooth-transition focus-ring group'>
            <HelpCircle className='w-5 h-5 text-muted-foreground group-hover:text-foreground smooth-transition' />
          </button> */}

          {/* Enhanced User Menu */}
          <div className='relative ml-2' ref={userMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen(!userMenuOpen);
              }}
              className='flex items-center gap-2 p-1.5 hover:bg-accent rounded-xl smooth-transition focus-ring group'
              aria-label='User menu'
              aria-expanded={userMenuOpen}
            >
              <div className='relative'>
                <div className='w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-lg'>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className='w-full h-full rounded-full object-cover'
                    />
                  ) : (
                    user?.name
                      ?.split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  )}
                </div>
                {/* Online status indicator */}
                <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-online border-2 border-card rounded-full' />
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground smooth-transition ${userMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Enhanced User Dropdown */}
            {userMenuOpen && (
              <div
                className='absolute right-0 top-full mt-2 w-80 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50 animate-slide-down'
                // onClick={handleDropdownClick}
              >
                {/* User Info Header */}
                <div className='p-4 border-b border-border bg-gradient-to-r from-card to-accent/5'>
                  <div className='flex items-center gap-3'>
                    <div className='relative'>
                      <div className='w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg'>
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className='w-full h-full rounded-full object-cover'
                          />
                        ) : (
                          user?.name
                            ?.split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)
                        )}
                      </div>
                      <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-online border-2 border-card rounded-full' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='font-semibold text-foreground truncate text-lg'>
                        {user?.name || 'User'}
                      </div>
                      <div className='text-sm text-muted-foreground truncate flex items-center gap-1'>
                        <Mail className='w-3 h-3' />
                        {user?.email}
                      </div>
                      <div className='flex items-center gap-2 mt-1'>
                        <UserRoleIcon className={`w-3 h-3 ${userRoleConfig.color}`} />
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${
                            badgeVariants[userRoleConfig.variant || 'default']
                          } ${userRoleConfig.badge}`}
                        >
                          {userRoleConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Actions */}
                <div className='p-2'>
                  {/* <button
                    onClick={handleMenuItemClick(onProfileClick)}
                    className='w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-accent rounded-lg smooth-transition focus-ring'
                  >
                    <User className='w-4 h-4' />
                    <span>Profile & Account</span>
                  </button>
                  <button
                    onClick={handleMenuItemClick(onSettingsClick)}
                    className='w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-accent rounded-lg smooth-transition focus-ring'
                  >
                    <Settings className='w-4 h-4' />
                    <span>Settings & Preferences</span>
                  </button> */}
                  <button
                    onClick={handleMenuItemClick(logout)}
                    className='w-full flex items-center gap-3 px-3 py-2.5 text-sm text-error hover:bg-error/10 rounded-lg smooth-transition focus-ring'
                  >
                    <LogOut className='w-4 h-4' />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Optional: Standalone Search Component
export const NavbarSearch: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = 'Search anything...' }) => {
  return (
    <div className='relative group max-w-2xl'>
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm smooth-transition backdrop-blur-sm group-hover:bg-muted/70'
      />
    </div>
  );
};
