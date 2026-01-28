import React, { useEffect } from "react";
import { useAccessibilityStore, fontSizeMap } from "@/hooks/use-accessibility";

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const { fontSize, contrastMode, reducedMotion } = useAccessibilityStore();

  useEffect(() => {
    // Apply font size to root element
    document.documentElement.style.fontSize = fontSizeMap[fontSize];
  }, [fontSize]);

  useEffect(() => {
    // Apply high contrast mode
    if (contrastMode === "high") {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [contrastMode]);

  useEffect(() => {
    // Apply reduced motion preference
    if (reducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [reducedMotion]);

  return <>{children}</>;
};
