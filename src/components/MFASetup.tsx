import React, { useState, useEffect } from 'react';
import { Shield, Phone, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import { MFASetupResult } from '../types';

interface MFASetupProps {
  onSetupComplete: () => void;
  onBack: () => void;
}

const MFASetup: React.FC<MFASetupProps> = ({ onSetupComplete, onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationId, setVerificationId] = useState('');

  useEffect(() => {
    // Clean up reCAPTCHA when component unmounts
    return () => {
      authService.cleanupRecaptcha();
    };
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result: MFASetupResult = await authService.setupMFA(phoneNumber);
      
      if (result.success && result.verificationId) {
        setVerificationId(result.verificationId);
        setStep('verify');
      } else {
        setError(result.error || 'Failed to send verification code');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.verifyMFA(verificationId, verificationCode);
      
      if (result.success) {
        onSetupComplete();
      } else {
        setError(result.error || 'Invalid verification code');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as +1 (XXX) XXX-XXXX
    if (phoneNumber.length >= 10) {
      return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
    return phoneNumber;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  if (step === 'phone') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-md w-full space-y-8 p-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Enable Two-Factor Authentication
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Add an extra layer of security to your account
            </p>
          </div>

          {/* Phone Number Form */}
          <form className="mt-8 space-y-6" onSubmit={handlePhoneSubmit}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="input-field pl-10"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                We'll send a verification code to this number
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="ml-2 text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

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
                disabled={isLoading || !phoneNumber}
                className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Code'
                )}
              </button>
            </div>
          </form>

          {/* reCAPTCHA container */}
          <div id="recaptcha-container"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Verify Your Phone Number
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

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setStep('phone')}
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
                'Verify & Enable'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MFASetup;
