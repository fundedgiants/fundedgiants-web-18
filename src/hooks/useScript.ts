
import { useState, useEffect } from 'react';

/**
 * A hook to dynamically load an external script and track its status.
 * @param src The source URL of the script to load.
 * @returns An object with the loading and error status of the script.
 */
export const useScript = (src: string): { loading: boolean; error: boolean } => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log(`useScript effect started for: ${src}`);
    if (!src) {
      console.log(`useScript: No src provided, exiting.`);
      setLoading(false);
      return;
    }

    // Check if the SDK is already available on the window object, which is the
    // most reliable check for readiness.
    const isPaystackLoaded = src.includes('paystack') && !!window.PaystackPop;
    const isStartButtonLoaded = src.includes('startbutton') && !!window.Startbutton;


    if (isPaystackLoaded || isStartButtonLoaded) {
      console.log(`useScript: SDK already loaded for ${src}.`);
      setLoading(false);
      setError(false);
      return;
    }

    let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    
    const handleLoad = () => {
      console.log(`useScript: Script loaded successfully: ${src}`);
      setLoading(false);
      setError(false);
    };
    const handleError = (event: Event | string) => {
      console.error('useScript: Script loading failed:', { src, event });
      setError(true);
      setLoading(false);
    };

    if (!script) {
      console.log(`useScript: Creating new script tag for ${src}.`);
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleError);
    } else {
      // If script tag already exists, just add event listeners.
      // The check for the window object at the top of the hook will handle
      // the case where the script has already loaded on a subsequent render.
      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleError);
    }

    return () => {
      console.log(`useScript: Cleaning up effect for ${src}.`);
      if (script) {
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleError);
      }
    };
  }, [src]);

  return { loading, error };
};
