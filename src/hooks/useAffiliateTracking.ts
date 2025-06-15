
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const AFFILIATE_CODE_STORAGE_KEY = 'affiliate_code';
const AFFILIATE_CLICK_TRACKED_KEY = 'affiliate_click_tracked';

export const useAffiliateTracking = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const affiliateCode = searchParams.get('ref');
    if (affiliateCode) {
      // Store affiliate code for later use in checkout
      localStorage.setItem(AFFILIATE_CODE_STORAGE_KEY, affiliateCode);

      // Track the click only once per session
      const clickTracked = sessionStorage.getItem(AFFILIATE_CLICK_TRACKED_KEY);
      if (!clickTracked) {
        console.log(`Affiliate code found: ${affiliateCode}. Tracking click.`);
        supabase.functions.invoke('track-affiliate-click', {
          body: { affiliateCode },
        }).then(({ error }) => {
          if (error) {
            console.error('Error tracking affiliate click:', error);
          } else {
            console.log('Affiliate click tracked successfully.');
            sessionStorage.setItem(AFFILIATE_CLICK_TRACKED_KEY, 'true');
          }
        });
      }
    }
  }, [searchParams]);
};
