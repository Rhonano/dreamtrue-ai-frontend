import React, { useState } from 'react';
import { Building2, Globe, MapPin, Briefcase, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompanyData } from '../types';

const CompanyForm: React.FC = () => {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState<CompanyData>({
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
      // Create a new report
      const newReport = {
        id: Date.now().toString(),
        companyData: formData,
        status: 'processing' as const,
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_REPORT', payload: newReport });
      dispatch({ type: 'SET_CURRENT_REPORT', payload: newReport });
      dispatch({ type: 'SET_LOADING', payload: true });

      // TODO: Replace with actual API call to your backend
      // Simulate API call
      setTimeout(() => {
        const completedReport = {
          ...newReport,
          status: 'completed' as const,
          completedAt: new Date().toISOString(),
          playbookHtml: '<div class="p-8"><h1 class="text-3xl font-bold mb-4">Sample Strategy Playbook</h1><p class="text-lg">This is a sample playbook. In the real implementation, this would contain the HTML with embedded SVGs from your backend.</p></div>',
        };
        
        dispatch({ type: 'UPDATE_REPORT', payload: completedReport });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 5000); // 5 seconds for demo

    } catch (err) {
      setError('Failed to submit analysis request. Please try again.');
      dispatch({ type: 'SET_LOADING', payload: false });
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
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Company Analysis Request
          </h2>
          <p className="text-gray-600">
            Tell us about the company you'd like to analyze
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name - Required */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                required
                className="input-field pl-10"
                placeholder="Enter company name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Company URL - Optional */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Company Website (Optional)
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                id="url"
                name="url"
                className="input-field pl-10"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Company Location - Optional */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Company Location (Optional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="location"
                name="location"
                className="input-field pl-10"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Industry - Optional */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
              Industry (Optional)
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="industry"
                name="industry"
                className="input-field pl-10"
                placeholder="e.g., Technology, Healthcare, Finance"
                value={formData.industry}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !formData.name.trim()}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Send className="h-5 w-5 mr-2" />
                Generate Analysis
              </div>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>What happens next?</strong> Our AI will analyze the company data and generate a comprehensive market analysis and strategy playbook. This typically takes 2-3 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
