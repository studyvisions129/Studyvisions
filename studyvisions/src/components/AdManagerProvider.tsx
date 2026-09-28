'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface AdContextType {
  adsAllowed: boolean;
}

const AdContext = createContext<AdContextType>({ adsAllowed: true });

export const AdManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [adsAllowed, setAdsAllowed] = useState(true);

  useEffect(() => {
    // Restricted routes where ads MUST be 100% OFF
    const blockedRoutes = ['/checkout', '/p/', '/l/', '/dashboard', '/library'];
    const isBlocked = blockedRoutes.some(route => pathname?.startsWith(route) ?? false);
    
    setAdsAllowed(!isBlocked);
  }, [pathname]);

  return (
    <AdContext.Provider value={{ adsAllowed }}>
      {children}
    </AdContext.Provider>
  );
};

export const useAds = () => useContext(AdContext);
