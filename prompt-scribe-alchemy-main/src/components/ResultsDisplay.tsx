
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ResultsDisplayProps {
  result: string;
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success('Results copied to clipboard!');
  };

  const downloadAsText = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-analysis-result.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Results downloaded!');
  };

  if (isLoading) {
    return (
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">AI Analysis Results</h3>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing document with AI...</p>
              <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">AI Analysis Results</h3>
          </div>
          
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>Upload a document and click "Analyze" to see AI-generated insights here.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-effect">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">AI Analysis Results</h3>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button
              onClick={downloadAsText}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
            {result}
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default ResultsDisplay;
