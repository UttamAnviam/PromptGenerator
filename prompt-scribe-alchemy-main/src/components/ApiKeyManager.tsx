
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Key, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const ApiKeyManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [storedApiKey, setStoredApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini-api-key');
    if (savedKey) {
      setStoredApiKey(savedKey);
    }
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

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
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
  You can generate your API key from the Google AI Studio console.
  <a
    href="https://aistudio.google.com/app/apikey"
    className="text-blue-500 underline ml-1"
    target="_blank" 
    rel="noopener noreferrer"
  >
    Click here
  </a>
</p>

              <Button onClick={handleSaveApiKey} className="w-full">
                Save API Key
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyManager;
