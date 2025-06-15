
import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    PaystackPop?: any;
    Startbutton?: any;
    // Klasha type removed
  }
}

/**
 * A hook to dynamically load an external script and track its status.
 * @param src The source URL of the script to load.
 * @returns An object with the loading and error status of the script.
 */
export const useScript = (src: string): { loading: boolean; error: boolean } => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    console.log(`useScript: Script loaded successfully: ${src}`);
    setLoading(false);
    setError(false);
  }, [src]);

  const handleError = useCallback((event: Event | string) => {
    console.error('useScript: Script loading failed:', { src, event });
    setError(true);
    setLoading(false);
  }, [src]);

  useEffect(() => {
    console.log(`useScript effect started for: ${src}`);
    if (!src) {
      console.log(`useScript: No src provided, exiting.`);
      setLoading(false);
      return;
    }

    const isSdkLoaded = () => {
        // Paystack SDK check removed
        // Klasha no longer loaded via this hook
        return false;
    };

    if (isSdkLoaded()) {
      console.log(`useScript: SDK already loaded for ${src}.`);
      handleLoad();
      return;
    }

    let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    
    if (!script) {
      console.log(`useScript: Creating new script tag for ${src}.`);
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    } else {
      console.log(`useScript: Script tag for ${src} already exists in DOM.`);
    }
    
    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    // Final check in case script loaded before listener was attached
    if (isSdkLoaded()) {
        console.log(`useScript: SDK loaded before listener was attached for ${src}.`);
        handleLoad();
    }

    return () => {
      console.log(`useScript: Cleaning up effect for ${src}.`);
      if (script) {
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleError);
      }
    };
  }, [src, handleLoad, handleError]);

  return { loading, error };
};
