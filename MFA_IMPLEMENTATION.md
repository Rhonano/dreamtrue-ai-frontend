# Multi-Factor Authentication (MFA) Implementation

This document describes the MFA implementation using Firebase Authentication for the DreamTrue AI dashboard.

## Overview

The MFA implementation provides an additional layer of security by requiring users to verify their identity using a phone number and SMS verification code in addition to their email and password.

## Features

- **Phone-based MFA**: Users can enable MFA using their phone number
- **SMS Verification**: Verification codes are sent via SMS
- **Optional MFA**: Users can choose to enable or disable MFA
- **Seamless Integration**: MFA integrates with the existing authentication flow
- **User-friendly Setup**: Step-by-step MFA setup process
- **Dashboard Settings**: Users can manage MFA settings from the dashboard

## Components

### 1. Authentication Service (`src/services/authService.ts`)
- Handles Firebase authentication operations
- Manages MFA setup and verification
- Provides methods for sign up, sign in, and MFA operations

### 2. MFA Setup Component (`src/components/MFASetup.tsx`)
- Guides users through the MFA setup process
- Phone number input and verification
- QR code generation (if needed)

### 3. MFA Verification Component (`src/components/MFAVerification.tsx`)
- Handles MFA verification during sign-in
- SMS code input and validation
- Resend code functionality

### 4. MFA Settings Component (`src/components/MFASettings.tsx`)
- Dashboard settings for MFA management
- Enable/disable MFA functionality
- View MFA status

### 5. Updated Login Form (`src/components/LoginForm.tsx`)
- Integrated with Firebase authentication
- Handles MFA flow during sign-in
- Sign up functionality with email verification

## Configuration

### Environment Variables

Add the following Firebase configuration to your `.env.local` file:

```env
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
```

### Firebase Project Setup

1. **Enable Authentication**: In your Firebase console, enable Email/Password and Phone authentication
2. **Configure Phone Auth**: Set up phone authentication with your preferred SMS provider
3. **Enable Multi-Factor Authentication**: Enable MFA in Firebase Authentication settings
4. **Configure reCAPTCHA**: Set up reCAPTCHA for phone verification

## User Flow

### Sign Up Flow
1. User enters name, email, and password
2. Account is created in Firebase
3. Email verification is sent
4. User can optionally enable MFA

### Sign In Flow (Without MFA)
1. User enters email and password
2. Authentication succeeds
3. User is redirected to dashboard

### Sign In Flow (With MFA)
1. User enters email and password
2. System detects MFA is enabled
3. SMS verification code is sent to user's phone
4. User enters verification code
5. Authentication completes
6. User is redirected to dashboard

### MFA Setup Flow
1. User navigates to Settings in dashboard
2. User clicks "Enable Two-Factor Authentication"
3. User enters phone number
4. SMS verification code is sent
5. User enters verification code
6. MFA is enabled for the account

## Security Considerations

- **Phone Number Validation**: Phone numbers are validated and formatted
- **Rate Limiting**: Firebase handles rate limiting for SMS sending
- **Secure Storage**: User data is stored securely in Firestore
- **Session Management**: Firebase handles secure session management
- **reCAPTCHA Protection**: Prevents automated abuse of phone verification

## Dependencies

- `firebase`: Firebase SDK for authentication and Firestore
- `@firebase/auth`: Firebase Authentication module
- `lucide-react`: Icons for the UI components

## Usage

### Enabling MFA
```typescript
import { authService } from './services/authService';

// Setup MFA for current user
const result = await authService.setupMFA('+1234567890');
if (result.success) {
  // Show verification code input
}
```

### Verifying MFA
```typescript
// Verify MFA code
const result = await authService.verifyMFA(verificationId, code);
if (result.success) {
  // MFA verification successful
}
```

### Disabling MFA
```typescript
// Disable MFA for current user
const result = await authService.disableMFA();
if (result.success) {
  // MFA disabled successfully
}
```

## Testing

### Demo Credentials
For testing purposes, you can use the demo credentials:
- Email: `demo@dreamtrue.ai`
- Password: `demo123`

### Firebase Emulator
For development, you can use Firebase emulators:
```env
REACT_APP_USE_FIREBASE_EMULATOR=true
```

## Troubleshooting

### Common Issues

1. **reCAPTCHA not loading**: Ensure the reCAPTCHA container div exists in the DOM
2. **SMS not received**: Check phone number format and Firebase phone auth configuration
3. **MFA verification fails**: Ensure the verification code is entered correctly and hasn't expired

### Error Handling

The implementation includes comprehensive error handling for:
- Network connectivity issues
- Invalid phone numbers
- Expired verification codes
- Firebase authentication errors
- User permission issues

## Future Enhancements

- **TOTP Support**: Add support for authenticator apps (Google Authenticator, Authy)
- **Backup Codes**: Generate backup codes for account recovery
- **Multiple Phone Numbers**: Allow users to add multiple phone numbers
- **Admin Controls**: Allow administrators to enforce MFA for all users
- **Audit Logging**: Log MFA events for security monitoring
