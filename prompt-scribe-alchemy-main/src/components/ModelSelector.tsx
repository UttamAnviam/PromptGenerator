
import React from 'react';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sparkles, Zap, Brain, Rocket, Crown } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}


const models = [
  {
    id: 'gemini-1.5-flash',
    name: ( <span className="flex items-center gap-2">
    Gemini 1.5 Flash
    <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-0.5 rounded">
      Free
    </span>
  </span>),
    description: 'Fast and efficient for quick analysis',
    icon: Zap,
    color: 'text-yellow-500'
  },
  {
    id: 'gemini-1.5-pro',
    name: ( <span className="flex items-center gap-2">
    Gemini 1.5 Pro
    <span className="text-red-600 text-sm font-medium bg-red-100 px-2 py-0.5 rounded">
      Paid
    </span>
  </span>),
    description: 'Advanced reasoning for complex documents ',
    icon: Brain,
    color: 'text-blue-500'
  },
  {
    id: 'gemini-2.0-flash',
    name: ( <span className="flex items-center gap-2">
    Gemini 2.0 Flash
    <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-0.5 rounded">
      Free
    </span>
  </span>),
    description: 'Next-generation speed with enhanced capabilities',
    icon: Rocket,
    color: 'text-orange-500'
  },
  {
    id: 'gemini-2.5-flash-preview-05-20',
    name:( <span className="flex items-center gap-2">
    Gemini 2.5 Flash Preview 05-20
    <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-0.5 rounded">
      Free
    </span>
  </span>),
    description: 'Ultra-fast processing with cutting-edge AI',
    icon: Sparkles,
    color: 'text-pink-500'
  },
  {
    id: 'gemini-2.5-pro-preview-05-06',
    name: ( <span className="flex items-center gap-2">
    Gemini 2.5 Pro Preview 05-06
    <span className="text-red-600 text-sm font-medium bg-red-100 px-2 py-0.5 rounded">
      Paid
    </span>
  </span>),
    description: 'Most advanced model for complex reasoning ',
    icon: Crown,
    color: 'text-purple-600'
  }
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  return (
    <Card className="glass-effect">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">AI Model Selection</h3>
        
        <RadioGroup value={selectedModel} onValueChange={onModelChange}>
          <div className="space-y-3">
            {models.map((model) => {
              const IconComponent = model.icon;
              return (
                <div key={model.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={model.id} id={model.id} />
                  <Label 
                    htmlFor={model.id} 
                    className="flex items-center space-x-3 cursor-pointer flex-1 p-3 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <IconComponent className={`h-5 w-5 ${model.color}`} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{model.name}</div>
                      <div className="text-sm text-gray-600">{model.description}</div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
};

export default ModelSelector;
