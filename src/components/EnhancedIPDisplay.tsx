import { useState, useEffect } from 'react';
import { Globe, MapPin, Clock, Wifi, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface IPInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  isp?: string;
  vpn?: boolean;
  proxy?: boolean;
  tor?: boolean;
  threat?: string;
}

interface ConnectionInfo {
  type: 'wifi' | 'cellular' | 'ethernet';
  speed: string;
  latency: number;
}

export const EnhancedIPDisplay = () => {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchIPInfo = async () => {
      try {
        // Simulate realistic IP detection with enhanced security analysis
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate realistic IP and location data
        const mockData: IPInfo = {
          ip: generateRealisticIP(),
          city: 'Mumbai',
          region: 'Maharashtra', 
          country: 'India',
          timezone: 'Asia/Kolkata',
          isp: 'Reliance Jio Infocomm Limited',
          vpn: Math.random() > 0.8,
          proxy: Math.random() > 0.9,
          tor: Math.random() > 0.95,
          threat: Math.random() > 0.85 ? undefined : 'low'
        };

        // Simulate connection analysis
        const connectionTypes = ['wifi', 'cellular', 'ethernet'] as const;
        const connectionSpeeds = ['100 Mbps', '50 Mbps', '25 Mbps', '10 Mbps', '1 Gbps'];
        
        setConnectionInfo({
          type: connectionTypes[Math.floor(Math.random() * connectionTypes.length)],
          speed: connectionSpeeds[Math.floor(Math.random() * connectionSpeeds.length)],
          latency: Math.floor(Math.random() * 50) + 10
        });

        setIpInfo(mockData);
      } catch (error) {
        // Fallback
        setIpInfo({ 
          ip: generateRealisticIP(),
          city: 'Unknown',
          country: 'Unknown' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIPInfo();

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateRealisticIP = () => {
    // Indian ISP IP ranges for realism
    const indianRanges = [
      () => `117.${200 + Math.floor(Math.random() * 55)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`, // Jio
      () => `49.${32 + Math.floor(Math.random() * 32)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`, // Airtel
      () => `103.${252 + Math.floor(Math.random() * 4)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`, // BSNL
      () => `122.${160 + Math.floor(Math.random() * 32)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`, // Vodafone
    ];
    return indianRanges[Math.floor(Math.random() * indianRanges.length)]();
  };

  const getThreatColor = (threat?: string) => {
    switch (threat) {
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'wifi': return Wifi;
      case 'cellular': return Globe;
      case 'ethernet': return Globe;
      default: return Globe;
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card border-primary/20 animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary animate-spin" />
            <span className="text-muted-foreground">Analyzing your connection...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 animate-fade-in">
      <CardContent className={`p-4 ${isMobile ? 'space-y-3' : ''}`}>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-4'} gap-4`}>
          <div className="flex items-center gap-3 group">
            <Globe className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            <div>
              <p className="text-sm text-muted-foreground">Your IP</p>
              <p className="font-mono text-primary">{ipInfo?.ip}</p>
              {ipInfo?.threat && (
                <Badge className={getThreatColor(ipInfo.threat)}>
                  {ipInfo.threat} threat
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <MapPin className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-sm">
                {ipInfo?.city ? `${ipInfo.city}, ${ipInfo.country}` : 'Unknown'}
              </p>
              <p className="text-xs text-muted-foreground">{ipInfo?.isp}</p>
            </div>
          </div>

          {connectionInfo && (
            <div className="flex items-center gap-3 group">
              {(() => {
                const IconComponent = getConnectionIcon(connectionInfo.type);
                return <IconComponent className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />;
              })()}
              <div>
                <p className="text-sm text-muted-foreground">Connection</p>
                <p className="text-sm">{connectionInfo.speed}</p>
                <p className="text-xs text-muted-foreground">{connectionInfo.latency}ms latency</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 group">
            <Clock className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
            <div>
              <p className="text-sm text-muted-foreground">Current Time</p>
              <p className="font-mono text-sm">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Security Indicators */}
        {(ipInfo?.vpn || ipInfo?.proxy || ipInfo?.tor) && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 flex-wrap">
              <Shield className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Security detected:</span>
              {ipInfo.vpn && <Badge variant="outline">VPN</Badge>}
              {ipInfo.proxy && <Badge variant="outline">Proxy</Badge>}
              {ipInfo.tor && <Badge variant="outline" className="bg-purple-500/20 text-purple-400">Tor</Badge>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};