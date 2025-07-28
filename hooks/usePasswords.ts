import { useState, useEffect } from 'react';
import { PasswordEntry, DecryptedPasswordData } from '@/types';
import { encryptData, decryptData } from '@/lib/crypto';

export const usePasswords = (token: string | null, masterPassword: string | null) => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPasswords = async (category?: string, search?: string) => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/passwords?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch passwords');
      }

      setPasswords(data.passwords);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const savePassword = async (passwordData: DecryptedPasswordData & { title: string; category?: string }) => {
    if (!token || !masterPassword) throw new Error('Not authenticated');

    const { title, category, ...dataToEncrypt } = passwordData;
    const encryptedData = encryptData(dataToEncrypt, masterPassword);

    const response = await fetch('/api/passwords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, encryptedData, category }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save password');
    }

    await fetchPasswords();
    return data.password;
  };

  const updatePassword = async (id: string, passwordData: DecryptedPasswordData & { title: string; category?: string }) => {
    if (!token || !masterPassword) throw new Error('Not authenticated');

    const { title, category, ...dataToEncrypt } = passwordData;
    const encryptedData = encryptData(dataToEncrypt, masterPassword);

    const response = await fetch(`/api/passwords/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, encryptedData, category }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update password');
    }

    await fetchPasswords();
    return data.password;
  };

  const deletePassword = async (id: string) => {
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`/api/passwords/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete password');
    }

    await fetchPasswords();
  };

  const decryptPassword = (encryptedData: string): DecryptedPasswordData | null => {
    if (!masterPassword) return null;
    
    try {
      return decryptData(encryptedData, masterPassword);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      fetchPasswords();
    }
  }, [token]);

  return {
    passwords,
    isLoading,
    error,
    fetchPasswords,
    savePassword,
    updatePassword,
    deletePassword,
    decryptPassword,
  };
};