# JWT Role-Based Authentication Implementation

This document describes the complete JWT-based role authentication system implemented in this Angular 20 project.

## 🚀 Features Implemented

### ✅ Core Authentication Components

1. **JWT Service** (`src/app/Core/services/jwt.service.ts`)
   - Token management (get, set, remove)
   - Token decoding using `@auth0/angular-jwt`
   - Role extraction and validation
   - Token expiration checking
   - User information extraction

2. **Auth Guard** (`src/app/Core/guards/auth-guard.ts`)
   - Route protection based on authentication status
   - Role-based access control
   - Automatic redirects for unauthorized users
   - Integration with JWT service

3. **HTTP Interceptor** (`src/app/Core/interceptors/interceptors/auth-interceptor.ts`)
   - Automatic token attachment to HTTP requests
   - Error handling for 401/403 responses
   - Automatic logout on token expiration

4. **Unauthorized Component** (`src/app/Shared/components/unauthorized/unauthorized.component.ts`)
   - User-friendly unauthorized access page
   - Role-based navigation options
   - Modern, responsive design

### ✅ Authentication Flow

1. **Login Process**
   - User enters credentials → OTP verification → JWT token received
   - Token stored securely in localStorage
   - Role-based redirection after successful authentication

2. **Role-Based Redirection**
   - **Admin** → `/admin/dashboard`
   - **Instructor** → `/instructor/dashboard`
   - **Student** → `/home`

3. **Route Protection**
   - All protected routes require valid JWT token
   - Role-specific access control
   - Automatic redirect to login if unauthenticated
   - Redirect to unauthorized page if insufficient permissions

## 🛡️ Route Configuration

### Protected Routes with Role Requirements

```typescript
// Admin-only routes
{
  path: 'admin',
  canActivate: [authGuard],
  data: { roles: ['Admin'] },
  loadChildren: () => import('./Features/Admin/admin.routes').then(m => m.adminRoutes)
}

// Instructor-only routes
{
  path: 'instructor',
  canActivate: [authGuard],
  data: { roles: ['Instructor'] },
  loadChildren: () => import('./Features/Instructor/instructor.routes').then(m => m.routes)
}

// Multi-role routes (Student, Instructor, Admin)
{
  path: 'home',
  canActivate: [authGuard],
  data: { roles: ['Student', 'Instructor', 'Admin'] },
  loadChildren: () => import('./Features/Home/home.routes').then(m => m.homeRoutes)
}
```

### Public Routes (No Authentication Required)

- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/otp-verification` - OTP verification
- `/unauthorized` - Unauthorized access page

## 🔧 JWT Token Structure

The system expects JWT tokens with the following payload structure:

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "Admin|Instructor|Student",
  "exp": 1234567890,
  "iat": 1234567890
}
```

## 📱 Usage Examples

### Using JWT Service

```typescript
import { JwtService } from './Core/services/jwt.service';

constructor(private jwtService: JwtService) {}

// Check if user is authenticated
if (this.jwtService.isAuthenticated()) {
  // User is logged in with valid token
}

// Get user role
const userRole = this.jwtService.getUserRole();

// Check specific role
if (this.jwtService.hasRole('Admin')) {
  // User is an admin
}

// Check multiple roles
if (this.jwtService.hasAnyRole(['Instructor', 'Admin'])) {
  // User is either instructor or admin
}
```

### Using Auth Service (Enhanced)

```typescript
import { AuthService } from './Features/Auth/services/auth.service';

constructor(private authService: AuthService) {}

// After successful OTP verification, the service automatically:
// 1. Stores the JWT token
// 2. Decodes the token to get user role
// 3. Redirects based on role
```

## 🧪 Testing the Implementation

### Test Service Available

A test service (`src/app/Core/services/auth-test.service.ts`) is provided for testing different roles:

```typescript
import { AuthTestService } from './Core/services/auth-test.service';

// Login as different roles for testing
authTestService.loginAsAdmin();
authTestService.loginAsInstructor();
authTestService.loginAsStudent();

// Check current status
const status = authTestService.getAuthStatus();
console.log(status);
```

### Manual Testing Steps

1. **Test Unauthenticated Access**
   - Navigate to `/admin/dashboard` without token
   - Should redirect to `/auth/login`

2. **Test Role-Based Access**
   - Login as Student, try to access `/admin/dashboard`
   - Should redirect to `/unauthorized`

3. **Test Successful Authentication**
   - Complete login flow with valid credentials
   - Should redirect to appropriate dashboard based on role

4. **Test Token Expiration**
   - Use expired token
   - Should automatically logout and redirect to login

## 🔒 Security Features

### Token Security
- Tokens stored in localStorage (consider httpOnly cookies for production)
- Automatic token expiration checking
- Secure token validation using `@auth0/angular-jwt`

### Route Protection
- Guard prevents access to protected routes without valid token
- Role-based access control at route level
- Automatic cleanup on authentication failure

### HTTP Security
- Automatic token attachment to API requests
- Error handling for authentication failures
- Automatic logout on 401/403 responses

## 🚀 Deployment Considerations

### Environment Configuration
- Update API URLs in `auth.service.ts` for different environments
- Configure token expiration times based on security requirements

### Production Security
- Consider using httpOnly cookies instead of localStorage
- Implement refresh token mechanism
- Add CSRF protection
- Use HTTPS in production

### Performance
- Lazy loading implemented for all feature modules
- Guards are lightweight and efficient
- JWT decoding is cached where possible

## 📋 Dependencies Added

```json
{
  "@auth0/angular-jwt": "^5.x.x"
}
```

## 🔄 Integration with Existing Code

The implementation integrates seamlessly with the existing codebase:

- ✅ Preserves existing auth service functionality
- ✅ Enhances existing HTTP interceptor
- ✅ Works with existing feature modules
- ✅ Maintains existing routing structure
- ✅ Compatible with existing UI components

## 🐛 Troubleshooting

### Common Issues

1. **Token not being attached to requests**
   - Check if interceptor is properly configured in `app.config.ts`
   - Verify token exists in localStorage

2. **Redirects not working**
   - Check route configuration in `app.routes.ts`
   - Verify guard is applied to protected routes

3. **Role-based access not working**
   - Verify JWT token contains correct role claim
   - Check role names match exactly (case-sensitive)

### Debug Tips

```typescript
// Check current authentication status
console.log('Is authenticated:', jwtService.isAuthenticated());
console.log('User role:', jwtService.getUserRole());
console.log('Token expired:', jwtService.isTokenExpired());
console.log('Decoded token:', jwtService.decodeToken());
```

## 🎯 Next Steps

### Recommended Enhancements

1. **Refresh Token Implementation**
   - Add automatic token refresh
   - Handle token renewal seamlessly

2. **Enhanced Security**
   - Implement httpOnly cookies
   - Add CSRF protection
   - Implement rate limiting

3. **User Experience**
   - Add loading states during authentication
   - Implement remember me functionality
   - Add session timeout warnings

4. **Monitoring**
   - Add authentication analytics
   - Implement security event logging
   - Monitor failed authentication attempts

---

**Implementation Status: ✅ Complete**

All requirements have been successfully implemented and tested. The system provides robust JWT-based authentication with role-based access control, automatic redirects, and comprehensive security features.