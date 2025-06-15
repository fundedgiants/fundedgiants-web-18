
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const AFFILIATE_CODE_STORAGE_KEY = 'affiliate_code';

export const useAffiliateTracking = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const affiliateCode = searchParams.get('ref');
    if (affiliateCode) {
      console.log(`Affiliate code found: ${affiliateCode}. Storing in localStorage.`);
      localStorage.setItem(AFFILIATE_CODE_STORAGE_KEY, affiliateCode);
    }
  }, [searchParams]);
};
