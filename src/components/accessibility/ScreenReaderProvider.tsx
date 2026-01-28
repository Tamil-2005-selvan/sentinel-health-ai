import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

interface Announcement {
  id: string;
  message: string;
  priority: "polite" | "assertive";
}

interface ScreenReaderContextType {
  announce: (message: string, priority?: "polite" | "assertive") => void;
  announcePolite: (message: string) => void;
  announceAssertive: (message: string) => void;
}

const ScreenReaderContext = createContext<ScreenReaderContextType | null>(null);

export const useScreenReader = () => {
  const context = useContext(ScreenReaderContext);
  if (!context) {
    throw new Error("useScreenReader must be used within ScreenReaderProvider");
  }
  return context;
};

export const ScreenReaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [politeAnnouncement, setPoliteAnnouncement] = useState("");
  const [assertiveAnnouncement, setAssertiveAnnouncement] = useState("");
  const politeTimeoutRef = useRef<NodeJS.Timeout>();
  const assertiveTimeoutRef = useRef<NodeJS.Timeout>();

  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    if (priority === "assertive") {
      // Clear and reset to trigger new announcement
      setAssertiveAnnouncement("");
      if (assertiveTimeoutRef.current) {
        clearTimeout(assertiveTimeoutRef.current);
      }
      assertiveTimeoutRef.current = setTimeout(() => {
        setAssertiveAnnouncement(message);
        // Clear after announcement
        assertiveTimeoutRef.current = setTimeout(() => {
          setAssertiveAnnouncement("");
        }, 3000);
      }, 100);
    } else {
      setPoliteAnnouncement("");
      if (politeTimeoutRef.current) {
        clearTimeout(politeTimeoutRef.current);
      }
      politeTimeoutRef.current = setTimeout(() => {
        setPoliteAnnouncement(message);
        politeTimeoutRef.current = setTimeout(() => {
          setPoliteAnnouncement("");
        }, 3000);
      }, 100);
    }
  }, []);

  const announcePolite = useCallback((message: string) => {
    announce(message, "polite");
  }, [announce]);

  const announceAssertive = useCallback((message: string) => {
    announce(message, "assertive");
  }, [announce]);

  useEffect(() => {
    return () => {
      if (politeTimeoutRef.current) clearTimeout(politeTimeoutRef.current);
      if (assertiveTimeoutRef.current) clearTimeout(assertiveTimeoutRef.current);
    };
  }, []);

  return (
    <ScreenReaderContext.Provider value={{ announce, announcePolite, announceAssertive }}>
      {children}
      
      {/* Polite live region - for non-urgent updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeAnnouncement}
      </div>
      
      {/* Assertive live region - for urgent/critical updates */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveAnnouncement}
      </div>
    </ScreenReaderContext.Provider>
  );
};
