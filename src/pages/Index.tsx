
import React, { useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Camera, Watch, Mic } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Announce page load for screen readers
    const pageAnnouncement = document.getElementById('page-announcement');
    if (pageAnnouncement) {
      pageAnnouncement.textContent = 'Home page loaded. Use tab to navigate between sections.';
    }

    // Welcome message with instructions
    setTimeout(() => {
      toast({
        title: "Welcome to VisionFit",
        description: "Press the voice button in the bottom right corner and say 'help' for voice commands.",
        duration: 8000,
      });
    }, 1000);
  }, [toast]);

  const featureCards = [
    {
      title: 'Fitness Tracking',
      description: 'Monitor your steps, distance, and calories burned with real-time audio feedback.',
      icon: Activity,
      link: '/fitness',
      ariaLabel: 'Go to fitness tracking'
    },
    {
      title: 'Object Detection',
      description: 'Identify objects, read text, and recognize faces in your surroundings.',
      icon: Camera,
      link: '/object-detection',
      ariaLabel: 'Go to object detection'
    },
    {
      title: 'Smartwatch Pairing',
      description: 'Connect your smartwatch to receive haptic feedback and track your fitness.',
      icon: Watch,
      link: '/smartwatch',
      ariaLabel: 'Go to smartwatch pairing'
    },
    {
      title: 'Voice Assistant',
      description: 'Navigate and control the app using voice commands for a hands-free experience.',
      icon: Mic,
      link: '/voice-assistant',
      ariaLabel: 'Go to voice assistant'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <section className="text-center py-12 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Welcome to VisionFit</h2>
          <p className="text-xl mb-8">
            Your accessible fitness companion for navigation, object detection, and health tracking
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="text-lg h-12">
              <Activity className="mr-2 h-5 w-5" />
              Start Tracking
            </Button>
            <Button variant="outline" size="lg" className="text-lg h-12">
              <Camera className="mr-2 h-5 w-5" />
              Detect Objects
            </Button>
          </div>
        </section>

        <section className="py-6">
          <h2 className="text-2xl font-bold mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureCards.map((feature, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => window.location.href = feature.link}
                    aria-label={feature.ariaLabel}
                  >
                    Explore
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-6 border rounded-lg p-6 bg-accent/10">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li className="text-lg">Explore object detection to identify surroundings</li>
            <li className="text-lg">Connect your smartwatch for fitness tracking</li>
            <li className="text-lg">Use the voice assistant for hands-free navigation</li>
            <li className="text-lg">Customize accessibility settings to your preferences</li>
          </ol>
          <p className="mt-4 text-muted-foreground">
            Press the voice button in the bottom right and say "Help" at any time for assistance.
          </p>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
