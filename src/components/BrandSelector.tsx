import React, { useState } from 'react';
import { Building2, ChevronDown, Check, Clock, Play } from 'lucide-react';
import { Brand } from '../types';

interface BrandSelectorProps {
  brands: Brand[];
  currentBrand: Brand;
  onBrandSelect: (brand: Brand) => void;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({ brands, currentBrand, onBrandSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusIcon = (status: Brand['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-3 w-3 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'active':
        return <Play className="h-3 w-3 text-primary-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Brand['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'in-progress':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'active':
        return 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
    }
  };

  return (
    <div className="relative">
      {/* Current Brand Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200 dark:border-secondary-700 dark:bg-dark-800 dark:hover:bg-dark-700 h-10"
      >
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
          style={{ backgroundColor: currentBrand.color }}
        >
          {currentBrand.icon}
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium text-gray-900 dark:text-white">{currentBrand.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {currentBrand.status.replace('-', ' ')}
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-dark-800 dark:border-secondary-700">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-2">
              Switch Brand
            </div>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => {
                  onBrandSelect(brand);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                  brand.id === currentBrand.id
                    ? 'bg-primary-50 border border-primary-200 dark:bg-primary-900/20 dark:border-primary-800'
                    : 'hover:bg-gray-50 dark:hover:bg-dark-700'
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: brand.color }}
                >
                  {brand.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900 dark:text-white">{brand.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Updated {brand.lastUpdated}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(brand.status)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSelector;
