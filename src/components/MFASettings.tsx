import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Settings, Trash2 } from 'lucide-react';
import { authService } from '../services/authService';
import { useApp } from '../context/AppContext';
import MFASetup from './MFASetup';

const MFASettings: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = state.user;

  const handleDisableMFA = async () => {
    if (!window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      return;
    }

    setIsDisabling(true);
    setError('');
    setSuccess('');

    try {
      const result = await authService.disableMFA();
      
      if (result.success) {
        setSuccess('Two-factor authentication has been disabled successfully.');
        // Update user state
        if (user) {
          dispatch({
            type: 'SET_USER',
            payload: {
              ...user,
              mfaEnabled: false,
              mfaVerified: false,
              phoneNumber: undefined,
            }
          });
        }
      } else {
        setError(result.error || 'Failed to disable two-factor authentication.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while disabling MFA.');
    } finally {
      setIsDisabling(false);
    }
  };

  const handleMFASetupComplete = () => {
    setShowMFASetup(false);
    setSuccess('Two-factor authentication has been enabled successfully!');
    // Refresh user data
    authService.getCurrentUserData().then(userData => {
      if (userData) {
        dispatch({ type: 'SET_USER', payload: userData });
      }
    });
  };

  const handleMFASetupBack = () => {
    setShowMFASetup(false);
  };

  if (showMFASetup) {
    return (
      <MFASetup
        onSetupComplete={handleMFASetupComplete}
        onBack={handleMFASetupBack}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 text-primary-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
        </div>

        {/* MFA Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${
                user?.mfaEnabled ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Shield className={`h-5 w-5 ${
                  user?.mfaEnabled ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">
                  {user?.mfaEnabled 
                    ? `Enabled for ${user.phoneNumber}` 
                    : 'Add an extra layer of security to your account'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {user?.mfaEnabled ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enabled
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Disabled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* MFA Actions */}
        <div className="space-y-4">
          {user?.mfaEnabled ? (
            <div className="flex space-x-4">
              <button
                onClick={handleDisableMFA}
                disabled={isDisabling}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDisabling ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Disable MFA
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowMFASetup(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Shield className="h-4 w-4 mr-2" />
              Enable Two-Factor Authentication
            </button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-2 text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="ml-2 text-sm text-green-600">{success}</p>
            </div>
          </div>
        )}

        {/* Security Information */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">About Two-Factor Authentication</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Adds an extra layer of security to your account</li>
            <li>• Requires a verification code sent to your phone</li>
            <li>• Protects against unauthorized access even if your password is compromised</li>
            <li>• Recommended for all accounts with sensitive data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MFASettings;
