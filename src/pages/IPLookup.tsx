import { useState, useEffect } from 'react';
import { Globe, MapPin, Building, Clock, ArrowLeft, Copy, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface DetailedIPInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  timezone?: string;
  isp?: string;
  org?: string;
  lat?: number;
  lon?: number;
  asn?: string;
  postal?: string;
  userAgent?: string;
}

export default function IPLookup() {
  const [ipInput, setIpInput] = useState('');
  const [ipInfo, setIpInfo] = useState<DetailedIPInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<DetailedIPInfo | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    // Auto-detect user's IP on component mount
    fetchUserIP();
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchUserIP = async () => {
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      const detailResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
      const detailData = await detailResponse.json();
      
      setUserInfo({
        ip: ipData.ip,
        city: detailData.city,
        region: detailData.region,
        country: detailData.country_name,
        countryCode: detailData.country_code,
        timezone: detailData.timezone,
        isp: detailData.org,
        lat: detailData.latitude,
        lon: detailData.longitude,
        asn: detailData.asn,
        postal: detailData.postal,
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('Error fetching user IP:', error);
    }
  };

  const lookupIP = async (ip: string) => {
    if (!ip.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid IP address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Invalid IP address');
      }

      setIpInfo({
        ip: ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        countryCode: data.country_code,
        timezone: data.timezone,
        isp: data.org,
        lat: data.latitude,
        lon: data.longitude,
        asn: data.asn,
        postal: data.postal
      });

      toast({
        title: "Success",
        description: "IP lookup completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to lookup IP address",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const exportData = () => {
    const data = ipInfo || userInfo;
    if (!data) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      query_ip: data.ip,
      location: {
        city: data.city,
        region: data.region,
        country: data.country,
        postal: data.postal,
        coordinates: data.lat && data.lon ? { lat: data.lat, lon: data.lon } : null
      },
      network: {
        isp: data.isp,
        asn: data.asn
      },
      user_agent: data.userAgent || navigator.userAgent
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-lookup-${data.ip}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const InfoCard = ({ title, data }: { title: string; data: DetailedIPInfo }) => (
    <Card className="bg-gradient-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">IP Address</Label>
              <div className="flex items-center gap-2">
                <p className="font-mono text-primary font-semibold">{data.ip}</p>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(data.ip)}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            {data.city && (
              <div>
                <Label className="text-sm text-muted-foreground">Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <p>{data.city}, {data.region}, {data.country}</p>
                </div>
              </div>
            )}

            {data.isp && (
              <div>
                <Label className="text-sm text-muted-foreground">ISP / Organization</Label>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-accent" />
                  <p>{data.isp}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {data.timezone && (
              <div>
                <Label className="text-sm text-muted-foreground">Timezone</Label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <p>{data.timezone}</p>
                </div>
              </div>
            )}

            {data.lat && data.lon && (
              <div>
                <Label className="text-sm text-muted-foreground">Coordinates</Label>
                <p className="font-mono text-sm">{data.lat}, {data.lon}</p>
              </div>
            )}

            {data.asn && (
              <div>
                <Label className="text-sm text-muted-foreground">ASN</Label>
                <p className="font-mono text-sm">{data.asn}</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm text-muted-foreground">Query Time</Label>
              <p className="text-sm font-mono">{currentTime.toLocaleString()}</p>
            </div>
            <Button variant="outline" onClick={exportData} className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-primary mb-2">IP Address Lookup</h1>
          <p className="text-muted-foreground">
            Discover detailed information about any IP address including location, ISP, and network details.
          </p>
        </div>

        {/* Your Current IP */}
        {userInfo && (
          <div className="mb-8">
            <InfoCard title="Your Current IP Information" data={userInfo} />
          </div>
        )}

        {/* IP Lookup Form */}
        <Card className="mb-8 bg-gradient-card border-primary/20">
          <CardHeader>
            <CardTitle>Lookup Another IP</CardTitle>
            <CardDescription>
              Enter any public IP address to get detailed information about its location and network.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="ip-input">IP Address</Label>
                <Input
                  id="ip-input"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  placeholder="8.8.8.8"
                  className="font-mono"
                  onKeyPress={(e) => e.key === 'Enter' && lookupIP(ipInput)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => lookupIP(ipInput)}
                  disabled={loading}
                  variant="scan"
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      Lookup
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lookup Results */}
        {ipInfo && (
          <InfoCard title="IP Lookup Results" data={ipInfo} />
        )}
      </div>
    </div>
  );
}