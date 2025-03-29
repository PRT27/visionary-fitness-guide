
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Watch, 
  Bluetooth, 
  Smartphone, 
  Info, 
  Check, 
  Activity, 
  Vibrate,
  Bell, 
  RefreshCw, 
  X, 
  HelpCircle,
  Settings
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SmartwatchPairing = () => {
  const [isPairing, setIsPairing] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [syncData, setSyncData] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const { toast } = useToast();

  interface Device {
    id: string;
    name: string;
    type: 'watch' | 'band' | 'other';
    batteryLevel?: number;
    lastSync?: string;
  }

  // Simulate scanning for devices
  useEffect(() => {
    if (isPairing) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + 5;
          
          // When scan reaches 100%, populate mock devices
          if (newProgress >= 100) {
            clearInterval(interval);
            
            setTimeout(() => {
              const mockDevices: Device[] = [
                { id: '1', name: 'Fitness Watch Pro', type: 'watch', batteryLevel: 72, lastSync: '2 hours ago' },
                { id: '2', name: 'Activity Band 3', type: 'band', batteryLevel: 85, lastSync: 'Never' },
                { id: '3', name: 'SmartWatch X2', type: 'watch', batteryLevel: 45, lastSync: 'Never' },
              ];
              
              setAvailableDevices(mockDevices);
              setIsPairing(false);
              
              // Announce devices found for screen readers
              const announcement = `${mockDevices.length} devices found. Use tab to navigate through the list.`;
              speakText(announcement);
              
              toast({
                title: "Scan Complete",
                description: `${mockDevices.length} devices found`,
              });
            }, 500);
            
            return 100;
          }
          
          return newProgress;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isPairing, toast]);

  // Announce page load for screen readers
  useEffect(() => {
    const pageAnnouncement = document.getElementById('page-announcement');
    if (pageAnnouncement) {
      pageAnnouncement.textContent = 'Smartwatch pairing page loaded. Press scan to search for devices.';
    }
  }, []);

  // Simulate battery level updates for paired device
  useEffect(() => {
    if (isPaired && selectedDevice) {
      const interval = setInterval(() => {
        const newLevel = Math.max(0, Math.min(100, batteryLevel + (Math.random() > 0.7 ? -1 : 0)));
        setBatteryLevel(newLevel);
        
        // Low battery warning
        if (newLevel === 20) {
          toast({
            title: "Low Battery",
            description: `${selectedDevice.name} is at 20% battery`,
            variant: "destructive",
          });
        }
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isPaired, selectedDevice, batteryLevel, toast]);

  const startScan = () => {
    setIsPairing(true);
    setScanProgress(0);
    setAvailableDevices([]);
    
    toast({
      title: "Scanning for Devices",
      description: "Please make sure your device is in pairing mode",
    });
    
    speakText("Scanning for nearby smartwatches and fitness trackers. Please make sure your device is in pairing mode and within range.");
  };

  const pairDevice = (device: Device) => {
    setSelectedDevice(device);
    
    // Simulate pairing process
    toast({
      title: "Pairing...",
      description: `Connecting to ${device.name}`,
    });
    
    speakText(`Pairing with ${device.name}. Please wait.`);
    
    setTimeout(() => {
      setIsPaired(true);
      setBatteryLevel(device.batteryLevel || Math.floor(Math.random() * 40) + 60);
      
      toast({
        title: "Device Paired",
        description: `Successfully connected to ${device.name}`,
      });
      
      speakText(`Successfully paired with ${device.name}. You can now sync fitness data and receive notifications.`);
    }, 2000);
  };

  const unpairDevice = () => {
    if (!selectedDevice) return;
    
    toast({
      title: "Disconnecting...",
      description: `Unpairing ${selectedDevice.name}`,
    });
    
    speakText(`Disconnecting from ${selectedDevice.name}.`);
    
    setTimeout(() => {
      setIsPaired(false);
      setSelectedDevice(null);
      
      toast({
        title: "Device Unpaired",
        description: "Device has been disconnected",
      });
      
      speakText("Device has been successfully unpaired.");
    }, 1500);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Smartwatch Pairing</h2>
            <p className="text-muted-foreground mt-1">
              Connect your smartwatch or fitness tracker for enhanced tracking
            </p>
          </div>
          
          <div className="flex gap-2">
            {!isPaired ? (
              <Button
                onClick={startScan}
                disabled={isPairing}
                className="min-w-[140px]"
                aria-label="Scan for devices"
              >
                {isPairing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Bluetooth className="mr-2 h-4 w-4" />
                    Scan Devices
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={unpairDevice}
                aria-label="Unpair device"
              >
                <X className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Pairing Instructions",
                  description: "Make sure Bluetooth is enabled and your device is in pairing mode",
                  duration: 5000,
                });
                
                speakText("To pair your device, make sure Bluetooth is enabled on your phone and your smartwatch is in pairing mode. Then press the scan button to search for available devices.");
              }}
              aria-label="Show pairing help"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isPairing && (
          <Card>
            <CardHeader>
              <CardTitle>Scanning for Devices</CardTitle>
              <CardDescription>
                Make sure your device is in pairing mode and within range
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={scanProgress} className="h-2 mb-2" />
              <div className="flex items-center text-sm">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span>Searching for nearby devices...</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!isPaired && availableDevices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Available Devices</CardTitle>
              <CardDescription>
                Select a device to pair
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {availableDevices.map(device => (
                  <li 
                    key={device.id}
                    className="border rounded-lg p-4 hover:bg-accent/10 transition-colors cursor-pointer"
                    onClick={() => pairDevice(device)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Pair with ${device.name}`}
                    onKeyDown={(e) => e.key === 'Enter' && pairDevice(device)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {device.type === 'watch' ? (
                          <Watch className="h-6 w-6 mr-3 text-primary" />
                        ) : (
                          <Activity className="h-6 w-6 mr-3 text-primary" />
                        )}
                        <div>
                          <h3 className="font-medium">{device.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {device.type === 'watch' ? 'Smartwatch' : 'Fitness Band'}
                            {device.batteryLevel && ` • ${device.batteryLevel}% battery`}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" aria-label={`Connect to ${device.name}`}>
                        Connect
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {isPaired && selectedDevice && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedDevice.name}</CardTitle>
                    <CardDescription>Connected Device</CardDescription>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Connected
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-accent/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Battery Level</span>
                    <span className="text-sm">{batteryLevel}%</span>
                  </div>
                  <Progress 
                    value={batteryLevel} 
                    className="h-2" 
                    style={{ 
                      background: batteryLevel <= 20 ? 'rgba(239, 68, 68, 0.2)' : undefined,
                      color: batteryLevel <= 20 ? 'rgb(239, 68, 68)' : undefined
                    }}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="notifications">Notifications</Label>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <Label htmlFor="sync-data">Sync Fitness Data</Label>
                    </div>
                    <Switch
                      id="sync-data"
                      checked={syncData}
                      onCheckedChange={setSyncData}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Vibrate className="h-4 w-4" />
                      <Label htmlFor="haptic">Haptic Feedback</Label>
                    </div>
                    <Switch
                      id="haptic"
                      checked={hapticFeedback}
                      onCheckedChange={setHapticFeedback}
                    />
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" onClick={() => {
                  toast({
                    title: "Test Notification Sent",
                    description: "Check your smartwatch for the test notification",
                  });
                  
                  speakText("A test notification has been sent to your smartwatch.");
                }}>
                  Send Test Notification
                </Button>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Device Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="settings">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="data">Data Sync</TabsTrigger>
                    <TabsTrigger value="info">Device Info</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3 border rounded-md p-4">
                        <h3 className="font-medium flex items-center">
                          <Bell className="h-4 w-4 mr-2" />
                          Notification Settings
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="calls">Incoming Calls</Label>
                            <Switch id="calls" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="messages">Messages</Label>
                            <Switch id="messages" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="apps">App Notifications</Label>
                            <Switch id="apps" defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 border rounded-md p-4">
                        <h3 className="font-medium flex items-center">
                          <Activity className="h-4 w-4 mr-2" />
                          Activity Tracking
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="continuous-hr">Continuous Heart Rate</Label>
                            <Switch id="continuous-hr" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="sleep-tracking">Sleep Tracking</Label>
                            <Switch id="sleep-tracking" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-activity">Auto Activity Detection</Label>
                            <Switch id="auto-activity" defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 border rounded-md p-4">
                        <h3 className="font-medium flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Display Settings
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="always-on">Always On Display</Label>
                            <Switch id="always-on" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="wrist-gesture">Wrist Gesture</Label>
                            <Switch id="wrist-gesture" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-brightness">Auto Brightness</Label>
                            <Switch id="auto-brightness" defaultChecked />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 border rounded-md p-4">
                        <h3 className="font-medium flex items-center">
                          <Smartphone className="h-4 w-4 mr-2" />
                          Connection Settings
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-connect">Auto Reconnect</Label>
                            <Switch id="auto-connect" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="power-save">Power Saving Mode</Label>
                            <Switch id="power-save" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="location">Location Services</Label>
                            <Switch id="location" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="data" className="space-y-4">
                    <div className="border rounded-md p-4 bg-accent/10">
                      <div className="flex items-center mb-4">
                        <RefreshCw className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Data Synchronization</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Steps & Activity</span>
                            <span className="text-sm text-muted-foreground">Last synced: 12 min ago</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Heart Rate Data</span>
                            <span className="text-sm text-muted-foreground">Last synced: 12 min ago</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Sleep Data</span>
                            <span className="text-sm text-muted-foreground">Last synced: 8 hours ago</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            toast({
                              title: "Syncing Data",
                              description: "Retrieving latest data from your device",
                            });
                            
                            speakText("Syncing data from your smartwatch. This may take a moment.");
                            
                            setTimeout(() => {
                              toast({
                                title: "Sync Complete",
                                description: "All data has been updated",
                              });
                              
                              speakText("Data synchronization complete. All information is up to date.");
                            }, 3000);
                          }}
                        >
                          Sync Now
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="info" className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Device Information
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 py-2 border-b">
                          <span className="text-sm text-muted-foreground">Device Name</span>
                          <span className="text-sm font-medium">{selectedDevice.name}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 py-2 border-b">
                          <span className="text-sm text-muted-foreground">Device Type</span>
                          <span className="text-sm font-medium capitalize">{selectedDevice.type}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 py-2 border-b">
                          <span className="text-sm text-muted-foreground">Battery Level</span>
                          <span className="text-sm font-medium">{batteryLevel}%</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 py-2 border-b">
                          <span className="text-sm text-muted-foreground">Firmware Version</span>
                          <span className="text-sm font-medium">v3.4.2</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 py-2 border-b">
                          <span className="text-sm text-muted-foreground">Connection Type</span>
                          <span className="text-sm font-medium">Bluetooth 5.0</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 py-2 border-b">
                          <span className="text-sm text-muted-foreground">MAC Address</span>
                          <span className="text-sm font-medium">A4:C3:F0:85:7D:E2</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 py-2">
                          <span className="text-sm text-muted-foreground">Paired Date</span>
                          <span className="text-sm font-medium">Today</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Checking for Updates",
                          description: "Searching for firmware updates",
                        });
                        
                        speakText("Checking for firmware updates for your device.");
                        
                        setTimeout(() => {
                          toast({
                            title: "No Updates Found",
                            description: "Your device firmware is up to date",
                          });
                          
                          speakText("Your device firmware is up to date. No updates are currently available.");
                        }, 2000);
                      }}
                    >
                      Check for Updates
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
        
        {!isPaired && !isPairing && availableDevices.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Device</CardTitle>
              <CardDescription>
                Pair your smartwatch or fitness tracker to enable enhanced features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-5 text-center">
                  <Bluetooth className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-medium mb-2">Enable Bluetooth</h3>
                  <p className="text-sm text-muted-foreground">
                    Make sure Bluetooth is enabled on your device
                  </p>
                </div>
                
                <div className="border rounded-lg p-5 text-center">
                  <Watch className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-medium mb-2">Pairing Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Set your smartwatch to pairing mode
                  </p>
                </div>
                
                <div className="border rounded-lg p-5 text-center">
                  <Smartphone className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-medium mb-2">Scan Devices</h3>
                  <p className="text-sm text-muted-foreground">
                    Press the scan button to find nearby devices
                  </p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-accent/10">
                <h3 className="font-medium mb-2 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  Compatible Devices
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li className="text-sm">Fitness Watch Pro Series</li>
                  <li className="text-sm">Activity Tracker Bands (2nd gen or newer)</li>
                  <li className="text-sm">SmartWatch X Series</li>
                  <li className="text-sm">Health Monitor Bands</li>
                  <li className="text-sm">Most Bluetooth 4.0+ fitness devices</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={startScan} className="min-w-[200px]">
                <Bluetooth className="mr-2 h-4 w-4" />
                Start Scanning
              </Button>
            </CardFooter>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Benefits of Connecting Your Smartwatch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Real-time Fitness Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor steps, heart rate, and activity with voice feedback
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Haptic Navigation</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive direction guidance through vibration patterns
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Health Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Get personalized health recommendations based on your data
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive app alerts and messages directly on your wrist
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SmartwatchPairing;
