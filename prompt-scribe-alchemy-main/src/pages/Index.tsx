
import React, {useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Brain, Sparkles, Mic, MicOff } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import ModelSelector from '@/components/ModelSelector';
import PromptEditor from '@/components/PromptEditor';
import ResultsDisplay from '@/components/ResultsDisplay';
import axios from 'axios';
import ApiKeyManager from '@/components/ApiKeyManager';
import GeneratedPromptResult from '@/components/GeneratedPromptResult';



const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [prompt, setPrompt] = useState('You are an experienced medical scribe with 15 years of clinical experience and expertise in clinical documentation across multiple medical specialties. Using standard medical intake forms and your documentation skills, create a structured clinical note in JSON format based on the provided voice dictation.');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPromptResult, setGeneratedPromptResult] = useState('');
  const [isGeneratedPromptLoading, setIsGeneratedPromptLoading] = useState(false);
  const [instructions, setInstructions] = useState("Focus on factual information and avoid speculation.");
  const [exampleOutput, setExampleOutput] = useState(`## Summary
[Brief overview of the document]

## Key Findings
• Finding 1
• Finding 2

## Recommendations
1. Action item 1
2. Action item 2`);


const [editableResult, setEditableResult] = useState(''); 
const [ForDataResult,setForDataResult]= useState(''); 
const [keyError, setKeyError]=useState(true); 

