import React from "react";
import { motion } from "framer-motion";
import { Keyboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const shortcuts = [
  { key: "Ctrl+A", action: "Select all patients" },
  { key: "Delete", action: "Acknowledge selected" },
  { key: "E", action: "Export selected to CSV" },
  { key: "Esc", action: "Clear selection" },
];

export const KeyboardShortcutsHelp: React.FC = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          aria-label="View keyboard shortcuts"
        >
          <Keyboard className="w-4 h-4" />
          <span className="hidden sm:inline">Shortcuts</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="end" className="w-64 p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3"
        >
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            Keyboard Shortcuts
          </h4>
          <ul className="space-y-1.5" role="list" aria-label="Keyboard shortcuts list">
            {shortcuts.map((shortcut) => (
              <li
                key={shortcut.key}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{shortcut.action}</span>
                <kbd className="px-2 py-0.5 rounded bg-muted text-xs font-mono">
                  {shortcut.key}
                </kbd>
              </li>
            ))}
          </ul>
        </motion.div>
      </TooltipContent>
    </Tooltip>
  );
};
