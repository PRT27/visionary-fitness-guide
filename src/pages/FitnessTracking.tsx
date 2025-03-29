
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Calendar,
  Flame, 
  Heart, 
  Footprints, 
  Timer, 
  BarChart, 
  Play, 
  Pause,
  RefreshCw,
  Trophy,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FitnessTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [activeTime, setActiveTime] = useState(0);
  const [dailyGoal] = useState(10000);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { toast } = useToast();

  // Mock timer for workout tracking
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTracking) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        
        // Simulate steps & stats increasing during tracking
        setSteps(prev => Math.min(prev + Math.floor(Math.random() * 5) + 1, dailyGoal));
        setDistance(prev => prev + 0.002);
        setCalories(prev => prev + 0.05);
        setHeartRate(75 + Math.floor(Math.random() * 15));
        setActiveTime(prev => prev + 1);
        
        // Announce progress milestones
        if (steps % 1000 === 0 && steps > 0) {
          announceProgress();
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTracking, steps, dailyGoal]);

  // Initial page load announcement for screen readers
  useEffect(() => {
    const pageAnnouncement = document.getElementById('page-announcement');
    if (pageAnnouncement) {
      pageAnnouncement.textContent = 'Fitness tracking page loaded. Press start tracking to begin.';
    }
  }, []);

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    
    if (!isTracking) {
      toast({
        title: "Tracking Started",
        description: "Your activity is now being recorded",
      });
      
      // Announce for screen readers
      speakText("Fitness tracking started. Your steps, distance, and calories are now being tracked.");
    } else {
      toast({
        title: "Tracking Paused",
        description: `You've completed ${steps.toLocaleString()} steps so far`,
      });
      
      speakText(`Tracking paused. You've completed ${steps.toLocaleString()} steps so far.`);
    }
  };

  const resetTracking = () => {
    if (isTracking) setIsTracking(false);
    setSteps(0);
    setDistance(0);
    setCalories(0);
    setHeartRate(0);
    setActiveTime(0);
    setElapsedTime(0);
    
    toast({
      title: "Tracking Reset",
      description: "All stats have been reset to zero",
    });
    
    speakText("Tracking has been reset. All stats have been reset to zero.");
  };

  const announceProgress = () => {
    const percentComplete = Math.round((steps / dailyGoal) * 100);
    const announcement = `You've reached ${steps.toLocaleString()} steps, which is ${percentComplete}% of your daily goal.`;
    
    toast({
      title: `${steps.toLocaleString()} Steps Reached!`,
      description: `${percentComplete}% of your daily goal complete`,
    });
    
    speakText(announcement);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Fitness Tracking</h2>
            <p className="text-muted-foreground mt-1">
              Monitor your steps, distance, and calories in real-time
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={toggleTracking}
              variant={isTracking ? "outline" : "default"}
              className="min-w-[140px]"
              aria-label={isTracking ? "Pause tracking" : "Start tracking"}
            >
              {isTracking ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Tracking
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Tracking
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              onClick={resetTracking}
              aria-label="Reset tracking"
              disabled={steps === 0 && distance === 0}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Steps</CardTitle>
                <CardDescription>Daily Goal: {dailyGoal.toLocaleString()}</CardDescription>
              </div>
              <Footprints className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{steps.toLocaleString()}</div>
              <Progress value={(steps / dailyGoal) * 100} className="h-2" />
              <p className="text-sm mt-2 text-muted-foreground">{Math.round((steps / dailyGoal) * 100)}% of daily goal</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Distance</CardTitle>
                <CardDescription>Kilometers Traveled</CardDescription>
              </div>
              <Activity className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{distance.toFixed(2)} km</div>
              <p className="text-sm mt-2 text-muted-foreground">Approximately {Math.round(distance * 1310)} steps</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Calories</CardTitle>
                <CardDescription>Energy Burned</CardDescription>
              </div>
              <Flame className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{calories.toFixed(0)}</div>
              <p className="text-sm mt-2 text-muted-foreground">Based on your activity level</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>Current Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="font-medium">Heart Rate</h3>
                  </div>
                  <div className="text-2xl font-bold">{heartRate} BPM</div>
                  <p className="text-sm text-muted-foreground">Normal range</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Timer className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Active Time</h3>
                  </div>
                  <div className="text-2xl font-bold">{Math.floor(activeTime / 60)} min</div>
                  <p className="text-sm text-muted-foreground">Today's activity</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="font-medium">Pace</h3>
                  </div>
                  <div className="text-2xl font-bold">{activeTime > 0 ? (distance / (activeTime / 3600)).toFixed(1) : "0.0"} km/h</div>
                  <p className="text-sm text-muted-foreground">Current speed</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Elapsed Time</h3>
                  </div>
                  <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
                  <p className="text-sm text-muted-foreground">Session duration</p>
                </div>
              </div>
              
              {isTracking && (
                <div className="mt-6 p-4 bg-accent/10 rounded-lg border">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                    <p className="font-medium">Tracking Active</p>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Your activity is being monitored in real-time
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="steps">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="steps">Steps</TabsTrigger>
                  <TabsTrigger value="distance">Distance</TabsTrigger>
                  <TabsTrigger value="calories">Calories</TabsTrigger>
                </TabsList>
                
                <TabsContent value="steps" className="space-y-4">
                  <div className="h-[200px] flex items-end justify-between gap-2">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const height = Math.random() * 80 + 20;
                      return (
                        <div 
                          key={i} 
                          className="bg-primary/20 rounded-t-md flex-1"
                          style={{ height: `${height}%` }}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </TabsContent>
                
                <TabsContent value="distance" className="space-y-4">
                  <div className="h-[200px] flex items-end justify-between gap-2">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const height = Math.random() * 80 + 20;
                      return (
                        <div 
                          key={i} 
                          className="bg-blue-500/20 rounded-t-md flex-1"
                          style={{ height: `${height}%` }}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </TabsContent>
                
                <TabsContent value="calories" className="space-y-4">
                  <div className="h-[200px] flex items-end justify-between gap-2">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const height = Math.random() * 80 + 20;
                      return (
                        <div 
                          key={i} 
                          className="bg-red-500/20 rounded-t-md flex-1"
                          style={{ height: `${height}%` }}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Daily Goal</CardTitle>
                <Trophy className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={(steps / dailyGoal) * 100} className="h-3 mb-2" />
              <div className="flex justify-between text-sm">
                <span>{steps.toLocaleString()} steps</span>
                <span className="text-muted-foreground">Goal: {dailyGoal.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Today's Stats</CardTitle>
                <BarChart className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Steps</span>
                <span className="font-medium">{steps.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Distance</span>
                <span className="font-medium">{distance.toFixed(2)} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Calories</span>
                <span className="font-medium">{calories.toFixed(0)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Calendar</CardTitle>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {new Date().toLocaleDateString('en-US', { day: 'numeric' })}
                </div>
                <div className="text-lg">
                  {new Date().toLocaleDateString('en-US', { month: 'short' })}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default FitnessTracking;
