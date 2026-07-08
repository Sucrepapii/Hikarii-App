import { useEffect, useRef, useCallback } from "react";

export const useInactivity = (timeout: number, onInactive: () => void) => {
  const timerRef = useRef<any>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(onInactive, timeout);
  }, [timeout, onInactive]);

  useEffect(() => {
    // Initial timer
    resetTimer();

    // Events to listen for
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    // Handler wrapper to potentially throttle if needed (though resetTimer is cheap)
    const handleActivity = () => {
      resetTimer();
    };

    // Add listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);
};
