'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { usePasswords } from '@/hooks/usePasswords';
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator';
import { PasswordList } from '@/components/PasswordList';
import { SubscriptionWidget } from '@/components/SubscriptionWidget';
import { PasswordEntry, DecryptedPasswordData } from '@/types';
import { Plus, Search, LogOut, Key, Filter, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { token } = useAuth();
  const masterPassword = typeof window !== 'undefined' ? localStorage.getItem('masterPassword') : null;
  const { passwords, isLoading, fetchPasswords, savePassword, updatePassword, deletePassword } = usePasswords(token, masterPassword);
  const { generatePassword } = usePasswordGenerator();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    category: 'General',
  });
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const categories = ['General', 'Work', 'Personal', 'Finance', 'Social'];
  
  useEffect(() => {
    fetchSubscriptionStatus();
  }, [token]);
  
  const fetchSubscriptionStatus = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/subscription/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    }
  };
  
  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || password.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check subscription limits for new passwords
    if (!editingPassword && subscriptionData && !subscriptionData.canAddPasswords) {
      toast.error('Password limit reached. Upgrade to Pro for unlimited passwords.');
      return;
    }
    
    try {
      const passwordData = {
        title: formData.title,
        username: formData.username,
        password: formData.password,
        url: formData.url,
        notes: formData.notes,
        category: formData.category,
      };

      if (editingPassword) {
        await updatePassword(editingPassword._id, passwordData);
        toast.success('Password updated successfully');
      } else {
        await savePassword(passwordData);
        toast.success('Password saved successfully');
        setRefreshTrigger(prev => prev + 1); // Trigger refresh
      }

      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save password');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      username: '',
      password: '',
      url: '',
      notes: '',
      category: 'General',
    });
    setShowAddForm(false);
    setEditingPassword(null);
  };

  const handleEdit = (password: PasswordEntry) => {
    if (!masterPassword) return;
    
    try {
      const { decryptPassword } = usePasswords(token, masterPassword);
      const decryptedData = decryptPassword(password.encryptedData);
      
      if (decryptedData) {
        setFormData({
          title: password.title,
          username: decryptedData.username || '',
          password: decryptedData.password || '',
          url: decryptedData.url || '',
          notes: decryptedData.notes || '',
          category: password.category || 'General',
        });
        setEditingPassword(password);
        setShowAddForm(true);
      }
    } catch (error) {
      toast.error('Failed to decrypt password data');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this password?')) {
      try {
        await deletePassword(id);
        toast.success('Password deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete password');
      }
    }
  };

  const handleGeneratePassword = () => {
    try {
      const newPassword = generatePassword();
      setFormData(prev => ({ ...prev, password: newPassword }));
      toast.success('Password generated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Key className="h-8 w-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">Password Manager</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        {/* Subscription Widget */}
        <div className="mb-8">
          <SubscriptionWidget refreshTrigger={refreshTrigger} />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              if (subscriptionData && !subscriptionData.canAddPasswords) {
                toast.error('Password limit reached. Upgrade to Pro for unlimited passwords.');
                return;
              }
              setShowAddForm(true);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              subscriptionData && !subscriptionData.canAddPasswords
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Add Password</span>
            {subscriptionData && !subscriptionData.isProUser && (
              <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full ml-2">
                {subscriptionData.passwordCount}/25
              </span>
            )}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-lg font-semibold mb-4">
                {editingPassword ? 'Edit Password' : 'Add New Password'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., Gmail Account"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username/Email
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="input-field"
                    placeholder="username or email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="input-field flex-1"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="input-field"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="input-field"
                    rows={3}
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    {editingPassword ? 'Update' : 'Save'} Password
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Password List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <PasswordList
            passwords={filteredPasswords}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}