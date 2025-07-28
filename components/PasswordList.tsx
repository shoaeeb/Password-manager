'use client';

import { useState } from 'react';
import { PasswordEntry } from '@/types';
import { usePasswords } from '@/hooks/usePasswords';
import { useAuth } from './AuthProvider';
import { Eye, EyeOff, Copy, Edit, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface PasswordListProps {
  passwords: PasswordEntry[];
  onEdit: (password: PasswordEntry) => void;
  onDelete: (id: string) => void;
}

export const PasswordList = ({ passwords, onEdit, onDelete }: PasswordListProps) => {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const { token } = useAuth();
  const masterPassword = typeof window !== 'undefined' ? localStorage.getItem('masterPassword') : null;
  const { decryptPassword } = usePasswords(token, masterPassword);

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePasswords(newVisible);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (passwords.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">No passwords found</div>
        <p className="text-gray-500 mt-2">Add your first password to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {passwords.map((password) => {
        const decryptedData = decryptPassword(password.encryptedData);
        const isVisible = visiblePasswords.has(password._id);

        return (
          <div key={password._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{password.title}</h3>
                  {password.category && (
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                      {password.category}
                    </span>
                  )}
                </div>

                {decryptedData && (
                  <div className="space-y-3">
                    {decryptedData.username && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 w-20">Username:</span>
                        <span className="text-sm text-gray-900">{decryptedData.username}</span>
                        <button
                          onClick={() => copyToClipboard(decryptedData.username, 'Username')}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 w-20">Password:</span>
                      <span className="text-sm text-gray-900 font-mono">
                        {isVisible ? decryptedData.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(password._id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(decryptedData.password, 'Password')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>

                    {decryptedData.url && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 w-20">URL:</span>
                        <a
                          href={decryptedData.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-800 flex items-center space-x-1"
                        >
                          <span>{decryptedData.url}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                    {decryptedData.notes && (
                      <div className="flex items-start space-x-2">
                        <span className="text-sm text-gray-500 w-20">Notes:</span>
                        <span className="text-sm text-gray-900">{decryptedData.notes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onEdit(password)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(password._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-400">
              Updated {new Date(password.updatedAt).toLocaleDateString()}
            </div>
          </div>
        );
      })}
    </div>
  );
};