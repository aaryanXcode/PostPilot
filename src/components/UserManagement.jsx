import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Shield,
  User,
  Mail,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../Services/UserService';

const UserManagement = () => {
  const { token, role } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deletingUsers, setDeletingUsers] = useState(new Set());
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    userId: null,
    username: '',
    isBatch: false,
    count: 0
  });
  const [userDialog, setUserDialog] = useState({
    isOpen: false,
    mode: 'create', // 'create' or 'edit'
    userId: null,
    userData: {
      username: '',
      email: '',
      password: '',
      role: 'USER'
    }
  });

  // Check if user has SUPER_ADMIN role
  const isSuperAdmin = role === 'SUPER_ADMIN';

  useEffect(() => {
    if (!isSuperAdmin) {
      setError('Access denied. Super admin privileges required.');
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getAllUsers(token);
        
        if (result.error) {
          setError(result.error);
          // Fallback to mock data if API fails
          const mockUsers = [
            {
              id: 1,
              username: 'john_doe',
              email: 'john@example.com',
              role: 'USER',
              createdAt: '2024-01-15T10:30:00Z',
              isActive: true
            },
            {
              id: 2,
              username: 'jane_smith',
              email: 'jane@example.com',
              role: 'ADMIN',
              createdAt: '2024-01-14T14:20:00Z',
              isActive: true
            },
            {
              id: 3,
              username: 'admin_user',
              email: 'admin@example.com',
              role: 'SUPER_ADMIN',
              createdAt: '2024-01-13T09:15:00Z',
              isActive: true
            }
          ];
          setUsers(mockUsers);
        } else {
          setUsers(result);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, isSuperAdmin]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateUser = () => {
    setUserDialog({
      isOpen: true,
      mode: 'create',
      userId: null,
      userData: {
        username: '',
        email: '',
        password: '',
        role: 'USER'
      }
    });
  };

  const handleEditUser = (user) => {
    setUserDialog({
      isOpen: true,
      mode: 'edit',
      userId: user.id,
      userData: {
        username: user.username,
        email: user.email,
        password: '', // Don't pre-fill password
        role: user.role
      }
    });
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setDeleteDialog({
      isOpen: true,
      userId: userId,
      username: user?.username || 'this user',
      isBatch: false,
      count: 1
    });
  };

  const handleBatchDelete = () => {
    setDeleteDialog({
      isOpen: true,
      userId: null,
      username: 'selected users',
      isBatch: true,
      count: selectedUsers.length
    });
  };

  const confirmDelete = async () => {
    const { userId, isBatch } = deleteDialog;
    
    try {
      if (isBatch) {
        // Batch delete
        setDeletingUsers(prev => new Set([...prev, ...selectedUsers]));
        
        for (const id of selectedUsers) {
          const result = await deleteUser(token, id);
          if (result.error) {
            console.error('Batch delete failed for user:', id, result.error);
            alert(`Failed to delete user ${id}. Please try again.`);
            return;
          }
        }
        
        setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
        console.log('Users deleted successfully');
      } else {
        // Single delete
        setDeletingUsers(prev => new Set([...prev, userId]));
        
        const result = await deleteUser(token, userId);
        if (result.error) {
          console.error('Delete failed:', result.error);
          alert('Failed to delete user. Please try again.');
          return;
        }
        
        setUsers(prev => prev.filter(user => user.id !== userId));
        setSelectedUsers(prev => prev.filter(id => id !== userId));
        console.log('User deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting user(s):', error);
      alert('Error deleting user(s). Please try again.');
    } finally {
      // Remove from deleting set
      if (isBatch) {
        setDeletingUsers(prev => {
          const newSet = new Set(prev);
          selectedUsers.forEach(id => newSet.delete(id));
          return newSet;
        });
      } else {
        setDeletingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
    }
    
    // Close dialog
    setDeleteDialog({
      isOpen: false,
      userId: null,
      username: '',
      isBatch: false,
      count: 0
    });
  };

  const handleSaveUser = async () => {
    const { mode, userId, userData } = userDialog;
    
    try {
      let result;
      if (mode === 'create') {
        result = await createUser(token, userData);
      } else {
        // For update, only send fields that have changed
        const updateData = {};
        if (userData.username) updateData.username = userData.username;
        if (userData.email) updateData.email = userData.email;
        if (userData.password) updateData.password = userData.password;
        if (userData.role) updateData.role = userData.role;
        
        result = await updateUser(token, userId, updateData);
      }
      
      if (result.error) {
        alert(`Failed to ${mode} user: ${result.error}`);
        return;
      }
      
      // Update the users list
      if (mode === 'create') {
        setUsers(prev => [result, ...prev]);
      } else {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, ...result } : user
        ));
      }
      
      // Close dialog
      setUserDialog({
        isOpen: false,
        mode: 'create',
        userId: null,
        userData: {
          username: '',
          email: '',
          password: '',
          role: 'USER'
        }
      });
      
      console.log(`User ${mode}d successfully`);
    } catch (error) {
      console.error(`Error ${mode}ing user:`, error);
      alert(`Error ${mode}ing user. Please try again.`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'USER':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="min-h-full bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You need super admin privileges to access user management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 animate-pulse delay-200">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
        </div>
        <div className="absolute bottom-20 left-10 animate-pulse delay-400">
          <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg"></div>
        </div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage users and their permissions
              </p>
            </div>
            <Button 
              onClick={handleCreateUser}
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Batch Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBatchDelete}
                  disabled={selectedUsers.some(id => deletingUsers.has(id))}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <div className="w-5 h-5 text-red-600 dark:text-red-400 mr-3">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  API Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}. Showing fallback data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm ? 'Try adjusting your search terms' : 'No users available'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card 
                key={user.id} 
                className={`backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                  selectedUsers.includes(user.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleUserSelect(user.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {user.username}
                          </h3>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                          {user.isActive === false && (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(user.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditUser(user);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deletingUsers.has(user.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user.id);
                        }}
                      >
                        {deletingUsers.has(user.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Super Admins</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter(user => user.role === 'SUPER_ADMIN').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter(user => user.role === 'ADMIN').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Regular Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter(user => user.role === 'USER').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create/Edit User Dialog */}
        <Dialog open={userDialog.isOpen} onOpenChange={(open) => {
          if (!open) {
            setUserDialog({
              isOpen: false,
              mode: 'create',
              userId: null,
              userData: {
                username: '',
                email: '',
                password: '',
                role: 'USER'
              }
            });
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {userDialog.mode === 'create' ? 'Create New User' : 'Edit User'}
              </DialogTitle>
              <DialogDescription>
                {userDialog.mode === 'create' 
                  ? 'Add a new user to the system' 
                  : 'Update user information'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={userDialog.userData.username}
                  onChange={(e) => setUserDialog(prev => ({
                    ...prev,
                    userData: { ...prev.userData, username: e.target.value }
                  }))}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userDialog.userData.email}
                  onChange={(e) => setUserDialog(prev => ({
                    ...prev,
                    userData: { ...prev.userData, email: e.target.value }
                  }))}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={userDialog.userData.password}
                  onChange={(e) => setUserDialog(prev => ({
                    ...prev,
                    userData: { ...prev.userData, password: e.target.value }
                  }))}
                  placeholder={userDialog.mode === 'edit' ? 'Leave blank to keep current password' : 'Enter password'}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={userDialog.userData.role} 
                  onValueChange={(value) => setUserDialog(prev => ({
                    ...prev,
                    userData: { ...prev.userData, role: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setUserDialog({
                  isOpen: false,
                  mode: 'create',
                  userId: null,
                  userData: {
                    username: '',
                    email: '',
                    password: '',
                    role: 'USER'
                  }
                })}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveUser}>
                {userDialog.mode === 'create' ? 'Create User' : 'Update User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => {
          if (!open) {
            setDeleteDialog({
              isOpen: false,
              userId: null,
              username: '',
              isBatch: false,
              count: 0
            });
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Delete {deleteDialog.isBatch ? 'Users' : 'User'}
              </DialogTitle>
              <DialogDescription>
                {deleteDialog.isBatch ? (
                  <>
                    Are you sure you want to delete <strong>{deleteDialog.count} selected user{deleteDialog.count > 1 ? 's' : ''}</strong>? 
                    <br />
                    This action cannot be undone.
                  </>
                ) : (
                  <>
                    Are you sure you want to delete <strong>"{deleteDialog.username}"</strong>? 
                    <br />
                    This action cannot be undone.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({
                  isOpen: false,
                  userId: null,
                  username: '',
                  isBatch: false,
                  count: 0
                })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteDialog.isBatch ? 
                  selectedUsers.some(id => deletingUsers.has(id)) : 
                  deletingUsers.has(deleteDialog.userId)
                }
              >
                {deleteDialog.isBatch ? 
                  (selectedUsers.some(id => deletingUsers.has(id)) ? 'Deleting...' : 'Delete All') :
                  (deletingUsers.has(deleteDialog.userId) ? 'Deleting...' : 'Delete')
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserManagement;
