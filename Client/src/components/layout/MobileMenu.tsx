import React from 'react';
import { Zap, X, LogOut, ChevronRight } from 'lucide-react';

interface MobileMenuProps {
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
  allowedNavItems: {
    id: string;
    label: string;
    icon: React.ElementType;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    badge?: string;
    notificationCount?: number;
  }[];
  activeView: string;
  setActiveView: (v: string) => void;
  logout: () => void;
  onSettingsClick?: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  user,
  userRoleConfig,
  allowedNavItems,
  activeView,
  setActiveView,
  logout,
  //   onSettingsClick,
}) => {
  const UserRoleIcon = userRoleConfig.icon;

  const badgeVariants = {
    default: 'bg-secondary text-secondary-foreground border-border',
    success: 'bg-success-bg text-success-fg border-success/20',
    warning: 'bg-warning-bg text-warning-fg border-warning/20',
    error: 'bg-error-bg text-error-fg border-error/20',
    info: 'bg-info-bg text-info-fg border-info/20',
  };

  if (!mobileMenuOpen) return null;

  return (
    <div className='lg:hidden fixed inset-0 z-50'>
      {/* Enhanced Backdrop with blur */}
      <div
        className='absolute inset-0 bg-background/80 backdrop-blur-glass'
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Menu Panel with enhanced styling */}
      <div className='absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-card border-r border-border flex flex-col transform transition-all duration-300 ease-in-out shadow-xl'>
        {/* Enhanced Header */}
        <div className='flex items-center justify-between p-6 border-b border-border bg-sidebar'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg hover-lift'>
              <Zap className='w-5 h-5 text-primary-foreground' />
            </div>
            <div>
              <h1 className='font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                CloudBlitz
              </h1>
              <p className='text-xs text-muted-foreground'>Navigation Menu</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className='p-2 hover:bg-accent rounded-lg smooth-transition focus-ring'
          >
            <X className='w-5 h-5 text-muted-foreground' />
          </button>
        </div>

        {/* Enhanced User Info Section */}
        <div className='p-6 border-b border-border bg-sidebar-accent'>
          <div className='flex items-center gap-4'>
            {/* User Avatar with gradient */}
            <div className='relative'>
              <div className='w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg'>
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
              <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-online border-2 border-card rounded-full' />
            </div>

            <div className='flex-1 min-w-0'>
              <div className='font-semibold text-foreground truncate text-lg'>
                {user?.name || 'User'}
              </div>
              <div className='text-sm text-muted-foreground truncate'>{user?.email}</div>

              {/* Enhanced Role Badge */}
              <div className='flex items-center gap-2 mt-2'>
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

        {/* Enhanced Navigation */}
        <nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
          <div className='px-2 py-3'>
            <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
              Main Menu
            </h3>
            <div className='space-y-1'>
              {allowedNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl smooth-transition group ${
                      isActive
                        ? `${item.bgColor} ${item.color} shadow-sm border ${item.borderColor} transform scale-[1.02]`
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`p-2 rounded-lg smooth-transition ${
                          isActive
                            ? 'bg-background shadow-sm'
                            : 'bg-muted group-hover:bg-background/50'
                        }`}
                      >
                        <Icon className='w-4 h-4' />
                      </div>
                      <div className='text-left'>
                        <div className='font-medium text-sm flex items-center gap-2'>
                          {item.label}
                          {item.notificationCount && (
                            <span className='bg-error text-error-fg text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center'>
                              {item.notificationCount}
                            </span>
                          )}
                        </div>
                        <div className='text-xs text-muted-foreground'>{item.description}</div>
                      </div>
                    </div>

                    {/* Active indicator or chevron */}
                    {isActive ? (
                      <div className='w-1.5 h-1.5 bg-primary rounded-full' />
                    ) : (
                      <ChevronRight className='w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 smooth-transition' />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Enhanced Footer Actions */}
        <div className='p-4 border-t border-border bg-sidebar space-y-1'>
          {/* <button
            onClick={onSettingsClick}
            className='w-full flex items-center justify-between p-3 text-foreground hover:bg-accent rounded-xl smooth-transition group focus-ring'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-muted group-hover:bg-background/50'>
                <Settings className='w-4 h-4' />
              </div>
              <span className='text-sm font-medium'>Settings & Preferences</span>
            </div>
            <ChevronRight className='w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 smooth-transition' />
          </button> */}

          <button
            onClick={logout}
            className='w-full flex items-center justify-between p-3 text-error hover:bg-error/10 rounded-xl smooth-transition group focus-ring'
          >
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-error/10 group-hover:bg-error/20'>
                <LogOut className='w-4 h-4' />
              </div>
              <span className='text-sm font-medium'>Sign Out</span>
            </div>
            <ChevronRight className='w-4 h-4 text-error/60 opacity-0 group-hover:opacity-100 smooth-transition' />
          </button>

          {/* Version info */}
          <div className='pt-3 mt-2 border-t border-border/50'>
            <div className='text-xs text-muted-foreground text-center'>
              CloudBlitz v2.1.0 • © 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Optional: Mobile Menu Trigger Component
export const MobileMenuTrigger: React.FC<{
  onClick: () => void;
  notificationCount?: number;
}> = ({ onClick, notificationCount }) => {
  return (
    <button
      onClick={onClick}
      className='lg:hidden p-2 relative focus-ring rounded-lg'
      aria-label='Open navigation menu'
    >
      <div className='w-6 h-6 flex flex-col justify-center gap-1'>
        <div className='w-full h-0.5 bg-foreground rounded-full' />
        <div className='w-full h-0.5 bg-foreground rounded-full' />
        <div className='w-full h-0.5 bg-foreground rounded-full' />
      </div>
      {notificationCount && notificationCount > 0 && (
        <span className='absolute -top-1 -right-1 bg-error text-error-fg text-xs rounded-full w-5 h-5 flex items-center justify-center'>
          {notificationCount > 9 ? '9+' : notificationCount}
        </span>
      )}
    </button>
  );
};
