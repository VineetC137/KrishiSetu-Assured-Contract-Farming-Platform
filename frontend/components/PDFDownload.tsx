'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Download, FileText, Loader } from 'lucide-react';

interface PDFDownloadProps {
  contractId: string;
  contractTitle?: string;
  className?: string;
}

export default function PDFDownload({ contractId, contractTitle, className = '' }: PDFDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      // Get the PDF data with proper authentication
      const response = await api.get(`/contracts/pdf/${contractId}`, {
        responseType: 'blob'
      });
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `contract-${contractId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      toast.success('Contract PDF downloaded successfully!');
    } catch (error: any) {
      console.error('PDF download error:', error);
      const message = error.response?.data?.message || 'Failed to download contract PDF';
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleView = async () => {
    setIsGenerating(true);
    
    try {
      // Get the PDF data with proper authentication
      const response = await api.get(`/contracts/pdf/${contractId}`, {
        responseType: 'blob'
      });
      
      // Create blob URL and open in new tab
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up the blob URL after a delay
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      
    } catch (error: any) {
      console.error('PDF view error:', error);
      const message = error.response?.data?.message || 'Failed to open contract PDF';
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      <button
        onClick={handleView}
        className="btn-secondary flex items-center space-x-2"
        title="View PDF"
      >
        <FileText className="w-4 h-4" />
        <span>View PDF</span>
      </button>
      
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Download PDF"
      >
        {isGenerating ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
      </button>
    </div>
  );
}