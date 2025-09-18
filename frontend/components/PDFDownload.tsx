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
      // First generate the PDF
      const generateResponse = await api.get(`/contracts/download/${contractId}`);
      console.log('PDF generation response:', generateResponse.data);
      
      if (generateResponse.data.downloadUrl) {
        // Open the PDF URL directly
        window.open(generateResponse.data.downloadUrl, '_blank');
        toast.success('Contract PDF opened successfully!');
      } else {
        throw new Error('No download URL received');
      }
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
      // First generate the PDF
      const generateResponse = await api.get(`/contracts/download/${contractId}`);
      console.log('PDF generation response:', generateResponse.data);
      
      if (generateResponse.data.downloadUrl) {
        // Open the PDF URL directly
        window.open(generateResponse.data.downloadUrl, '_blank');
        toast.success('Contract PDF opened successfully!');
      } else {
        throw new Error('No download URL received');
      }
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