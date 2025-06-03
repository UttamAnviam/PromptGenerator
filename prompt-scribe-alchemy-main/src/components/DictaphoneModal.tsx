import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface DictaphoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (text: string) => void;
  title: string;
}

const DictaphoneModal: React.FC<DictaphoneModalProps> = ({ isOpen, onClose, onApply, title }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (isOpen) {
      resetTranscript(); // Clear old data on open
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isOpen]);

  const handleStart = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
  };

  const handleApply = () => {
    onApply(transcript);
    onClose();
    resetTranscript();
  };

  const handleCancel = () => {
    onClose();
    resetTranscript();
    handleStop();
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Speech to Text - {title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              onClick={listening ? handleStop : handleStart}
              variant={listening ? 'destructive' : 'default'}
              size="lg"
              className="rounded-full h-16 w-16"
            >
              {listening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            {listening ? 'Listening... Click to stop' : 'Click microphone to start recording'}
          </div>

          <div className="min-h-[120px] p-3 border rounded-md bg-gray-50 overflow-y-auto">
            <p className="text-sm text-gray-700">
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

export default DictaphoneModal;
