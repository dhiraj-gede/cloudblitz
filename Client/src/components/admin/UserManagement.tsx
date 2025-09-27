import React, { useEffect, useState } from 'react';
import { useToast } from '../../hooks/useToast.ts';
import type { User } from '../../types/index.ts';
import { fetchUsers, deleteUser, createUser, updateUser } from '../../services/api.ts';
import { UserModal } from './UserModal.tsx';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
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

  return (
    <div className='space-y-8 max-w-6xl mx-auto p-4'>
      <div className='flex justify-between items-center bg-card rounded-xl shadow-md p-6 border border-[hsl(var(--border))]'>
        <h1 className='text-3xl font-extrabold tracking-tight text-foreground'>User Management</h1>
        <button
          className='inline-flex items-center justify-center rounded-lg text-base font-semibold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/80 shadow-md h-11 px-6 py-2'
          onClick={handleNewUser}
        >
          <span className='mr-2 text-lg'>+</span> New User
        </button>
      </div>
      <div className='bg-card rounded-xl shadow-lg p-8 border border-[hsl(var(--border))]'>
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Search users...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full px-3 py-2 border border-[hsl(var(--input))] rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>
        {loading ? (
          <div className='text-center text-muted-foreground py-12 text-lg animate-pulse'>
            Loading users...
          </div>
        ) : error ? (
          <div className='text-center text-destructive py-12 text-lg'>{error}</div>
        ) : (
          <table className='min-w-full divide-y divide-border'>
            <thead className='bg-muted'>
              <tr>
                <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  Role
                </th>
                <th className='px-4 py-3 relative'>
                  <span className='sr-only'>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className='bg-background divide-y divide-border'>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className='px-4 py-3 text-foreground'>{user.name}</td>
                  <td className='px-4 py-3 text-foreground'>{user.email}</td>
                  <td className='px-4 py-3 text-foreground'>{user.role}</td>
                  <td className='px-4 py-3 flex gap-2'>
                    <button
                      className='text-[hsl(var(--accent))] hover:underline'
                      onClick={() => handleViewUser(user)}
                    >
                      View
                    </button>
                    <button
                      className='text-[hsl(var(--primary))] hover:underline'
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className='text-[hsl(var(--destructive))] hover:underline'
                      onClick={() => handleDeleteUser(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
