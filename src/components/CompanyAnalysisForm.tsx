import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface CompanyAnalysisFormProps {
  onLogout: () => void;
  onSubmit: (companyData: { name: string; url?: string; location?: string; industry?: string }) => void;
  onBack?: () => void;
}

const CompanyAnalysisForm: React.FC<CompanyAnalysisFormProps> = ({ onLogout, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    location: '',
    industry: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Company name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // TODO: Replace with actual API call to your backend
      console.log('Submitting company data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to loading screen with company data
      onSubmit({
        name: formData.name,
        url: formData.url || undefined,
        location: formData.location || undefined,
        industry: formData.industry || undefined
      });
      
    } catch (err) {
      setError('Failed to submit analysis request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-dark-800 dark:border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {onBack && (
                <button
                  onClick={onBack}
                  className="mr-4 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">DT</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">DreamTrue AI</span>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="card">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">🏢</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Company Analysis Request
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Tell us about the company you'd like to analyze
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name - Required */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="input-field"
                placeholder="Enter company name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Company URL - Optional */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Website (Optional)
              </label>
              <input
                type="url"
                id="url"
                name="url"
                className="input-field"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleChange}
              />
            </div>

            {/* Company Location - Optional */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Location (Optional)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="input-field"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Industry - Optional */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry (Optional)
              </label>
              <input
                type="text"
                id="industry"
                name="industry"
                className="input-field"
                placeholder="e.g., Technology, Healthcare, Finance"
                value={formData.industry}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Generate Analysis'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg dark:bg-primary-900/20 dark:border-primary-600/30">
            <p className="text-sm text-primary-700 dark:text-primary-200">
              <strong>What happens next?</strong> Our AI will analyze the company data and generate a comprehensive market analysis and strategy playbook. This typically takes 2-3 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalysisForm;
