import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FontSize = "small" | "medium" | "large" | "extra-large";
export type ContrastMode = "normal" | "high";

interface AccessibilityState {
  fontSize: FontSize;
  contrastMode: ContrastMode;
  reducedMotion: boolean;
  setFontSize: (size: FontSize) => void;
  setContrastMode: (mode: ContrastMode) => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const fontSizeMap: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
  "extra-large": "20px",
};

export const fontSizeLabels: Record<FontSize, string> = {
  small: "Small (14px)",
  medium: "Medium (16px)",
  large: "Large (18px)",
  "extra-large": "Extra Large (20px)",
};

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      fontSize: "medium",
      contrastMode: "normal",
      reducedMotion: false,
      setFontSize: (fontSize) => set({ fontSize }),
      setContrastMode: (contrastMode) => set({ contrastMode }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    }),
    {
      name: "isms-accessibility-preferences",
    }
  )
);
