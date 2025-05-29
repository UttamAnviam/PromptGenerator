import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, FileText, Target } from 'lucide-react';

interface PromptEditorProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  instructions: string;
  onInstructionsChange: (instructions: string) => void;
  exampleOutput: string;
  onExampleOutputChange: (exampleOutput: string) => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ 
  prompt, 
  onPromptChange,
  instructions,
  onInstructionsChange,
  exampleOutput,
  onExampleOutputChange
}) => {
  const defaultPrompts = [
    "Analyze this document and extract key insights, themes, and important information.",
    "Summarize the main points and provide actionable recommendations.",
    "Extract all data points, metrics, and statistics from this document.",
    "Identify potential risks, issues, or areas of concern mentioned in the document.",
    "Create a structured outline of the document's content and hierarchy."
  ];

  const defaultInstructions = [
    "Focus on factual information and avoid speculation.",
    "Organize the response in clear sections with headings.",
    "Include specific quotes or references from the document.",
    "Highlight any actionable items or recommendations.",
    "Maintain objectivity and professional tone throughout."
  ];

  const defaultExampleOutputs = [
    "## Summary\n[Brief overview of the document]\n\n## Key Findings\n• Finding 1\n• Finding 2\n\n## Recommendations\n1. Action item 1\n2. Action item 2",
    "**Document Type:** [Type]\n**Main Topic:** [Topic]\n**Key Metrics:** [Numbers/Statistics]\n**Action Items:** [What needs to be done]",
    "### Executive Summary\n[High-level overview]\n\n### Detailed Analysis\n[In-depth findings]\n\n### Next Steps\n[Recommended actions]",
    "## Risk Assessment\n**High Priority Issues:**\n- Issue 1\n- Issue 2\n\n**Medium Priority Issues:**\n- Issue 3\n\n**Recommendations:**\n- Solution 1\n- Solution 2"
  ];

  return (
    <div className="space-y-6">
      {/* System Prompt Section */}
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">System Prompt</h3>
          </div>
          
          <div className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Enter your custom prompt here..."
              className="min-h-[120px] resize-none border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick prompts:</p>
              <div className="grid gap-2">
                {defaultPrompts.map((defaultPrompt, index) => (
                  <button
                    key={index}
                    onClick={() => onPromptChange(defaultPrompt)}
                    className="text-left text-sm p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 border border-transparent hover:border-gray-200"
                  >
                    {defaultPrompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Instructions Section */}
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">Instructions</h3>
          </div>
          
          <div className="space-y-4">
            <Textarea
              value={instructions}
              onChange={(e) => onInstructionsChange(e.target.value)}
              placeholder="Enter specific instructions for the AI analysis..."
              className="min-h-[120px] resize-none border-gray-200 focus:border-green-400 focus:ring-green-400"
            />
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick instructions:</p>
              <div className="grid gap-2">
                {defaultInstructions.map((instruction, index) => (
                  <button
                    key={index}
                    onClick={() => onInstructionsChange(instruction)}
                    className="text-left text-sm p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 border border-transparent hover:border-gray-200"
                  >
                    {instruction}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Example Output Section */}
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-800">Example Output</h3>
          </div>
          
          <div className="space-y-4">
            <Textarea
              value={exampleOutput}
              onChange={(e) => onExampleOutputChange(e.target.value)}
              placeholder="Provide an example of the desired output format..."
              className="min-h-[120px] resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-400"
            />
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Example formats:</p>
              <div className="grid gap-2">
                {defaultExampleOutputs.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => onExampleOutputChange(example)}
                    className="text-left text-sm p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 border border-transparent hover:border-gray-200"
                  >
                    {example.split('\n')[0]}...
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PromptEditor;