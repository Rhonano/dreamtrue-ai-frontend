import React, { useState } from 'react';
import { 
  FileText, 
  MessageCircle, 
  Download, 
  Share2, 
  LogOut, 
  Building2,
  TrendingUp,
  Target,
  Users,
  BarChart3,
  Upload,
  Settings,
  Plus
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import BrandSelector from './BrandSelector';
import FileUpload from './FileUpload';
import MFASettings from './MFASettings';
import CompanyAnalysisForm from './CompanyAnalysisForm';
import AnalysisLoading from './AnalysisLoading';
import { sampleBrands } from '../data/sampleBrands';
import { Brand } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'playbook' | 'chat' | 'insights' | 'files' | 'settings'>('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand>(sampleBrands[0]);
  const [brands, setBrands] = useState<Brand[]>(sampleBrands);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingCompany, setAnalyzingCompany] = useState('');

  // Mock data for the dashboard
  const reportData = {
    companyName: "TechCorp Solutions",
    industry: "Technology",
    location: "San Francisco, CA",
    generatedDate: "2024-01-15",
    status: "completed"
  };

  const insights = [
    {
      title: "Market Position",
      value: "Strong",
      trend: "+12%",
      description: "Above industry average growth",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Competitive Advantage",
      value: "High",
      trend: "+8%",
      description: "Unique value proposition identified",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Market Share",
      value: "15.2%",
      trend: "+3.2%",
      description: "Growing market presence",
      icon: BarChart3,
      color: "text-purple-600"
    },
    {
      title: "Customer Base",
      value: "2.4K",
      trend: "+18%",
      description: "Active customer growth",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  const handleDownloadPDF = () => {
    // TODO: Implement actual PDF download
    alert('PDF download would be implemented here');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/report/${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
    setShowShareModal(false);
  };

  const handleAddCompany = () => {
    setShowCompanyForm(true);
  };

  const handleCompanySubmit = (companyData: { name: string; url?: string; location?: string; industry?: string }) => {
    setAnalyzingCompany(companyData.name);
    setShowCompanyForm(false);
    setIsAnalyzing(true);
    
    // Simulate analysis (5 seconds for demo)
    setTimeout(() => {
      // Create new brand from company data
      const newBrand: Brand = {
        id: `brand-${Date.now()}`,
        name: companyData.name,
        icon: '🏢', // Default icon
        color: '#3B82F6', // Default blue color
        lastUpdated: new Date().toISOString(),
        status: 'completed'
      };
      
      // Add to brands list and set as current
      const updatedBrands = [...brands, newBrand];
      setBrands(updatedBrands);
      setCurrentBrand(newBrand);
      setIsAnalyzing(false);
      setAnalyzingCompany('');
    }, 5000);
  };

  const handleBackToDashboard = () => {
    setShowCompanyForm(false);
    setIsAnalyzing(false);
    setAnalyzingCompany('');
  };

  // Show company form if adding new company
  if (showCompanyForm) {
    return (
      <CompanyAnalysisForm 
        onLogout={onLogout} 
        onSubmit={handleCompanySubmit}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Show loading if analyzing
  if (isAnalyzing) {
    return (
      <AnalysisLoading 
        companyName={analyzingCompany}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-dark-800 dark:border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">DreamTrue AI</span>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-secondary-700"></div>
              <BrandSelector 
                brands={brands}
                currentBrand={currentBrand}
                onBrandSelect={setCurrentBrand}
              />
              <button
                onClick={handleAddCompany}
                className="ml-4 p-2 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
                title="Add New Company"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">Welcome back!</span>
              <ThemeToggle />
              <button
                onClick={() => setActiveTab('settings')}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Company Info Header */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: currentBrand.color }}
              >
                {currentBrand.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{currentBrand.name}</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {reportData.industry} • {reportData.location}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Analysis completed on {new Date(reportData.generatedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDownloadPDF}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={handleShare}
                className="btn-secondary flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-secondary-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'playbook', name: 'Strategy Playbook', icon: FileText },
              { id: 'chat', name: 'AI Chat', icon: MessageCircle },
              { id: 'insights', name: 'Insights', icon: TrendingUp },
              { id: 'files', name: 'Documents', icon: Upload },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'tab-active'
                      : 'tab-inactive'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{insight.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{insight.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{insight.description}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-50`}>
                        <Icon className={`h-6 w-6 ${insight.color}`} />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className={`text-sm font-medium ${insight.color}`}>
                        {insight.trend}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">vs last quarter</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('playbook')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                >
                  <FileText className="h-8 w-8 text-primary-600 mb-2" />
                  <h4 className="font-medium text-gray-900">View Full Report</h4>
                  <p className="text-sm text-gray-600">Access complete strategy playbook</p>
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                >
                  <MessageCircle className="h-8 w-8 text-primary-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Ask AI Analyst</h4>
                  <p className="text-sm text-gray-600">Get answers about your analysis</p>
                </button>
                <button
                  onClick={handleShare}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                >
                  <Share2 className="h-8 w-8 text-primary-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Share Report</h4>
                  <p className="text-sm text-gray-600">Collaborate with your team</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'playbook' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="prose max-w-none">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Strategy Playbook</h1>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-blue-900 mb-3">Executive Summary</h2>
                <p className="text-blue-800">
                  TechCorp Solutions demonstrates strong market positioning with a 15.2% market share and 
                  growing customer base. Our analysis reveals significant opportunities for expansion in 
                  the enterprise segment and potential for international growth.
                </p>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Market Analysis</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Market Size</h3>
                      <p className="text-gray-700">$2.4B total addressable market with 12% annual growth</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Competition</h3>
                      <p className="text-gray-700">3 major competitors with 45% combined market share</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Strategic Recommendations</h2>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary-500 pl-4">
                      <h3 className="font-semibold text-gray-900">1. Expand Enterprise Focus</h3>
                      <p className="text-gray-700">Target enterprise clients with customized solutions and dedicated support</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold text-gray-900">2. International Expansion</h3>
                      <p className="text-gray-700">Enter European and Asian markets with localized offerings</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-gray-900">3. Product Innovation</h3>
                      <p className="text-gray-700">Invest in AI-powered features to differentiate from competitors</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Implementation Timeline</h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Q1 2024: Market Research</h4>
                        <p className="text-sm text-gray-600">Deep dive into target segments and customer needs</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Q2 2024: Product Development</h4>
                        <p className="text-sm text-gray-600">Build enterprise features and international capabilities</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Q3 2024: Market Entry</h4>
                        <p className="text-sm text-gray-600">Launch in 3 new markets with localized strategies</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chat with the AI Analyst
              </h3>
              <p className="text-gray-600 mb-6">
                Ask questions about the analysis, request clarifications, or dive deeper into specific insights.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-gray-600">
                  💡 Try asking: "What are the key competitive advantages mentioned in the analysis?"
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Strong Market Position</h4>
                    <p className="text-sm text-gray-600">Your company is well-positioned for growth with above-average market share</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Untapped Opportunities</h4>
                    <p className="text-sm text-gray-600">Enterprise segment shows 40% growth potential with minimal competition</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Competitive Advantage</h4>
                    <p className="text-sm text-gray-600">Your unique value proposition gives you a 2-year head start on competitors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <FileUpload brandId={currentBrand.id} />
        )}

        {activeTab === 'settings' && (
          <MFASettings />
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share Report</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Share this report with your team members by copying the link below.
            </p>
            <button
              onClick={copyShareLink}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Copy Share Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
