import { useEffect, useCallback } from "react";

interface KeyboardShortcutsOptions {
  onSelectAll: () => void;
  onAcknowledge: () => void;
  onExport: () => void;
  onClearSelection: () => void;
  hasSelection: boolean;
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onSelectAll,
  onAcknowledge,
  onExport,
  onClearSelection,
  hasSelection,
  enabled = true,
}: KeyboardShortcutsOptions) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore if user is typing in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl/Cmd + A: Select all
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
        event.preventDefault();
        onSelectAll();
        return;
      }

      // Only process shortcuts that require selection
      if (!hasSelection) return;

      // Delete or Backspace: Acknowledge
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        onAcknowledge();
        return;
      }

      // E: Export
      if (event.key.toLowerCase() === "e" && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        onExport();
        return;
      }

      // Escape: Clear selection
      if (event.key === "Escape") {
        event.preventDefault();
        onClearSelection();
        return;
      }
    },
    [enabled, hasSelection, onSelectAll, onAcknowledge, onExport, onClearSelection]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};
