import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileOptimized = ({ children, className = '' }: MobileOptimizedProps) => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      className={`${className} ${isMobile ? 'touch-manipulation select-none' : ''}`}
      style={{
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        touchAction: isMobile ? 'manipulation' : 'auto'
      }}
    >
      {children}
    </div>
  );
};

export default MobileOptimized;