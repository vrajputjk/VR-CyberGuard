import { useState, useEffect } from 'react';
import { Globe, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface IPInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  isp?: string;
}

export const IPDisplay = () => {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIPInfo = async () => {
      try {
        // First get basic IP
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Then get detailed info
        const detailResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const detailData = await detailResponse.json();
        
        setIpInfo({
          ip: ipData.ip,
          city: detailData.city,
          region: detailData.region,
          country: detailData.country_name,
          timezone: detailData.timezone,
          isp: detailData.org
        });
      } catch (error) {
        // Fallback to basic IP only
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          setIpInfo({ ip: data.ip });
        } catch (fallbackError) {
          setIpInfo({ ip: 'Unable to detect' });
        }
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

  if (loading) {
    return (
      <Card className="bg-gradient-card border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary animate-spin" />
            <span className="text-muted-foreground">Detecting your location...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 animate-fade-in">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 group">
            <Globe className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            <div>
              <p className="text-sm text-muted-foreground">Your IP</p>
              <p className="font-mono text-primary transition-colors duration-300">{ipInfo?.ip}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <MapPin className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-sm transition-colors duration-300">
                {ipInfo?.city ? `${ipInfo.city}, ${ipInfo.country}` : 'Unknown'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <Clock className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
            <div>
              <p className="text-sm text-muted-foreground">Current Time</p>
              <p className="font-mono text-sm transition-colors duration-300">
                {currentTime.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};