localStorage.setItem('selectedModel', selectedModel.trim());
  const api_key=localStorage.getItem('gemini-api-key')
  const models=localStorage.getItem('selectedModel')
  const max_tokens=localStorage.getItem('ai-max-tokens')
  const ai_temperature=localStorage.getItem('ai-temperature')



 if (!api_key) {
  toast.error('Please enter an API KEY',{
  className: 'toast-error',
});
}

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const text = event.target?.result as string;

        resolve(text);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      if (file.type === 'text/plain' || file.type === 'text/csv') {
        reader.readAsText(file);
      } 
    });
    
   
  };

  const handleGenerateResponse = async (prompt?:string) => {
    if (!selectedFile) {
      toast.error('Please select a document first');
      return;
    }

    setIsLoading(true);
 
    GenerateResponse(prompt);
    try {
      // Extract text from the uploaded file
      const extractedText = await extractTextFromFile(selectedFile);
      // Use the generated prompt result instead of the original prompt
      const combinedPrompt = `${generatedPromptResult}\n\nDocument content:\n${extractedText}`;
      
      // Send to Gemini model (simulated for demo)
      const response = await simulateGeminiResponse(extractedText, generatedPromptResult, selectedModel);
      
      setResult(response);
      toast.success('Document analysis completed using generated prompt!');

      

    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateGeneratedPrompt = async (): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
    
    return `OPTIMIZED SYSTEM PROMPT:

You are an expert document analyzer with advanced capabilities in extracting, synthesizing, and presenting information from various document types. Your primary objective is to provide comprehensive, structured, and actionable insights.

ANALYSIS FRAMEWORK:
1. Document Classification & Structure Recognition
2. Key Information Extraction & Categorization  
3. Pattern Recognition & Trend Analysis
4. Risk Assessment & Opportunity Identification
5. Strategic Recommendations Development

RESPONSE FORMAT:
## EXECUTIVE SUMMARY
[Concise overview of document purpose and main findings]

## DOCUMENT CLASSIFICATION
**Type:** [Document category]
**Scope:** [Subject matter scope]
**Confidence Level:** [High/Medium/Low]

## KEY FINDINGS
### Critical Information
• [Most important finding 1]
• [Most important finding 2]
• [Most important finding 3]

### Supporting Details
• [Secondary finding 1]
• [Secondary finding 2]

## EXTRACTED DATA POINTS
[Numerical data, statistics, dates, financial figures]

## RISK ANALYSIS
**High Priority Concerns:**
- [Risk 1 with impact assessment]
- [Risk 2 with impact assessment]

**Mitigation Recommendations:**
- [Actionable solution 1]
- [Actionable solution 2]

## STRATEGIC RECOMMENDATIONS
1. **Immediate Actions:** [What should be done now]
2. **Short-term Goals:** [What should be done within 30-90 days]
3. **Long-term Strategy:** [What should be planned for 6+ months]

## QUALITY METRICS
**Analysis Confidence:** [Percentage]
**Data Completeness:** [Percentage]
**Actionability Score:** [Percentage]

PROCESSING GUIDELINES:
- Maintain objectivity and avoid speculation
- Cite specific document sections when possible
- Highlight contradictions or inconsistencies
- Flag missing critical information
- Provide confidence levels for each major conclusion

Generated on: ${new Date().toLocaleString()}
Model: ${selectedModel}`;
  };




  const handlePromptChange = (newPrompt) => {
    
    setPrompt(newPrompt);
  };

  const handleInstructionsChange = (newInstructions) => {

    setInstructions(newInstructions);
  };

  const handleExampleOutputChange = (newExampleOutput) => {
    setExampleOutput(newExampleOutput);
  };

 const handleUpdateGeneratedPromptResult = (newResult: string) => {
    setGeneratedPromptResult(newResult);
  };





  const Validate_Key = async () => {
  const formData = new FormData();
  formData.append('models', selectedModel);  
  formData.append('api_key', api_key);

  try {
    const res = await axios.post('http://127.0.0.1:8000/Validate_key', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setIsLoading(false)
    console.log(res.data?.response,'-----------sghdgshhsg')
    if (res.data?.response?.error)
    {
      toast.error(res.data?.response?.error);
      setResult('')

    }
    else{
        await SendData();
        
    }
   
    
  } catch (error) {
    console.error('Error uploading:', error);
  }
};
 

  const SendData = async () => {
  const formData = new FormData();
  console.log(prompt,'-------------system_prompt')
  console.log(instructions,'-============instructionsinstructionsinstructions')
  console.log(exampleOutput,'-------------example_outputexample_outputexample_outputexample_output')
  formData.append('file', selectedFile);
  formData.append('system_prompt', prompt);
  formData.append('models', selectedModel);  
  formData.append('example_output', exampleOutput);
  formData.append('istructions', instructions);
  formData.append('api_key', api_key);
  formData.append('max_tokens', max_tokens);
  formData.append('ai_temperature', ai_temperature);

  

  try {
    const res = await axios.post('http://127.0.0.1:8000/chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setIsLoading(false)
    toast.success('Optimized prompt generated! Click "Generate Response" to analyze the document.');
    setResult(res.data?.prompt)
   
    
  } catch (error) {
    console.error('Error uploading:', error);
  }
};
 



  const GenerateResponse = async (prompt?:string) => {
    let match=prompt.match(/{(.*?)}/);

    if (match && match[1] === "voice_dictation")
    {
      setKeyError(true)
    }
    const formData = new FormData();
    formData.append('prompt_result', prompt);
    formData.append('models', selectedModel);  
    formData.append('api_key', api_key);
     formData.append('max_tokens', max_tokens);
    formData.append('ai_temperature', ai_temperature);

    try {
      const res = await axios.post('http://127.0.0.1:8000/generate_response', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsLoading(false)
       setForDataResult(res.data?.response)
      
    } catch (error) {
      console.error('Error uploading:', error);
    }
  };




  const simulateGeminiResponse = async (extractedText: string, userPrompt: string, model: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    return `AI Analysis Results (${model}):

DOCUMENT SUMMARY:
The analyzed document contains valuable information that has been processed according to your prompt: "${userPrompt}"

KEY INSIGHTS:
• Primary themes identified in the content
• Important data points and metrics extracted
• Structural analysis of the document organization
• Relevant patterns and trends discovered

EXTRACTED CONTENT ANALYSIS:
${extractedText.slice(0, 500)}${extractedText.length > 500 ? '...' : ''}

RECOMMENDATIONS:
1. Further review of highlighted sections recommended
2. Cross-reference findings with related documents
3. Consider implementing suggested action items
4. Monitor identified trends for future analysis

CONFIDENCE LEVEL: High
PROCESSING MODEL: ${model}
ANALYSIS TIMESTAMP: ${new Date().toLocaleString()}

Note: This is a demonstration of the AI document analysis workflow. In a production environment, this would connect to Google's Gemini API for actual AI-powered document analysis.`;
  };

  const handleAnalyze = async () => {
    
    if (!selectedFile) {
      toast.error('Please select a document first');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a system prompt');
      return;
    }

   
    setIsGeneratedPromptLoading(true);
    setGeneratedPromptResult('');

    try {
      // Generate optimized prompt first
     GotoTOP(); 
      await Validate_Key()
      //
    } catch (error) {
      console.error('Prompt generation failed:', error);
      toast.error('Failed to generate optimized prompt. Please try again.');
    } finally {
      setIsGeneratedPromptLoading(false);
      
    }
  };

  const GotoTOP = () => {
  console.log('Scrolling to top');
  window.scrollTo(0, 0);
};


    const handleClearAll = () => {
      window.location.reload();
    setSelectedFile(null);
    setGeneratedPromptResult('');
    setResult('');
 setExampleOutput(`## Summary
[Brief overview of the document]

## Key Findings
• Finding 1
• Finding 2

## Recommendations
1. Action item 1
2. Action item 2`);


    setInstructions("Focus on factual information and avoid speculation.")
    setPrompt('You are an experienced medical scribe with 15 years of clinical experience and expertise in clinical documentation across multiple medical specialties. Using standard medical intake forms and your documentation skills, create a structured clinical note in JSON format based on the provided voice dictation.');
    toast.success('All data cleared!');
  };

  

useEffect(() => {
  setEditableResult(result);
   GotoTOP();
}, []);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
         <div className="flex items-center justify-between mb-4">
            <div></div>
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                <Brain className="h-12 w-12 text-blue-600" />
                <Sparkles className="h-6 w-6 text-purple-500 absolute -top-1 " />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
               HealthOrbit AI Prompt Generator
              </h1>
            </div>
            <div className="flex justify-end">
              <ApiKeyManager />
            </div>

          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload documents, customize AI prompts, and extract meaningful insights using Google's advanced Gemini models
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" >
          {/* Left Column - Controls */}
          <div className="space-y-6" >
            <FileUpload 
              onFileSelect={setSelectedFile} 
              selectedFile={selectedFile}
              onClearAll={handleClearAll}
            />
            
            <ModelSelector 
              selectedModel={selectedModel} 
              onModelChange={setSelectedModel}
            />

             
            
            <PromptEditor
            prompt={prompt}
            onPromptChange={handlePromptChange}
            instructions={instructions}
            onInstructionsChange={handleInstructionsChange}
            exampleOutput={exampleOutput}
            onExampleOutputChange={handleExampleOutputChange}
          />
          

            
            <Button
              onClick={handleAnalyze}
              disabled={!selectedFile || isGeneratedPromptLoading || !api_key || api_key.trim() === ''}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 animate-gradient"
            >
              {isGeneratedPromptLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 <span>Generating Prompt...</span>
                </div>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  Generate Optimized Prompt
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Results */}
          
          
              <div className="space-y-6">
           
              <GeneratedPromptResult
              result={result}
              setResult={setEditableResult}
              isLoading={isGeneratedPromptLoading}
              onGenerateResponse={handleGenerateResponse}
              isGenerateDisabled={!result.trim() || !selectedFile || isGeneratedPromptLoading}
              keyError={keyError}
              setKeyError={setKeyError} 
              onUpdateResult={handleUpdateGeneratedPromptResult}
            />


            <ResultsDisplay result={ForDataResult} isLoading={isLoading} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Developed by HealthOrbit Team </p>
        </div>
      </div>
    </div>
  );
};

export default Index;


