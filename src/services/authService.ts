import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, MFASetupResult, MFAVerificationResult } from '../types';

class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // Initialize reCAPTCHA verifier
  private initializeRecaptcha(containerId: string = 'recaptcha-container'): RecaptchaVerifier {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
    }

    this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });

    return this.recaptchaVerifier;
  }

  // Sign up with email and password
  async signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, { displayName: name });

      // Send email verification
      await sendEmailVerification(user);

      // Create user document in Firestore
      const userData: User = {
        id: user.uid,
        email: user.email!,
        name: name,
        role: 'user',
        mfaEnabled: false,
        mfaVerified: false,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        createdAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ success: boolean; mfaRequired?: boolean; error?: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user has MFA enabled
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data() as User;

      if (userData?.mfaEnabled) {
        // User has MFA enabled, require MFA verification
        return { success: true, mfaRequired: true };
      }

      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp(),
      });

      return { success: true, mfaRequired: false };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Setup MFA for current user
  async setupMFA(phoneNumber: string): Promise<MFASetupResult> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Initialize reCAPTCHA
      const recaptchaVerifier = this.initializeRecaptcha();

      // Get the multi-factor session
      const multiFactorSession = await multiFactor(user).getSession();

      // Create phone auth provider
      const phoneAuthProvider = new PhoneAuthProvider(auth);

      // Send SMS verification code
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier
      );

      // Update user document with phone number
      await updateDoc(doc(db, 'users', user.uid), {
        phoneNumber: phoneNumber,
        mfaEnabled: true,
      });

      return {
        success: true,
        verificationId,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Verify MFA code
  async verifyMFA(verificationId: string, code: string): Promise<MFAVerificationResult> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Create phone credential
      const phoneCredential = PhoneAuthProvider.credential(verificationId, code);

      // Get the multi-factor session
      const multiFactorSession = await multiFactor(user).getSession();

      // Enroll the second factor
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneCredential);
      await multiFactor(user).enroll(multiFactorAssertion, 'Phone Number');

      // Update user document
      await updateDoc(doc(db, 'users', user.uid), {
        mfaVerified: true,
        lastLogin: serverTimestamp(),
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Verify MFA during sign in (simplified approach)
  async verifyMFAForSignIn(verificationId: string, code: string): Promise<MFAVerificationResult> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // For now, we'll just verify the code and update the user state
      // In a real implementation, you'd verify the SMS code here
      // This is a simplified version for demonstration
      
      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp(),
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Send MFA verification code for sign in
  async sendMFAVerificationCode(phoneNumber: string): Promise<{ success: boolean; verificationId?: string; error?: string }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Initialize reCAPTCHA
      const recaptchaVerifier = this.initializeRecaptcha();

      // Get the multi-factor session
      const multiFactorSession = await multiFactor(user).getSession();

      // Create phone auth provider
      const phoneAuthProvider = new PhoneAuthProvider(auth);

      // Send SMS verification code
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier
      );

      return {
        success: true,
        verificationId,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Disable MFA
  async disableMFA(): Promise<{ success: boolean; error?: string }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Get enrolled factors
      const enrolledFactors = multiFactor(user).enrolledFactors;

      // Unenroll all factors
      for (const factor of enrolledFactors) {
        await multiFactor(user).unenroll(factor);
      }

      // Update user document
      await updateDoc(doc(db, 'users', user.uid), {
        mfaEnabled: false,
        mfaVerified: false,
        phoneNumber: null,
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  // Get current user data from Firestore
  async getCurrentUserData(): Promise<User | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Get current Firebase user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Clean up reCAPTCHA
  cleanupRecaptcha(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }
}

export const authService = new AuthService();
export default authService;