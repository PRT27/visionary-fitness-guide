
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Bold, 
  BookOpen, 
  Moon, 
  Sun, 
  Volume2, 
  Volume, 
  Activity, 
  ZoomIn, 
  PanelLeft, 
  MousePointer
} from 'lucide-react';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  isHighContrast: boolean;
  onToggleDarkMode: () => void;
  onToggleHighContrast: () => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  isHighContrast,
  onToggleDarkMode,
  onToggleHighContrast
}) => {
  const [fontSize, setFontSize] = useState(100);
  const [speechRate, setSpeechRate] = useState(1);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(true);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);
  const [pageTimeout, setPageTimeout] = useState(30);
  
  const applySettings = () => {
    // Apply font size to the document
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    // Set up reduced motion if needed
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
    
    // Update speech rate for screen readers
    if (window.speechSynthesis) {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.rate = speechRate;
        // This just sets up the rate, doesn't actually speak
      }
    }
    
    onClose();
  };
  
  const resetSettings = () => {
    setFontSize(100);
    setSpeechRate(1);
    setReduceMotion(false);
    document.documentElement.style.fontSize = '100%';
    document.documentElement.classList.remove('reduce-motion');
  };
  
  const speakSample = () => {
    if (window.speechSynthesis) {
      const sample = new SpeechSynthesisUtterance("This is a sample of the voice rate and pitch settings.");
      sample.rate = speechRate;
      window.speechSynthesis.speak(sample);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Accessibility Settings</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Sun className="mr-2 h-5 w-5" />
              Display Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Moon className="h-4 w-4" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={onToggleDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bold className="h-4 w-4" />
                <Label htmlFor="high-contrast">High Contrast</Label>
              </div>
              <Switch
                id="high-contrast"
                checked={isHighContrast}
                onCheckedChange={onToggleHighContrast}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ZoomIn className="h-4 w-4" />
                  <Label htmlFor="font-size">Font Size: {fontSize}%</Label>
                </div>
              </div>
              <Slider
                id="font-size"
                min={75}
                max={200}
                step={5}
                value={[fontSize]}
                onValueChange={(values) => setFontSize(values[0])}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <Label htmlFor="reduce-motion">Reduce Motion</Label>
              </div>
              <Switch
                id="reduce-motion"
                checked={reduceMotion}
                onCheckedChange={setReduceMotion}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Volume2 className="mr-2 h-5 w-5" />
              Screen Reader Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <Label htmlFor="screen-reader">Screen Reader Support</Label>
              </div>
              <Switch
                id="screen-reader"
                checked={screenReaderEnabled}
                onCheckedChange={setScreenReaderEnabled}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume className="h-4 w-4" />
                  <Label htmlFor="speech-rate">Speech Rate: {speechRate.toFixed(1)}x</Label>
                </div>
              </div>
              <Slider
                id="speech-rate"
                min={0.5}
                max={2}
                step={0.1}
                value={[speechRate]}
                onValueChange={(values) => setSpeechRate(values[0])}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={speakSample}
                className="mt-2"
              >
                Test Speech
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <MousePointer className="mr-2 h-5 w-5" />
              Navigation Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PanelLeft className="h-4 w-4" />
                <Label htmlFor="keyboard-navigation">Enhanced Keyboard Navigation</Label>
              </div>
              <Switch
                id="keyboard-navigation"
                checked={keyboardNavigation}
                onCheckedChange={setKeyboardNavigation}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="page-timeout">Page Timeout (seconds): {pageTimeout}</Label>
              </div>
              <Slider
                id="page-timeout"
                min={10}
                max={60}
                step={5}
                value={[pageTimeout]}
                onValueChange={(values) => setPageTimeout(values[0])}
              />
              <p className="text-sm text-muted-foreground">
                Time before confirmation is required for navigation actions
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={applySettings}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilitySettings;
