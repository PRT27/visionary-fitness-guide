
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // Initialize speech recognition
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognitionConstructor();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "I'm listening",
          description: "Speak now...",
        });
      };

      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        setTranscript(command);
        setIsProcessing(true);
        processVoiceCommand(command);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast({
          title: "Voice recognition error",
          description: "Please try again",
          variant: "destructive",
        });
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive",
      });
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [toast]);

  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionConstructor();
      recognition.start();
      
      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        setTranscript(command);
        setIsProcessing(true);
        processVoiceCommand(command);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
    }
  };

  const processVoiceCommand = (command: string) => {
    // Simulate command processing
    setTimeout(() => {
      let response = '';
      
      if (command.includes('home') || command.includes('main')) {
        window.location.href = '/';
        response = 'Navigating to home page';
      } else if (command.includes('fitness') || command.includes('tracking')) {
        window.location.href = '/fitness';
        response = 'Opening fitness tracking';
      } else if (command.includes('object') || command.includes('detect')) {
        window.location.href = '/object-detection';
        response = 'Opening object detection';
      } else if (command.includes('watch') || command.includes('smartwatch')) {
        window.location.href = '/smartwatch';
        response = 'Opening smartwatch pairing';
      } else if (command.includes('help')) {
        response = 'Available commands: home, fitness, object detection, smartwatch, help';
      } else {
        response = "I didn't understand that command. Try saying 'help' for assistance.";
      }
      
      speakResponse(response);
      setIsProcessing(false);
    }, 1000);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = text;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      
      window.speechSynthesis.speak(speech);
      
      toast({
        title: "Assistant",
        description: text,
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {isProcessing && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg p-3 shadow-lg min-w-[200px] text-center">
            <p className="text-sm opacity-75">Processing: "{transcript}"</p>
            <Loader2 className="animate-spin h-5 w-5 mx-auto mt-2" />
          </div>
        )}
        
        <Button
          variant="default"
          size="lg"
          className={`h-14 w-14 rounded-full shadow-lg ${isListening ? 'bg-primary animate-pulse' : ''}`}
          onClick={startListening}
          aria-label={isListening ? "Stop listening" : "Start voice assistant"}
        >
          {isListening ? (
            <Mic className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default VoiceAssistant;
