import React, { useEffect, useState } from 'react';
import { useToast } from '../../hooks/useToast.ts';
import type { User } from '../../types/index.ts';
import { fetchUsers, deleteUser, createUser, updateUser } from '../../services/api.ts';
import { UserModal } from './UserModal.tsx';
import {
  Plus,
  Search,
  Users,
  UserCheck,
  Eye,
  Pencil,
  Trash2,
  AlertCircle,
  Crown,
  UserCog,
  Mail,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.tsx';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const toast = useToast();

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const response = await fetchUsers();
        setUsers(response);
        setError('');
      } catch (err) {
        setError('Failed to load users. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (!searchQuery && roleFilter === 'all') return true;

    const matchesSearch =
      !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleNewUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await deleteUser(user.id);
        setUsers(users.filter((u) => u.id !== user.id));
        toast.success(`User ${user.name} deleted successfully`);
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  type RoleType = 'admin' | 'staff' | 'user';
  const getRoleConfig = (role: string) => {
    const configs: Record<
      RoleType,
      {
        icon: React.ComponentType;
        color: string;
        bg: string;
        border: string;
        label: string;
      }
    > = {
      admin: {
        icon: Crown,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        label: 'Admin',
      },
      staff: {
        icon: UserCog,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        label: 'Staff',
      },
      user: {
        icon: UserCheck,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        label: 'User',
      },
    };
    if (role === 'admin' || role === 'staff' || role === 'user') {
      return configs[role];
    }
    return configs.user;
  };

  const getRoleCount = (role: string) => {
    if (role === 'all') return users.length;
    return users.filter((u) => u.role === role).length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className='space-y-6 max-w-7xl mx-auto p-4'>
      {/* Enhanced Header */}
      <div className='bg-card rounded-xl shadow-sm p-6 border border-[hsl(var(--border))]'>
        <div className='flex justify-between items-center'>
          <div className='space-y-1'>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>User Management</h1>
            <p className='text-muted-foreground'>Manage system users and their permissions</p>
          </div>

          <button
            className='inline-flex items-center justify-center rounded-lg text-base font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md h-11 px-6 py-2 gap-2'
            onClick={handleNewUser}
          >
            <Plus className='w-5 h-5' />
            New User
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {[
          {
            role: 'all',
            label: 'Total Users',
            icon: Users,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            borderColor: 'border-primary/20',
          },
          {
            role: 'admin',
            label: 'Administrators',
            icon: Crown,
            color: 'text-error',
            bgColor: 'bg-error/10',
            borderColor: 'border-error/20',
          },
          {
            role: 'staff',
            label: 'Staff Members',
            icon: UserCog,
            color: 'text-warning',
            bgColor: 'bg-warning/10',
            borderColor: 'border-warning/20',
          },
          {
            role: 'user',
            label: 'Regular Users',
            icon: UserCheck,
            color: 'text-success',
            bgColor: 'bg-success/10',
            borderColor: 'border-success/20',
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.role}
              className={`border ${stat.borderColor} hover-lift cursor-pointer transition-all ${
                roleFilter === stat.role ? 'ring-2 ring-primary/20 bg-primary/5' : ''
              }`}
              onClick={() => setRoleFilter(stat.role)}
            >
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  {stat.label}
                </CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-foreground'>{getRoleCount(stat.role)}</div>
                <p className='text-xs text-muted-foreground'>
                  {stat.role === 'all' ? 'All users' : `${stat.label.toLowerCase()} in system`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className='bg-card rounded-xl shadow-sm border border-[hsl(var(--border))] p-6'>
        {/* Search and Filter Controls */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
          <div className='relative flex-1 lg:max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
            <input
              type='text'
              placeholder='Search users by name or email...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
            />
          </div>

          <div className='flex items-center gap-2'>
            <div className='relative group'>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className='appearance-none pl-4 pr-10 py-2.5 border border-input rounded-lg bg-background text-foreground 
               focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
               transition-all duration-200 hover:border-gray-300 
               shadow-sm hover:shadow-md
               min-w-[140px] cursor-pointer font-medium'
              >
                <option value='all' className='text-black bg-background'>
                  All Roles
                </option>
                <option
                  value='admin'
                  className='text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
                >
                  Admin
                </option>
                <option
                  value='staff'
                  className='text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                >
                  Staff
                </option>
                <option
                  value='user'
                  className='text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
                >
                  User
                </option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                <svg
                  className='w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className='bg-card rounded-lg p-12 text-center border border-[hsl(var(--border))]'>
            <div className='inline-flex items-center gap-2 text-muted-foreground'>
              <div className='w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin'></div>
              Loading users...
            </div>
          </div>
        ) : error ? (
          <div className='bg-card rounded-lg p-12 text-center border border-destructive/20'>
            <div className='text-destructive space-y-2'>
              <AlertCircle className='w-12 h-12 mx-auto mb-3 opacity-50' />
              <p className='font-medium'>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className='text-sm text-muted-foreground hover:text-foreground underline'
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            {/* Enhanced Table */}
            <div className='overflow-x-auto rounded-xl border border-[hsl(var(--border))] shadow-sm bg-card'>
              <table className='min-w-full divide-y divide-border'>
                <thead className='bg-muted/50'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                      User
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                      Contact
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                      Role
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                      Created
                    </th>
                    <th className='px-6 py-4 relative'>
                      <span className='sr-only'>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-background divide-y divide-border'>
                  {filteredUsers.map((user) => {
                    const roleConfig = getRoleConfig(user.role);
                    const RoleIcon = roleConfig.icon;

                    return (
                      <tr key={user.id} className='hover:bg-muted/30 transition-colors'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                              {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                            <div>
                              <div className='font-medium text-foreground'>{user.name}</div>
                              <div className='text-sm text-muted-foreground'>
                                ID: {user.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center gap-2 text-muted-foreground'>
                            <Mail className='w-4 h-4' />
                            <span className='text-sm'>{user.email}</span>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.color} ${roleConfig.border} border`}
                          >
                            <RoleIcon />
                            {roleConfig.label}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Calendar className='w-4 h-4' />
                            {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <div className='flex items-center justify-end gap-1'>
                            <button
                              onClick={() => handleViewUser(user)}
                              className='inline-flex items-center justify-center  rounded-lg border border-input bg-background text-[hsl(var(--info))] hover:bg-[hsl(var(--info-bg))] hover:text-[hsl(var(--info-fg))] transition-colors'
                              title='View User'
                            >
                              <Eye className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className='inline-flex items-center justify-center  rounded-lg border border-input bg-background text-[hsl(var(--warning))] hover:bg-[hsl(var(--warning-bg))] hover:text-[hsl(var(--warning-fg))] transition-colors'
                              title='Edit User'
                            >
                              <Pencil className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className='inline-flex items-center justify-center  rounded-lg border border-input bg-background text-[hsl(var(--error))] hover:bg-[hsl(var(--error-bg))] hover:text-[hsl(var(--error-fg))] transition-colors'
                              title='Delete User'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className='px-6 py-12 text-center'>
                        <div className='space-y-3'>
                          <Users className='w-12 h-12 text-muted-foreground/50 mx-auto' />
                          <div>
                            <h3 className='text-lg font-medium text-foreground mb-2'>
                              No users found
                            </h3>
                            <p className='text-muted-foreground mb-4'>
                              {searchQuery || roleFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'Get started by creating your first user'}
                            </p>
                            <button
                              onClick={handleNewUser}
                              className='inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors'
                            >
                              <Plus className='w-4 h-4' />
                              Create New User
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Results Summary */}
            {filteredUsers.length > 0 && (
              <div className='flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border'>
                <div>
                  Showing {filteredUsers.length} of {users.length} users
                  {roleFilter !== 'all' && (
                    <span className='ml-1'>
                      • Filtered by: <span className='font-medium'>{roleFilter}</span>
                    </span>
                  )}
                  {searchQuery && (
                    <span className='ml-1'>
                      • Search: <span className='font-medium'>"{searchQuery}"</span>
                    </span>
                  )}
                </div>

                {(searchQuery || roleFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setRoleFilter('all');
                    }}
                    className='text-primary hover:text-primary/80 font-medium'
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <UserModal
          user={selectedUser || undefined}
          onClose={handleModalClose}
          isOpen={isModalOpen}
          onSave={async (data) => {
            try {
              let savedUser: User;
              if (selectedUser) {
                savedUser = await updateUser(selectedUser.id, data);
                setUsers(users.map((u) => (u.id === savedUser.id ? savedUser : u)));
                toast.success('User updated successfully');
              } else {
                savedUser = await createUser(data as Omit<User, 'id' | 'createdAt' | 'updatedAt'>);
                setUsers([...users, savedUser]);
                toast.success('User created successfully');
              }
              handleModalClose();
            } catch {
              toast.error('Failed to save user');
            }
          }}
        />
      )}
    </div>
  );
};
