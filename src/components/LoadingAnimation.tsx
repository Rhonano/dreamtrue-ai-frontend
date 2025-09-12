import React, { useState, useEffect } from 'react';
import { Loader2, Brain, Search, Target } from 'lucide-react';

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
  "Making sense of the business universe."
];

const icons = [Brain, Search, Target];

const LoadingAnimation: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

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
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      {/* Animated Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary-200 rounded-full animate-pulse-slow"></div>
        <div className="relative bg-primary-600 p-6 rounded-full">
          <CurrentIcon className="w-12 h-12 text-white animate-spin" />
        </div>
      </div>

      {/* Loading Message */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">
          Crafting Your Strategy Playbook
        </h3>
        <div className="h-16 flex items-center justify-center">
          <p 
            key={currentMessageIndex}
            className="text-lg text-gray-600 animate-fade-in max-w-md"
          >
            {loadingMessages[currentMessageIndex]}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full animate-pulse"></div>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          This usually takes 2-3 minutes...
        </p>
      </div>

      {/* Fun Facts */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          💡 Fun fact: Our AI analyzes over 50 data points per company
        </p>
        <p className="text-sm text-gray-500">
          🚀 While you wait, grab a coffee - you'll need the energy for all these insights!
        </p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
