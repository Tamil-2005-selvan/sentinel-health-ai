import React from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Type,
  Contrast,
  RotateCcw,
  ZoomIn,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  useAccessibilityStore,
  FontSize,
  fontSizeLabels,
} from "@/hooks/use-accessibility";

const fontSizeValues: FontSize[] = ["small", "medium", "large", "extra-large"];

const AccessibilityPreferences: React.FC = () => {
  const {
    fontSize,
    contrastMode,
    reducedMotion,
    setFontSize,
    setContrastMode,
    setReducedMotion,
  } = useAccessibilityStore();

  const fontSizeIndex = fontSizeValues.indexOf(fontSize);

  const handleFontSizeChange = (value: number[]) => {
    const newSize = fontSizeValues[value[0]];
    setFontSize(newSize);
  };

  const handleContrastToggle = (checked: boolean) => {
    setContrastMode(checked ? "high" : "normal");
    toast.success(
      checked ? "High contrast mode enabled" : "Normal contrast mode restored"
    );
  };

  const handleReducedMotionToggle = (checked: boolean) => {
    setReducedMotion(checked);
    toast.success(
      checked ? "Animations reduced" : "Animations enabled"
    );
  };

  const handleResetDefaults = () => {
    setFontSize("medium");
    setContrastMode("normal");
    setReducedMotion(false);
    toast.success("Accessibility settings reset to defaults");
  };

  return (
    <div className="space-y-6">
      {/* Font Size Control */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <Type className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">Text Size</h4>
            <p className="text-sm text-muted-foreground">
              Adjust the base font size for better readability
            </p>
          </div>
        </div>
        <div className="space-y-4 pl-13">
          <div className="flex items-center gap-4">
            <ZoomIn className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
            <Slider
              value={[fontSizeIndex]}
              min={0}
              max={3}
              step={1}
              onValueChange={handleFontSizeChange}
              className="flex-1"
              aria-label="Font size"
              aria-valuetext={fontSizeLabels[fontSize]}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>A</span>
            <span className="text-sm">A</span>
            <span className="text-base">A</span>
            <span className="text-lg">A</span>
          </div>
          <p className="text-sm text-center font-medium text-foreground" aria-live="polite">
            {fontSizeLabels[fontSize]}
          </p>
        </div>
      </div>

      <Separator />

      {/* High Contrast Mode */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Contrast className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <Label htmlFor="high-contrast" className="font-medium text-foreground cursor-pointer">
                High Contrast Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
          </div>
          <Switch
            id="high-contrast"
            checked={contrastMode === "high"}
            onCheckedChange={handleContrastToggle}
            aria-describedby="high-contrast-description"
          />
        </div>
        <p id="high-contrast-description" className="sr-only">
          Toggle high contrast mode for improved visibility. Currently {contrastMode === "high" ? "enabled" : "disabled"}.
        </p>
      </div>

      <Separator />

      {/* Reduced Motion */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <Label htmlFor="reduced-motion" className="font-medium text-foreground cursor-pointer">
                Reduce Motion
              </Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
          </div>
          <Switch
            id="reduced-motion"
            checked={reducedMotion}
            onCheckedChange={handleReducedMotionToggle}
            aria-describedby="reduced-motion-description"
          />
        </div>
        <p id="reduced-motion-description" className="sr-only">
          Toggle reduced motion to minimize animations. Currently {reducedMotion ? "enabled" : "disabled"}.
        </p>
      </div>

      <Separator />

      {/* Preview Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10">
            <Eye className="w-5 h-5 text-secondary" aria-hidden="true" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">Preview</h4>
            <p className="text-sm text-muted-foreground">
              See how your settings affect the display
            </p>
          </div>
        </div>
        <motion.div
          className="p-4 rounded-lg border bg-card"
          initial={false}
          animate={reducedMotion ? {} : { scale: [0.98, 1] }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-medium text-foreground mb-2">Sample Patient Alert</p>
          <p className="text-muted-foreground text-sm mb-3">
            Patient John Doe in Room 204 requires immediate attention. 
            Heart rate elevated to 120 BPM.
          </p>
          <div className="flex gap-2">
            <span className="px-2 py-1 text-xs font-medium rounded bg-status-critical text-white">
              Critical
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded bg-primary text-primary-foreground">
              Cardiology
            </span>
          </div>
        </motion.div>
      </div>

      <Separator />

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleResetDefaults}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default AccessibilityPreferences;
