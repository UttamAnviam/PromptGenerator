import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Copy, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedPromptResultProps {
  result: string;
  setResult: (val: string) => void;
  isLoading: boolean;
  onGenerateResponse: (prompt?:string) => any
  isGenerateDisabled: boolean;
  keyError: boolean;
  setKeyError: (val: boolean) => void;
}

const GeneratedPromptResult: React.FC<GeneratedPromptResultProps> = ({ 
  result, 
  setResult,
keyError,
  setKeyError,
  isLoading, 
  onGenerateResponse, 
  isGenerateDisabled 
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(promptText);
    toast.success('Generated prompt copied to clipboard!');
  };

  let [promptText, setPromptText] = useState(result);
  const textRef = useRef(null);

  console.log(keyError,'--------keyErrorkeyErrorkeyErrorkeyError')
  const downloadAsText = () => {
    const blob = new Blob([promptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Generated prompt downloaded!');
  };


  const generateResponse = ()=>{
    onGenerateResponse(textRef.current.value);
  }

useEffect(() => {
      setPromptText(result);
}, [result]);


  if (isLoading) {
    return (
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-800">Generated Prompt Result</h3>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Generating optimized prompt...</p>
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
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-800">Generated Prompt Result</h3>
          </div>
          
          <div className="text-center py-12 text-gray-500">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>Generated optimized prompt will appear here.</p>
          </div>
          
          <Button
            onClick={generateResponse}
            disabled={isGenerateDisabled}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Response
          </Button>
        </div>
      </Card>
    );
  }

  return (
  <Card className="glass-effect">
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-800">Generated Prompt Result</h3>
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

    {/* Editable TextArea Replaces Preformatted Block */}
    <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-96 overflow-y-auto mb-4">
      <textarea
        ref={textRef}
        value={promptText}
        onChange={(e)=>setPromptText(e.target.value)}
        rows={12}
        className="w-full border-none outline-none resize-none text-sm text-gray-700 font-mono leading-relaxed"
        placeholder="Your generated prompt will appear here..."
      />
    </div>

    <Button
      onClick={generateResponse}
      disabled={isGenerateDisabled}
      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500"
    >
      <Sparkles className="h-4 w-4 mr-2" />
      Generate Response
    </Button>
  </div>
</Card>

  );
};

export default GeneratedPromptResult;