import React, { useRef, useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOnClickOutside(ref: any, func: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickInsideOutside(event: any) {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      func();
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickInsideOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickInsideOutside);
    };
  }, [ref, func]);
}
