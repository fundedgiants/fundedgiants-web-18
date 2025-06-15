
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AffiliateContextType {
  affiliateCode: string | null;
}

const AffiliateContext = createContext<AffiliateContextType>({
  affiliateCode: null,
});

export const useAffiliateContext = () => useContext(AffiliateContext);

export const AffiliateProvider = ({ children }: { children: React.ReactNode }) => {
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const refCode = urlParams.get('ref');
    const storedCode = localStorage.getItem('affiliate_code');

    let currentCode = storedCode;

    if (refCode) {
      // If a new ref code is in the URL, it takes precedence.
      if (refCode !== storedCode) {
        localStorage.setItem('affiliate_code', refCode);
        currentCode = refCode;
        // Track the click for the new ref code
        supabase.functions.invoke('track-affiliate-click', {
          body: { affiliateCode: refCode },
        });
      }
    }
    
    setAffiliateCode(currentCode);

  }, [location.search]);

  return (
    <AffiliateContext.Provider value={{ affiliateCode }}>
      {children}
    </AffiliateContext.Provider>
  );
};
