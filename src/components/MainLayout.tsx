
import React, { useState, useEffect } from 'react';
import { Menu, X, Activity, Camera, Watch, Mic, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import VoiceAssistant from './VoiceAssistant';
import AccessibilitySettings from './AccessibilitySettings';
import { useToast } from "@/components/ui/use-toast";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [announcePageChange, setAnnouncePageChange] = useState('');
  const { toast } = useToast();

  // Apply theme classes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
  }, [isDarkMode, isHighContrast]);

  // Announce page changes for screen readers
  useEffect(() => {
    if (announcePageChange) {
      const announcement = document.getElementById('page-announcement');
      if (announcement) {
        announcement.textContent = announcePageChange;
        setTimeout(() => {
          setAnnouncePageChange('');
        }, 1000);
      }
    }
  }, [announcePageChange]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    toast({
      title: sidebarOpen ? "Navigation menu closed" : "Navigation menu opened",
      description: "Use the TAB key to navigate through menu items",
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toast({
      title: isDarkMode ? "Light mode activated" : "Dark mode activated",
    });
  };

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
    toast({
      title: isHighContrast ? "Standard contrast mode activated" : "High contrast mode activated", 
    });
  };

  const navigateToPage = (page: string) => {
    setAnnouncePageChange(`Navigated to ${page} page`);
    setSidebarOpen(false);
  };

  const navItems = [
    { icon: Activity, label: 'Fitness Tracking', href: '/fitness' },
    { icon: Camera, label: 'Object Detection', href: '/object-detection' },
    { icon: Watch, label: 'Smartwatch Pairing', href: '/smartwatch' },
    { icon: Mic, label: 'Voice Assistant', href: '/voice-assistant' },
    { icon: Settings, label: 'Settings', onClick: () => setSettingsOpen(true) },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Screen reader announcements */}
      <div id="page-announcement" className="sr-only" aria-live="polite"></div>
      
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            className="mr-2 focus-visible"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <h1 className="text-2xl font-bold">
            <a href="/" onClick={() => navigateToPage('Home')} className="focus-visible">
              VisionFit
            </a>
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="focus-visible"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            onClick={toggleHighContrast}
            aria-label={isHighContrast ? "Switch to standard contrast" : "Switch to high contrast"}
            className="focus-visible text-sm"
          >
            {isHighContrast ? "Standard" : "High Contrast"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar navigation */}
        <nav
          className={cn(
            "fixed inset-y-0 left-0 transform z-30 w-64 bg-background border-r transition-transform duration-300 ease-in-out pt-16",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
          aria-hidden={!sidebarOpen}
        >
          <ul className="p-4 space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href || "#"}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    } else {
                      navigateToPage(item.label);
                    }
                  }}
                  className="flex items-center p-3 rounded-md clickable w-full text-left"
                  aria-label={item.label}
                >
                  <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  <span className="text-lg">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>

        {/* Floating voice assistant button */}
        <VoiceAssistant />

        {/* Accessibility settings modal */}
        {settingsOpen && (
          <AccessibilitySettings
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            isDarkMode={isDarkMode}
            isHighContrast={isHighContrast}
            onToggleDarkMode={toggleDarkMode}
            onToggleHighContrast={toggleHighContrast}
          />
        )}
      </div>
    </div>
  );
};

export default MainLayout;
