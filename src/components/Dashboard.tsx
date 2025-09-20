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
  Plus,
  BookOpen,
  Search,
  Palette,
  Sparkles,
  Star
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
  const [activeTab, setActiveTab] = useState<'overview' | 'playbook' | 'chat' | 'insights' | 'files' | 'settings' | 'market-research' | 'true2brand' | 'asset-creation'>('overview');
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

  const overviewCards = [
    {
      id: 'playbook',
      title: "TRUE Growth Playbook",
      description: "A strategy engine that maps Tension, Relevance, Uniqueness, and Emotion — so you know exactly what drives demand in your market.",
      icon: BookOpen,
      isHighlighted: true
    },
    {
      id: 'insights',
      title: "TRUE Quadrant Analysis",
      description: "A strategic map that evaluates your market positioning based on Trust and Engagement dimensions, revealing your path to becoming a TRUE Star.",
      icon: BarChart3,
      isHighlighted: false
    },
    {
      id: 'market-research',
      title: "Market Research",
      description: "Comprehensive competitive analysis and market intelligence to identify opportunities and threats in your industry landscape.",
      icon: Search,
      isHighlighted: false
    },
    {
      id: 'true2brand',
      title: "TRUE2Brand",
      description: "Your always-on brand compass. Tone, narrative, and values encoded for consistency across all AI-assisted messaging — no drift, no dilution.",
      icon: Palette,
      isHighlighted: false
    },
    {
      id: 'asset-creation',
      title: "TRUE2Brand Asset Creation",
      description: "Each week, we test new hooks, value props, and audiences — then adjust the strategy based on what actually resonates.",
      icon: Sparkles,
      isHighlighted: false
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
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overviewCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => setActiveTab(card.id as any)}
                    className={`p-6 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
                      card.isHighlighted
                        ? 'bg-green-800 border-2 border-green-400 text-white'
                        : 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        card.isHighlighted 
                          ? 'bg-green-700' 
                          : 'bg-gray-100 dark:bg-secondary-700'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          card.isHighlighted 
                            ? 'text-green-400' 
                            : 'text-primary-600 dark:text-primary-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold mb-2 ${
                          card.isHighlighted 
                            ? 'text-green-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {card.title}
                        </h3>
                        <p className={`text-sm ${
                          card.isHighlighted 
                            ? 'text-white' 
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Additional Quick Actions */}
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="p-4 border border-gray-200 dark:border-secondary-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-left"
                >
                  <MessageCircle className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Ask AI Analyst</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get answers about your analysis</p>
                </button>
                <button
                  onClick={handleShare}
                  className="p-4 border border-gray-200 dark:border-secondary-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-left"
                >
                  <Share2 className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Share Report</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Collaborate with your team</p>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="p-4 border border-gray-200 dark:border-secondary-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-left"
                >
                  <Download className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Download PDF</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Export your complete analysis</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'playbook' && (
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-8">
            <div className="prose max-w-none">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">TRUE Growth Playbook</h1>
              
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
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">TRUE Quadrant Analysis</h3>
              
              {/* Scatter Plot Placeholder */}
              <div className="bg-gray-50 dark:bg-secondary-800 rounded-lg p-8 mb-6">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-primary-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Market Position Scatter Plot</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Interactive visualization showing your position on Trust vs Engagement dimensions
                  </p>
                  <div className="bg-white dark:bg-dark-700 rounded-lg p-6 border border-gray-200 dark:border-secondary-600">
                    <div className="relative h-64 bg-gray-100 dark:bg-secondary-700 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Your Position</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Trust: 8.2 | Engagement: 7.5</p>
                      </div>
                      <div className="absolute top-4 left-4 text-xs text-gray-500 dark:text-gray-400">
                        High Trust
                      </div>
                      <div className="absolute bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400">
                        Low Trust
                      </div>
                      <div className="absolute top-4 right-4 text-xs text-gray-500 dark:text-gray-400 transform -rotate-90">
                        High Engagement
                      </div>
                      <div className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400 transform -rotate-90">
                        Low Engagement
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GTM Roadmap */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">GTM Roadmap to TRUE Star Position</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Phase 1: Trust Building (Q1-Q2)</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Focus on thought leadership, case studies, and customer testimonials to increase trust score from 8.2 to 9.0+</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Phase 2: Engagement Amplification (Q2-Q3)</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Launch interactive content, community building, and user-generated content to boost engagement from 7.5 to 8.5+</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Phase 3: TRUE Star Achievement (Q3-Q4)</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Reach the top-right quadrant with 9.0+ trust and 8.5+ engagement to become a market leader</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <FileUpload brandId={currentBrand.id} />
        )}

        {activeTab === 'market-research' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Market Research</h3>
              
              {/* Filterable Comparison Table */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Competitive Analysis</h4>
                  <div className="flex space-x-2">
                    <select className="px-3 py-1 border border-gray-300 dark:border-secondary-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm">
                      <option>All Industries</option>
                      <option>Technology</option>
                      <option>Healthcare</option>
                      <option>Finance</option>
                    </select>
                    <select className="px-3 py-1 border border-gray-300 dark:border-secondary-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm">
                      <option>All Metrics</option>
                      <option>Market Share</option>
                      <option>Revenue</option>
                      <option>Growth Rate</option>
                    </select>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 dark:border-secondary-600">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-secondary-800">
                        <th className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">Company</th>
                        <th className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">Market Share</th>
                        <th className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">Revenue</th>
                        <th className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">Growth Rate</th>
                        <th className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">Key Strengths</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-gray-900 dark:text-white">TechCorp Solutions</td>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-gray-900 dark:text-white">15.2%</td>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-gray-900 dark:text-white">$2.4B</td>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-green-600 dark:text-green-400">+12%</td>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-gray-900 dark:text-white">Innovation, Customer Focus</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-gray-900 dark:text-white">Competitor A</td>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-gray-900 dark:text-white">22.1%</td>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-gray-900 dark:text-white">$3.1B</td>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-green-600 dark:text-green-400">+8%</td>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-gray-900 dark:text-white">Market Leader, Scale</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-gray-900 dark:text-white">Competitor B</td>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-gray-900 dark:text-white">18.7%</td>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-gray-900 dark:text-white">$2.8B</td>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-red-600 dark:text-red-400">-2%</td>
                        <td className="border border-gray-200 dark:border-secondary-600 px-4 py-2 text-sm text-gray-900 dark:text-white">Legacy Systems, Brand</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* On-demand Research */}
              <div className="bg-gray-50 dark:bg-secondary-800 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">On-Demand Market Research</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Request additional analysis for non-cached competitors or specific comparison metrics not shown above.
                </p>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Enter competitor name or metric..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-secondary-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm"
                  />
                  <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm transition-colors">
                    Request Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'true2brand' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">TRUE2Brand</h3>
              
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-blue-900 dark:text-blue-300 mb-3">Brand Consistency Framework</h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
                    Maintain consistent tone, narrative, and values across all AI-assisted messaging to prevent brand drift and dilution.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-dark-700 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Tone Guidelines</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>• Professional yet approachable</li>
                        <li>• Confident but not arrogant</li>
                        <li>• Solution-focused messaging</li>
                        <li>• Industry expertise tone</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white dark:bg-dark-700 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Narrative Structure</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>• Problem-solution framework</li>
                        <li>• Customer success stories</li>
                        <li>• Innovation leadership</li>
                        <li>• Future-focused vision</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white dark:bg-dark-700 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Core Values</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>• Innovation & Excellence</li>
                        <li>• Customer-Centric Approach</li>
                        <li>• Integrity & Transparency</li>
                        <li>• Continuous Improvement</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-green-900 dark:text-green-300 mb-3">Creative Brief Templates</h4>
                  <p className="text-green-800 dark:text-green-200 text-sm mb-4">
                    Standardized templates to ensure all creative assets align with your brand identity and messaging framework.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-dark-700 rounded-lg border border-green-200 dark:border-green-800">
                      <div>
                        <h6 className="font-medium text-gray-900 dark:text-white">Social Media Campaign Brief</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Template for consistent social media messaging</p>
                      </div>
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors">
                        Use Template
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-dark-700 rounded-lg border border-green-200 dark:border-green-800">
                      <div>
                        <h6 className="font-medium text-gray-900 dark:text-white">Email Marketing Brief</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Framework for email campaign messaging</p>
                      </div>
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors">
                        Use Template
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-dark-700 rounded-lg border border-green-200 dark:border-green-800">
                      <div>
                        <h6 className="font-medium text-gray-900 dark:text-white">Content Marketing Brief</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Guidelines for blog posts and articles</p>
                      </div>
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors">
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'asset-creation' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">TRUE2Brand Asset Creation</h3>
              
              <div className="space-y-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-purple-900 dark:text-purple-300 mb-3">AI-Powered Content Generation</h4>
                  <p className="text-purple-800 dark:text-purple-200 text-sm mb-4">
                    Generate on-demand creatives, messaging, and campaigns using AI while maintaining brand consistency and testing new approaches.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-dark-700 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">Content Types</h5>
                      <div className="space-y-2">
                        <button className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-md text-sm text-gray-700 dark:text-gray-300">
                          📝 Blog Posts & Articles
                        </button>
                        <button className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-md text-sm text-gray-700 dark:text-gray-300">
                          📱 Social Media Posts
                        </button>
                        <button className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-md text-sm text-gray-700 dark:text-gray-300">
                          📧 Email Campaigns
                        </button>
                        <button className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-md text-sm text-gray-700 dark:text-gray-300">
                          🎯 Ad Copy & Headlines
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-dark-700 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">Campaign Types</h5>
                      <div className="space-y-2">
                        <button className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-md text-sm text-gray-700 dark:text-gray-300">
                          🚀 Product Launch
                        </button>
                        <button className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-md text-sm text-gray-700 dark:text-gray-300">
                          📈 Growth Campaign
                        </button>
                        <button className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-md text-sm text-gray-700 dark:text-gray-300">
                          🎉 Brand Awareness
                        </button>
                        <button className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-secondary-700 rounded-md text-sm text-gray-700 dark:text-gray-300">
                          💰 Lead Generation
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-orange-900 dark:text-orange-300 mb-3">Weekly Testing & Optimization</h4>
                  <p className="text-orange-800 dark:text-orange-200 text-sm mb-4">
                    Continuously test new hooks, value propositions, and audience segments to optimize your messaging strategy.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-dark-700 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center justify-between mb-2">
                        <h6 className="font-medium text-gray-900 dark:text-white">Current Test: Value Proposition A vs B</h6>
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs">
                          Week 2 of 4
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">Version A Performance:</p>
                          <p className="font-medium text-gray-900 dark:text-white">CTR: 3.2% | Conversion: 8.1%</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">Version B Performance:</p>
                          <p className="font-medium text-gray-900 dark:text-white">CTR: 2.8% | Conversion: 9.3%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm transition-colors">
                        Start New Test
                      </button>
                      <button className="px-4 py-2 border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 rounded-md text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                        View Results
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
