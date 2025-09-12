import React, { useState } from 'react';
import { Download, Share2, MessageCircle, FileText, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ReportViewer: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'playbook' | 'chat'>('playbook');
  const [showShareModal, setShowShareModal] = useState(false);

  const currentReport = state.currentReport;

  if (!currentReport || currentReport.status !== 'completed') {
    return null;
  }

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('playbook-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${currentReport.companyData.name}-strategy-playbook.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/report/${currentReport.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
    setShowShareModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentReport.companyData.name} - Strategy Analysis
            </h1>
            <p className="text-gray-600 mt-1">
              Generated on {new Date(currentReport.completedAt!).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="btn-primary flex items-center"
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

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('playbook')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'playbook'
                ? 'tab-active'
                : 'tab-inactive'
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Strategy Playbook
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'chat'
                ? 'tab-active'
                : 'tab-inactive'
            }`}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            AI Chat
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'playbook' && (
        <div className="card">
          <div
            id="playbook-content"
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: currentReport.playbookHtml || '' }}
          />
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="card">
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
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Share this report with your team members by copying the link below.
            </p>
            <button
              onClick={copyShareLink}
              className="w-full btn-primary"
            >
              Copy Share Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
