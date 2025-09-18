import React, { useState, useEffect } from 'react';
import { Brain, Search, Target, TrendingUp, BarChart3, Users, ArrowLeft } from 'lucide-react';

interface AnalysisLoadingProps {
  companyName: string;
  onBack?: () => void;
}

const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ companyName, onBack }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  const loadingMessages = [
    "Summarizing 200 pages of research so you don't have to.",
    "Spying on competitors (the legal kind).",
    "Connecting dots your competitors didn't even see.",
    "Channeling our inner Sherlock Holmes...",
    "Reading between the lines of market data.",
    "Crafting insights that would make consultants jealous.",
    "Turning data chaos into strategic gold.",
    "Decoding the market matrix...",
    "Building your competitive moat, one insight at a time.",
    "Making sense of the business universe.",
    "Analyzing market trends like a financial detective.",
    "Uncovering hidden opportunities in plain sight.",
    "Translating data into actionable strategies.",
    "Building the perfect strategic roadmap.",
    "Putting the pieces of the market puzzle together."
  ];

  const icons = [Brain, Search, Target, TrendingUp, BarChart3, Users];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    const iconInterval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % icons.length);
    }, 2000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(iconInterval);
    };
  }, []);

  const CurrentIcon = icons[currentIconIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center space-y-8">
          {/* Company Info */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analyzing {companyName}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our AI is working hard to generate your comprehensive market analysis
            </p>
          </div>

          {/* Animated Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary-200 rounded-full animate-pulse-slow"></div>
            <div className="relative bg-primary-600 p-8 rounded-full">
              <CurrentIcon className="w-16 h-16 text-white animate-spin" />
            </div>
          </div>

          {/* Loading Message */}
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Crafting Your Strategy Playbook
            </h3>
            <div className="h-20 flex items-center justify-center">
              <p 
                key={currentMessageIndex}
                className="text-lg text-gray-600 dark:text-gray-300 animate-fade-in max-w-2xl"
              >
                {loadingMessages[currentMessageIndex]}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-gray-200 dark:bg-secondary-700 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-400 h-full rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
              This usually takes 2-3 minutes...
            </p>
          </div>

          {/* Analysis Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-secondary-700">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Search className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Market Research</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Analyzing industry trends and competitive landscape</p>
            </div>
            
            <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-secondary-700">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Target className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Strategy Development</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Crafting actionable recommendations and insights</p>
            </div>
            
            <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-secondary-700">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Report Generation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Creating your comprehensive strategy playbook</p>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 max-w-2xl mx-auto dark:bg-primary-900/20 dark:border-primary-600/30">
            <h4 className="font-semibold text-primary-800 dark:text-primary-300 mb-3">💡 Fun Facts While You Wait</h4>
            <div className="space-y-2 text-sm text-primary-700 dark:text-primary-200">
              <p>• Our AI analyzes over 50 data points per company</p>
              <p>• We process 10,000+ market signals in real-time</p>
              <p>• Your report includes insights from 200+ industry sources</p>
              <p>• 🚀 Grab a coffee - you'll need the energy for all these insights!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoading;
