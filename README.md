# Secure Password Manager

A secure, zero-knowledge password manager built with Next.js 14, MongoDB, and client-side encryption.

## 🔐 Security Features

- **Zero-Knowledge Architecture**: Server never sees unencrypted passwords
- **Client-Side Encryption**: AES-256 encryption using crypto-js
- **Secure Master Password**: Bcrypt hashing with salt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Zod schema validation for all inputs
- **Password Strength Checker**: Real-time password strength analysis

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom JWT implementation
- **Encryption**: crypto-js (AES-256)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd password-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/password-manager
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000
   
   # PayPal Configuration
   PAYPAL_CLIENT_ID=your-paypal-client-id
   PAYPAL_CLIENT_SECRET=your-paypal-client-secret
   PAYPAL_ENVIRONMENT=sandbox
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   └── passwords/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AuthProvider.tsx
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── PasswordList.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── usePasswords.ts
│   └── usePasswordGenerator.ts
├── lib/
│   ├── models/
│   │   ├── User.ts
│   │   ├── Password.ts
│   │   └── Category.ts
│   ├── auth.ts
│   ├── crypto.ts
│   ├── middleware.ts
│   ├── mongodb.ts
│   └── validation.ts
└── types/
    └── index.ts
```

## 🔒 Security Implementation

### Client-Side Encryption
- All sensitive data is encrypted on the client before sending to server
- Uses AES-256 encryption with PBKDF2 key derivation
- Master password never leaves the client in plain text

### Master Password Security
- Hashed using bcrypt with salt before storage
- Salt is unique per user and stored separately
- Server only stores the hash, never the plain password

### Zero-Knowledge Architecture
- Server cannot decrypt user passwords
- All encryption/decryption happens client-side
- Even database administrators cannot access user passwords

### Authentication
- JWT tokens for session management
- Tokens expire after 7 days
- Secure token verification on all protected routes

## 🚨 Security Considerations

### Potential Vulnerabilities
1. **Client-Side Storage**: Master password temporarily stored in localStorage
2. **XSS Attacks**: Could expose master password if malicious scripts execute
3. **Memory Dumps**: Passwords visible in browser memory while decrypted
4. **HTTPS Required**: All communication must be over HTTPS in production

### Mitigation Strategies
1. **Content Security Policy**: Implement strict CSP headers
2. **Regular Security Audits**: Monitor for vulnerabilities
3. **Secure Headers**: Implement security headers (HSTS, etc.)
4. **Input Sanitization**: All inputs validated and sanitized
5. **Rate Limiting**: Implement rate limiting on authentication endpoints

## 🔧 Configuration

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `NEXTAUTH_SECRET`: Secret for NextAuth.js (if used)
- `NEXTAUTH_URL`: Application URL
- `PAYPAL_CLIENT_ID`: PayPal client ID for subscriptions
- `PAYPAL_CLIENT_SECRET`: PayPal client secret
- `PAYPAL_ENVIRONMENT`: PayPal environment (sandbox/live)
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: Public PayPal client ID for frontend

### Database Indexes
The application creates the following indexes for performance:
- Users: `email` (unique)
- Passwords: `userId`, `userId + category`, `userId + title` (text search)
- Categories: `userId + name` (unique compound)

## 📱 Features

### Core Features
- ✅ User registration and authentication
- ✅ Secure password storage with encryption
- ✅ Password generator with customizable options
- ✅ CRUD operations for password entries
- ✅ Search and filter functionality
- ✅ Categories for organizing passwords
- ✅ Master password verification
- ✅ Copy to clipboard functionality
- ✅ Password visibility toggle
- ✅ **PayPal subscription integration ($3/month)**
- ✅ **Beautiful conversion-optimized landing page**
- ✅ **Free tier (25 passwords) vs Pro tier (unlimited)**
- ✅ **Subscription management dashboard**
- ✅ **SEO optimization with structured data**
- ✅ **Payment success/failure handling**

### Planned Features
- 🔄 Import/Export functionality
- 🔄 Two-factor authentication
- 🔄 Password sharing (encrypted)
- 🔄 Audit logs
- 🔄 Mobile app
- 🔄 Browser extension

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

## 🚀 Deployment

### Production Checklist
1. **Environment Variables**: Set secure production values
2. **HTTPS**: Ensure HTTPS is enabled
3. **Database**: Use MongoDB Atlas or secure MongoDB instance
4. **Secrets**: Generate strong, unique secrets
5. **CSP Headers**: Implement Content Security Policy
6. **Rate Limiting**: Add rate limiting middleware
7. **Monitoring**: Set up error monitoring and logging

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This is a demonstration project. While it implements security best practices, it should be thoroughly audited before use in production environments. The developers are not responsible for any security breaches or data loss.