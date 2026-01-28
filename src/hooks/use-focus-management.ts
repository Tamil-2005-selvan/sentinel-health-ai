import { useCallback, useRef } from "react";

interface UseFocusManagementOptions {
  onEscape?: () => void;
  trapFocus?: boolean;
}

export const useFocusManagement = (options: UseFocusManagementOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
      previousFocusRef.current.focus();
    }
  }, []);

  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;
    
    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, []);

  const focusLast = useCallback(() => {
    if (!containerRef.current) return;
    
    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!containerRef.current) return;

    if (event.key === "Escape" && options.onEscape) {
      event.preventDefault();
      options.onEscape();
      return;
    }

    if (!options.trapFocus || event.key !== "Tab") return;

    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [options]);

  return {
    containerRef,
    saveFocus,
    restoreFocus,
    focusFirst,
    focusLast,
    handleKeyDown,
  };
};

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors))
    .filter((el) => {
      return el.offsetParent !== null && !el.hasAttribute('aria-hidden');
    });
}

export const useRovingTabIndex = (itemCount: number) => {
  const currentIndexRef = useRef(0);

  const handleKeyDown = useCallback((
    event: React.KeyboardEvent,
    index: number,
    getElement: (index: number) => HTMLElement | null
  ) => {
    let newIndex = index;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        newIndex = (index + 1) % itemCount;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        newIndex = (index - 1 + itemCount) % itemCount;
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = itemCount - 1;
        break;
      default:
        return;
    }

    currentIndexRef.current = newIndex;
    const element = getElement(newIndex);
    if (element) {
      element.focus();
    }
  }, [itemCount]);

  const getTabIndex = useCallback((index: number) => {
    return index === currentIndexRef.current ? 0 : -1;
  }, []);

  return { handleKeyDown, getTabIndex, currentIndex: currentIndexRef.current };
};
