
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Key, Trash2, Eye, EyeOff, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ApiKeyManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [storedApiKey, setStoredApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);4
  const [maxTokens, setMaxTokens] = useState('8192');
  const [temperature, setTemperature] = useState('1');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

const modelSlugToMaxTokensMap = {
  'gemini-1.5-flash': 8192,
  'gemini-1.5-pro': 8192,
  'gemini-2.0-flash': 8192,
  'gemini-2.5-flash-preview-05-20': 65536,
  'gemini-2.5-pro-preview-05-06': 8192,
};

const selectedModel = localStorage.getItem('selectedModel') || '';
const maxTokenLimit = modelSlugToMaxTokensMap[selectedModel] || 8192;

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini-api-key');
    if (savedKey) {
      setStoredApiKey(savedKey);
    }
    
    const selectedModel = localStorage.getItem('selectedModel') || '';
    const maxTokenLimit = modelSlugToMaxTokensMap[selectedModel] || 8192;

    const savedMaxTokens = localStorage.getItem('ai-max-tokens');
    const savedTemperature = localStorage.getItem('ai-temperature');

     setMaxTokens(
    savedMaxTokens && savedMaxTokens !== 'null' ? savedMaxTokens : maxTokenLimit.toString()
  );
  setTemperature(
    savedTemperature && savedTemperature !== 'null' ? savedTemperature : '1'
  );


  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    localStorage.setItem('gemini-api-key', apiKey.trim());
    setStoredApiKey(apiKey.trim());
    setApiKey('');
    setIsOpen(false);
    
    toast.success('API key saved successfully!');
  };

  const handleDeleteApiKey = () => {
    localStorage.removeItem('gemini-api-key');
    setStoredApiKey('');
    toast.success('API key deleted successfully!');
  };
 const handleSaveSettings = () => {
    setIsSettingsOpen(false)
    localStorage.setItem('ai-max-tokens', maxTokens.trim());
    localStorage.setItem('ai-temperature', temperature.trim());
   
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
   <div className="flex items-center space-x-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>Add API Key</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Manage API Key</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {storedApiKey ? (
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Current API Key:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-sm font-mono">
                    {showApiKey ? storedApiKey : maskApiKey(storedApiKey)}
                  </div>
                  <Button
                    onClick={handleDeleteApiKey}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete API Key
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Gemini API Key
                  </label>
                  <input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Your API key will be stored locally in your browser and used for AI analysis.
                </p>
                <Button onClick={handleSaveApiKey} className="w-full">
                  Save API Key
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>AI Settings</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens {maxTokens}</Label>
              <Input
                id="maxTokens"
                type="range"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
                min="1"
                max={maxTokenLimit}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Maximum number of tokens to generate (1–{maxTokenLimit})
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature {temperature}</Label>
              <Input
                id="temperature"
                type="range"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                min="0"
                max='2'
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Controls randomness. Lower values (0.0-0.3) for focused responses, higher values (0.7-1.0) for creative responses
              </p>
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              Apply Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiKeyManager;
