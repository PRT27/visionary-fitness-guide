
import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  HelpCircle, 
  List, 
  History, 
  RefreshCw, 
  Book, 
  X, 
  MessageSquare, 
  Send
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const VoiceAssistantPage = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [volume, setVolume] = useState(80);
  const [speechRate, setSpeechRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  interface Conversation {
    id: number;
    user: string;
    assistant: string;
    timestamp: Date;
  }

  const commonCommands = [
    { command: "Find nearby objects", description: "Identifies objects in your surroundings" },
    { command: "Read text", description: "Reads text from signs, documents, or labels" },
    { command: "Start fitness tracking", description: "Begins tracking your steps and activity" },
    { command: "Check my stats", description: "Reports your current fitness statistics" },
    { command: "Pair my smartwatch", description: "Opens the smartwatch pairing screen" },
    { command: "Navigate to home", description: "Takes you to the main screen" },
    { command: "Turn on high contrast", description: "Enables high contrast mode for better visibility" },
    { command: "What's in front of me?", description: "Describes objects directly ahead" },
    { command: "Set a workout reminder", description: "Creates a reminder for future workouts" },
  ];

  // Announce page load for screen readers
  useEffect(() => {
    const pageAnnouncement = document.getElementById('page-announcement');
    if (pageAnnouncement) {
      pageAnnouncement.textContent = 'Voice assistant page loaded. Press the microphone button to start speaking.';
    }
    
    // Add some sample conversations
    setConversations([
      {
        id: 1,
        user: "What objects are around me?",
        assistant: "I can see a desk, chair, computer, and a potted plant nearby.",
        timestamp: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        id: 2,
        user: "How many steps have I taken today?",
        assistant: "You've taken 6,543 steps today, which is 65% of your daily goal of 10,000 steps.",
        timestamp: new Date(Date.now() - 43200000) // 12 hours ago
      },
      {
        id: 3,
        user: "Read the sign in front of me",
        assistant: "The sign reads: 'Opening Hours: Monday to Friday, 9 AM to 5 PM. Weekends: 10 AM to 4 PM.'",
        timestamp: new Date(Date.now() - 3600000) // 1 hour ago
      }
    ]);
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsListening(true);
      setTranscript('');
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        toast({
          title: "I'm listening",
          description: "Speak now...",
        });
        
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        
        toast({
          title: "Error listening",
          description: "Please try again",
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
        
        if (transcript) {
          processCommand(transcript);
        }
      };
      
      recognition.start();
    } else {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    setIsListening(false);
    
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.stop();
    }
    
    if (transcript) {
      processCommand(transcript);
    }
  };

  const processCommand = (command: string) => {
    // Simulate processing and response
    let response = '';
    
    const commandLower = command.toLowerCase();
    
    if (commandLower.includes('hello') || commandLower.includes('hi')) {
      response = "Hello! How can I assist you today?";
    } else if (commandLower.includes('step') || commandLower.includes('walk')) {
      response = "You've taken 6,543 steps today, which is about 65% of your daily goal.";
    } else if (commandLower.includes('object') || commandLower.includes('around me')) {
      response = "I can detect a desk, chair, computer monitor, keyboard, and a coffee mug in your vicinity.";
    } else if (commandLower.includes('read') || commandLower.includes('text')) {
      response = "I'll read any text I can see. Please point your camera at the text you want me to read.";
    } else if (commandLower.includes('time')) {
      const now = new Date();
      response = `The current time is ${now.toLocaleTimeString()}.`;
    } else if (commandLower.includes('weather')) {
      response = "I'm sorry, I don't have access to weather information at the moment.";
    } else if (commandLower.includes('navigate') || commandLower.includes('go to')) {
      if (commandLower.includes('home')) {
        response = "Navigating to the home page.";
        // Navigate after response in real app
      } else if (commandLower.includes('fitness')) {
        response = "Navigating to fitness tracking.";
        // Navigate after response in real app
      } else {
        response = "Could you specify which page you'd like to navigate to?";
      }
    } else if (commandLower.includes('help')) {
      response = "I can help with object detection, reading text, fitness tracking, and navigation. Try saying 'What objects are around me?' or 'Read this text'.";
    } else {
      response = "I'm not sure how to respond to that. Try asking about objects around you, reading text, or checking your fitness stats.";
    }
    
    // Add to conversation history
    const newConversation = {
      id: Date.now(),
      user: command,
      assistant: response,
      timestamp: new Date()
    };
    
    setConversations(prev => [...prev, newConversation]);
    
    // Speak the response
    if (!isMuted) {
      speakText(response);
    }
    
    // Reset transcript
    setTranscript('');
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = volume / 100;
      utterance.rate = speechRate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputText.trim()) {
      processCommand(inputText);
      setInputText('');
    }
  };

  const clearConversations = () => {
    setConversations([]);
    
    toast({
      title: "History Cleared",
      description: "All conversation history has been deleted",
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? "Voice Enabled" : "Voice Muted",
      description: isMuted ? "Assistant will now speak responses" : "Assistant will show text only",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Voice Assistant</h2>
            <p className="text-muted-foreground mt-1">
              Navigate and control the app using voice commands
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={isMuted ? "default" : "outline"}
              onClick={toggleMute}
              aria-label={isMuted ? "Enable voice" : "Mute voice"}
            >
              {isMuted ? (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  Unmute
                </>
              ) : (
                <>
                  <VolumeX className="mr-2 h-4 w-4" />
                  Mute
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Voice Assistant Help",
                  description: "Say commands like 'What objects are around me?' or 'Read this text'",
                  duration: 5000,
                });
                
                speakText("You can control the app with voice commands. Try saying 'What objects are around me?' or 'Read this text'.");
              }}
              aria-label="Voice assistant help"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Voice Conversations</CardTitle>
                {conversations.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearConversations}
                    aria-label="Clear conversation history"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto space-y-4">
              {conversations.length > 0 ? (
                <div className="space-y-4">
                  {conversations.map(conversation => (
                    <div key={conversation.id} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          You
                        </div>
                        <div className="bg-accent/10 rounded-lg p-3 min-w-0 flex-1">
                          <p>{conversation.user}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {conversation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                          AI
                        </div>
                        <div className="bg-primary/10 rounded-lg p-3 min-w-0 flex-1">
                          <p>{conversation.assistant}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {conversation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-1">Try saying "Hello" or "What can you do?"</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <form onSubmit={handleInputSubmit} className="flex items-center w-full gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a command or question..."
                  className="flex-1"
                />
                <Button type="submit" aria-label="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Voice Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  className={`w-full h-16 text-lg ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-5 w-5" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-5 w-5" />
                      Start Listening
                    </>
                  )}
                </Button>
                
                {isListening && (
                  <div className="p-3 bg-accent/10 rounded-md">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                      <span className="font-medium">Listening...</span>
                    </div>
                    
                    {transcript && (
                      <p className="mt-2 text-sm italic">&quot;{transcript}&quot;</p>
                    )}
                  </div>
                )}
                
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="volume">Volume: {volume}%</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        id="volume"
                        min={0}
                        max={100}
                        step={5}
                        value={[volume]}
                        onValueChange={(values) => setVolume(values[0])}
                      />
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="speech-rate">Speech Rate: {speechRate.toFixed(1)}x</Label>
                    </div>
                    <Slider
                      id="speech-rate"
                      min={0.5}
                      max={2}
                      step={0.1}
                      value={[speechRate]}
                      onValueChange={(values) => setSpeechRate(values[0])}
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      const testText = "This is a test of the speech rate and volume settings.";
                      speakText(testText);
                    }}
                  >
                    Test Voice Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Common Commands</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {commonCommands.map((cmd, index) => (
                    <li 
                      key={index} 
                      className="border-b pb-2 last:border-0 last:pb-0"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          processCommand(cmd.command);
                        }
                      }}
                      onClick={() => processCommand(cmd.command)}
                      role="button"
                      aria-label={`Say command: ${cmd.command}`}
                    >
                      <p className="font-medium text-primary cursor-pointer hover:underline">
                        &quot;{cmd.command}&quot;
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{cmd.description}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Voice Assistant Features</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="features">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="features">
                  <List className="h-4 w-4 mr-2" />
                  Features
                </TabsTrigger>
                <TabsTrigger value="tips">
                  <Book className="h-4 w-4 mr-2" />
                  Usage Tips
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Object Detection</h3>
                    <p className="text-sm text-muted-foreground">
                      Identify objects, people, and obstacles in your surroundings through voice commands.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Text Recognition</h3>
                    <p className="text-sm text-muted-foreground">
                      Read signs, labels, and documents aloud with natural voice synthesis.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Navigation Assistance</h3>
                    <p className="text-sm text-muted-foreground">
                      Get guided directions and spatial awareness through voice descriptions.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Fitness Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Request updates on your steps, distance, and activity through voice commands.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tips" className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-medium">Speak Clearly</h3>
                    <p className="text-sm text-muted-foreground">
                      Speak at a normal pace and volume for best recognition results.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium">Use Natural Language</h3>
                    <p className="text-sm text-muted-foreground">
                      Phrase commands as questions or statements rather than keywords.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium">Wait for Confirmation</h3>
                    <p className="text-sm text-muted-foreground">
                      The assistant will confirm when it's listening and when it's completed a task.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium">Use Voice or Text</h3>
                    <p className="text-sm text-muted-foreground">
                      You can type commands in the text input if speaking isn't convenient.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="continuous-listening">Continuous Listening</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically restart listening after each command
                      </p>
                    </div>
                    <Switch id="continuous-listening" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="keyword-activation">Keyword Activation</Label>
                      <p className="text-sm text-muted-foreground">
                        Activate by saying "Hey Assistant"
                      </p>
                    </div>
                    <Switch id="keyword-activation" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="conversation-history">Save Conversation History</Label>
                      <p className="text-sm text-muted-foreground">
                        Keep record of your voice commands and responses
                      </p>
                    </div>
                    <Switch id="conversation-history" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="haptic-feedback">Haptic Feedback</Label>
                      <p className="text-sm text-muted-foreground">
                        Vibrate device when voice commands are recognized
                      </p>
                    </div>
                    <Switch id="haptic-feedback" defaultChecked />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VoiceAssistantPage;
