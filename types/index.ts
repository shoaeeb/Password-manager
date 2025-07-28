export interface User {
  _id: string;
  email: string;
  masterPasswordHash: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordEntry {
  _id: string;
  userId: string;
  title: string;
  encryptedData: string; // Contains encrypted username, password, url, notes
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface DecryptedPasswordData {
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}