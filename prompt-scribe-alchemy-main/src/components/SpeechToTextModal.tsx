import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

// Ensure global support for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechToTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (text: string) => void;
  title: string;
}

const SpeechToTextModal: React.FC<SpeechToTextModalProps> = ({
  isOpen,
  onClose,
  onApply,
  title,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        toast.error('Speech recognition is not supported in this browser.');
        return;
      }

      const instance = new SpeechRecognition();
      instance.continuous = true;
      instance.interimResults = true;
      instance.lang = 'en-US';

      instance.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) {
            finalTranscript += text;
          } else {
            interimTranscript += text;
          }
        }

        setTranscript((prev) => prev + finalTranscript + interimTranscript);
      };

      instance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Speech recognition error: ' + event.error);
        setIsListening(false);
      };

      instance.onend = () => {
        setIsListening(false);
      };

      setRecognition(instance);
    }
  }, []);

  const startListening = async () => {
    if (!recognition) {
      toast.error('Speech recognition not available.');
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setTranscript('');
      recognition.start();
      setIsListening(true);
      toast.success('Listening... Start speaking!');
    } catch (error) {
      console.error('Microphone access denied:', error);
      toast.error('Microphone permission denied. Please allow access.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleApply = () => {
    onApply(transcript.trim());
    stopListening();
    onClose();
    setTranscript('');
  };

  const handleCancel = () => {
    stopListening();
    onClose();
    setTranscript('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Speech to Text - {title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? 'destructive' : 'default'}
              size="lg"
              className="rounded-full h-16 w-16"
            >
              {isListening ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {isListening ? 'Listening... Click to stop' : 'Click mic to start recording'}
          </div>

          <div className="min-h-[120px] p-3 border rounded-md bg-gray-50">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {transcript || 'Transcribed text will appear here...'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!transcript.trim()}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpeechToTextModal;
