import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Copy, Download, Sparkles ,Zap} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import axios from 'axios';

interface GeneratedPromptResultProps {
  result: string;
  setResult: (val: string) => void;
  isLoading: boolean;
  onGenerateResponse: (prompt?:string) => any
  isGenerateDisabled: boolean;
  keyError: boolean;
  setKeyError: (val: boolean) => void;
  onUpdateResult: (newResult: string) => void;
  
}

const GeneratedPromptResult: React.FC<GeneratedPromptResultProps> = ({ 
  result, 
  isLoading, 
  onGenerateResponse, 
  isGenerateDisabled ,
  onUpdateResult
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(promptText);
    toast.success('Generated prompt copied to clipboard!');
  };

   const api_key=localStorage.getItem('gemini-api-key')
  const models=localStorage.getItem('selectedModel')
   const max_tokens=localStorage.getItem('ai-max-tokens')
  const ai_temperature=localStorage.getItem('ai-temperature')

  let [promptText, setPromptText] = useState(result);
  const [isOptimizeModalOpen, setIsOptimizeModalOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [optimizedResonse, setoptimizedResonse] = useState('');


  const textRef = useRef(null);

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

  const handleOptimizeClick = async () => {
   
    setIsOptimizeModalOpen(true);
    setIsOptimizing(true);
    setOptimizedPrompt('');

    try {
      GenerateResponse()
      // const optimized = await simulateOptimizePrompt();
      // setOptimizedPrompt(optimized);
    } catch (error) {
      console.error('Optimization failed:', error);
      toast.error('Failed to optimize prompt. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyOptimization = () => {
    setIsOptimizeModalOpen(false);

    setPromptText(optimizedResonse)
    toast.success('Optimized prompt applied successfully!');
  };

  const handleCancelOptimization = () => {
    setIsOptimizeModalOpen(false);
    setOptimizedPrompt('');

  }


  const GenerateResponse = async () => {
    
    const formData = new FormData();
    formData.append('response_result', promptText);
    formData.append('models', models);  
    formData.append('api_key', api_key);
    formData.append('max_tokens', max_tokens);
    formData.append('ai_temperature', ai_temperature);

    try {
      const res = await axios.post('http://127.0.0.1:8000/optimize_response', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setoptimizedResonse(res.data?.response)
    } catch (error) {
      console.error('Error uploading:', error);
    }
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
   <>
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-800">Generated Prompt Result</h3>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleOptimizeClick}
                variant="outline"
                size="sm"
                className="text-orange-600 hover:text-orange-800 border-orange-200 hover:border-orange-300"
              >
                <Zap className="h-4 w-4 mr-1" />
                Optimize
              </Button>
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
          {/* <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-96 overflow-y-auto mb-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
              {result}
            </pre>
          </div> */}
          
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


      <Dialog open={isOptimizeModalOpen} onOpenChange={setIsOptimizeModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <span>Optimize Prompt</span>
            </DialogTitle>
            <DialogDescription>
              AI-enhanced prompt optimization for better analysis results
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            {isOptimizing ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Optimizing prompt with AI...</p>
                  <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
                </div>
              </div>
            ) : optimizedResonse ? (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                  {optimizedResonse}
                  
                </pre>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Optimized prompt will appear here</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelOptimization}
              disabled={isOptimizing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyOptimization}
              disabled={isOptimizing || !optimizedResonse}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </>


  );
};

export default GeneratedPromptResult;