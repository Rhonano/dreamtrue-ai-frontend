import React, { useState, useEffect } from 'react';
import { Shield, Phone, CheckCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { authService } from '../services/authService';

interface MFAVerificationProps {
  phoneNumber: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

const MFAVerification: React.FC<MFAVerificationProps> = ({ 
  phoneNumber, 
  onVerificationComplete, 
  onBack 
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Send initial verification code
    sendVerificationCode();
    
    // Clean up reCAPTCHA when component unmounts
    return () => {
      authService.cleanupRecaptcha();
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendVerificationCode = async () => {
    setIsResending(true);
    setError('');

    try {
      const result = await authService.sendMFAVerificationCode(phoneNumber);
      
      if (result.success && result.verificationId) {
        setVerificationId(result.verificationId);
        setCountdown(60); // 60 second cooldown
      } else {
        setError(result.error || 'Failed to send verification code');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.verifyMFAForSignIn(verificationId, verificationCode);
      
      if (result.success) {
        onVerificationComplete();
      } else {
        setError(result.error || 'Invalid verification code');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    await sendVerificationCode();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to {phoneNumber}
          </p>
        </div>

        {/* Verification Form */}
        <form className="mt-8 space-y-6" onSubmit={handleVerificationSubmit}>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              maxLength={6}
              className="input-field mt-1 text-center text-2xl tracking-widest"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              autoComplete="one-time-code"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-2 text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Resend Code */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={countdown > 0 || isResending}
              className="text-sm text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                  Sending...
                </div>
              ) : countdown > 0 ? (
                `Resend code in ${countdown}s`
              ) : (
                'Resend verification code'
              )}
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 inline mr-2" />
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify
                </div>
              )}
            </button>
          </div>
        </form>

        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default MFAVerification;
