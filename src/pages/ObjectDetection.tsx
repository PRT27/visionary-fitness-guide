import React, { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Camera, Eye, FileText, Palette, X, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ObjectDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.6);
  const [autoRead, setAutoRead] = useState(true);
  const [activeTab, setActiveTab] = useState('object');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Announce page load for screen readers
    const pageAnnouncement = document.getElementById('page-announcement');
    if (pageAnnouncement) {
      pageAnnouncement.textContent = 'Object detection page loaded. Camera access required.';
    }

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Media devices API not supported");
      }
      
      // Try getting all available cameras first
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available video devices:', videoDevices);
      
      // Request camera with more options and higher resolution
      const constraints = { 
        audio: false,
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      };
      
      console.log('Requesting camera with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!stream) {
        throw new Error("Failed to get media stream");
      }
      
      console.log('Camera stream obtained:', stream);
      console.log('Stream tracks:', stream.getTracks());
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Add event listeners to debug video element issues
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current?.play().catch(e => console.error('Error playing video:', e));
        };
        
        videoRef.current.onplay = () => {
          console.log('Video started playing, dimensions:', 
            videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
          setIsStreaming(true);
        };
        
        videoRef.current.onerror = (e) => {
          console.error('Video element error:', e);
        };
        
        toast({
          title: "Camera Started",
          description: "Point camera at objects to detect them",
        });
      } else {
        console.error('Video ref is not available');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Error",
        description: error instanceof Error ? error.message : "Unknown camera error",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => {
        console.log('Stopping track:', track.label);
        track.stop();
      });
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      console.log('Camera stopped');
    }
  };

  const captureFrame = () => {
    if (!isStreaming || !videoRef.current || !canvasRef.current) {
      console.log('Cannot capture: streaming=', isStreaming, 'videoRef=', !!videoRef.current, 'canvasRef=', !!canvasRef.current);
      return;
    }
    
    setIsProcessing(true);
    
    const context = canvasRef.current.getContext('2d');
    if (context && videoRef.current) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      
      console.log('Capturing frame with dimensions:', width, 'x', height);
      
      // Set canvas dimensions to match video
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      
      // Draw the video frame to the canvas
      context.drawImage(videoRef.current, 0, 0, width, height);
      
      // In a real app, you would send this frame to an object detection API
      // For demo purposes, we'll simulate object detection
      simulateObjectDetection(activeTab);
    } else {
      console.error('Failed to get canvas context or video element');
      setIsProcessing(false);
    }
  };

  const simulateObjectDetection = (mode: string) => {
    // This simulates the API response for different detection modes
    setTimeout(() => {
      let results: string[] = [];
      
      switch (mode) {
        case 'object':
          results = ['Chair (92%)', 'Desk (88%)', 'Computer (95%)', 'Plant (72%)'];
          break;
        case 'text':
          results = ['EXIT sign', 'Welcome to', 'Opening hours: 9AM-5PM', 'Please wait here'];
          break;
        case 'face':
          results = ['Person detected (likely male, adult)', 'Appears to be smiling', 'Glasses detected'];
          break;
        case 'color':
          results = ['Dominant: Blue (45%)', 'Secondary: White (30%)', 'Accent: Gray (15%)', 'Red (10%)'];
          break;
        default:
          results = ['No detection results'];
      }
      
      setDetectedObjects(results);
      
      // Read results aloud if autoRead is enabled
      if (autoRead && results.length > 0) {
        const textToRead = `${mode} detection results: ${results.join(', ')}`;
        speakText(textToRead);
      }
      
      setIsProcessing(false);
      
      toast({
        title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Detection Complete`,
        description: `${results.length} items detected`,
      });
    }, 2000);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const clearResults = () => {
    setDetectedObjects([]);
    // Cancel any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Object Detection</h2>
            <p className="text-muted-foreground mt-1">
              Identify objects, text, faces, and colors in your surroundings
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={isStreaming ? "destructive" : "default"}
              onClick={isStreaming ? stopCamera : startCamera}
              aria-label={isStreaming ? "Stop camera" : "Start camera"}
              className="min-w-[120px]"
            >
              {isStreaming ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Stop Camera
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={captureFrame}
              disabled={!isStreaming || isProcessing}
              aria-label="Capture and analyze frame"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>Camera View</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center min-h-[300px] bg-muted/30 relative">
              {isStreaming ? (
                <video
                  ref={videoRef}
                  className="max-w-full max-h-[50vh] rounded-md"
                  playsInline
                  autoPlay
                  muted
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Camera feed will appear here</p>
                  <p className="text-sm mt-2">Click "Start Camera" to begin</p>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
              
              {isProcessing && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw className="h-10 w-10 mx-auto animate-spin text-primary" />
                    <p className="mt-2 font-medium">Analyzing Image...</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-read"
                  checked={autoRead}
                  onCheckedChange={setAutoRead}
                />
                <Label htmlFor="auto-read">Auto-read results</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">
                  Confidence: {Math.round(confidenceThreshold * 100)}%
                </span>
                <Slider
                  value={[confidenceThreshold * 100]}
                  min={30}
                  max={95}
                  step={5}
                  className="w-[120px]"
                  onValueChange={(values) => setConfidenceThreshold(values[0] / 100)}
                />
              </div>
            </CardFooter>
          </Card>
          
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Detection Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="object" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="object" className="flex flex-col items-center py-2 px-1">
                    <Eye className="h-4 w-4 mb-1" />
                    <span>Objects</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex flex-col items-center py-2 px-1">
                    <FileText className="h-4 w-4 mb-1" />
                    <span>Text</span>
                  </TabsTrigger>
                  <TabsTrigger value="face" className="flex flex-col items-center py-2 px-1">
                    <Camera className="h-4 w-4 mb-1" />
                    <span>Faces</span>
                  </TabsTrigger>
                  <TabsTrigger value="color" className="flex flex-col items-center py-2 px-1">
                    <Palette className="h-4 w-4 mb-1" />
                    <span>Colors</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="border rounded-md p-4 min-h-[250px]">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">
                      {activeTab === 'object' && 'Detected Objects'}
                      {activeTab === 'text' && 'Recognized Text'}
                      {activeTab === 'face' && 'Face Recognition'}
                      {activeTab === 'color' && 'Color Analysis'}
                    </h3>
                    
                    {detectedObjects.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearResults}
                        aria-label="Clear results"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {detectedObjects.length > 0 ? (
                    <ul className="space-y-2">
                      {detectedObjects.map((object, index) => (
                        <li key={index} className="p-2 bg-accent/10 rounded-md">
                          {object}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-10">
                      <p>No {activeTab} detection results yet</p>
                      <p className="text-sm mt-2">Capture an image to begin analysis</p>
                    </div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Detection Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Object Detection</h3>
                <p>Point camera at objects to identify them and their approximate distance.</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Text Recognition</h3>
                <p>Hold the camera steady in front of text. Works best with clear, printed text.</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Face Recognition</h3>
                <p>Position faces within the frame. The app will describe detected persons.</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Color Detection</h3>
                <p>Point at any surface to analyze its color composition.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ObjectDetection;
