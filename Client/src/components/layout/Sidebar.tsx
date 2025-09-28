import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  notificationCount?: number;
}

interface SidebarProps {
  allowedNavItems: SidebarNavItem[];
  activeView: string;
  setActiveView: (v: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ allowedNavItems, activeView, setActiveView }) => {
  return (
    <aside className='hidden lg:block w-80 bg-sidebar border-r border-sidebar-border h-[calc(100vh-4rem)] sticky top-16'>
      <nav className='p-4 space-y-1'>
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl smooth-transition group ${
                isActive
                  ? `${item.bgColor} ${item.color} border ${item.borderColor} shadow-sm transform scale-[1.02]`
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`p-2 rounded-lg smooth-transition ${
                    isActive ? 'bg-background shadow-sm' : 'bg-muted group-hover:bg-background/50'
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
      </nav>

      {/* Enhanced Quick Stats */}
      <div className='mt-auto p-4 border-t border-sidebar-border'>
        <div className='bg-gradient-to-r from-primary to-secondary rounded-xl p-4 text-primary-foreground shadow-lg'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-xs opacity-90 font-medium'>Workspace Status</div>
            <div className='w-2 h-2 bg-online rounded-full animate-pulse' />
          </div>
          <div className='font-semibold text-sm'>Active & Running</div>
          <div className='text-xs opacity-80 mt-1'>All systems operational</div>
        </div>
      </div>
    </aside>
  );
};
