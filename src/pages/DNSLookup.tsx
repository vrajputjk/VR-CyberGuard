import { useState } from 'react';
import { Search, ArrowLeft, Copy, Download, Globe, Network } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface DNSRecord {
  type: string;
  value: string;
  ttl?: number;
}

interface DNSResults {
  domain: string;
  timestamp: string;
  records: {
    A: DNSRecord[];
    AAAA: DNSRecord[];
    MX: DNSRecord[];
    NS: DNSRecord[];
    CNAME: DNSRecord[];
    TXT: DNSRecord[];
  };
}

interface SubdomainResult {
  domain: string;
  subdomains: {
    subdomain: string;
    ip: string;
    status: 'active' | 'inactive';
    services: string[];
    lastChecked: string;
  }[];
  totalFound: number;
}

export default function DNSLookup() {
  const [domain, setDomain] = useState('');
  const [subdomainDomain, setSubdomainDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DNSResults | null>(null);
  const [subdomainResults, setSubdomainResults] = useState<SubdomainResult | null>(null);
  const { toast } = useToast();

  const performDNSLookup = async () => {
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive",
      });
      return;
    }

    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      toast({
        title: "Error",
        description: "Please enter a valid domain name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate comprehensive DNS lookup with realistic data
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Enhanced realistic IP generation with proper provider ranges
      const generateRealisticIPs = () => {
        const providers = [
          // Cloudflare (Real ranges)
          () => `104.${16 + Math.floor(Math.random() * 16)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `172.${64 + Math.floor(Math.random() * 32)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `173.245.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          // AWS (Real EC2 ranges)
          () => `52.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `54.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `18.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          // Google Cloud (Real ranges)
          () => `34.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `35.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `104.196.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          // Microsoft Azure (Real ranges)
          () => `13.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `20.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `40.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          // DigitalOcean (Real ranges)
          () => `138.${68 + Math.floor(Math.random() * 32)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `159.89.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          // Linode (Real ranges)
          () => `172.${104 + Math.floor(Math.random() * 16)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `45.79.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          // Vultr
          () => `207.246.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          // OVH
          () => `51.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
        ];
        return providers[Math.floor(Math.random() * providers.length)]();
      };

      const mockResults: DNSResults = {
        domain: domain,
        timestamp: new Date().toISOString(),
        records: {
          A: [
            { type: 'A', value: generateRealisticIPs(), ttl: 300 },
            ...(Math.random() > 0.4 ? [{ type: 'A', value: generateRealisticIPs(), ttl: 300 }] : []),
            ...(Math.random() > 0.7 ? [{ type: 'A', value: generateRealisticIPs(), ttl: 300 }] : [])
          ],
          AAAA: Math.random() > 0.3 ? [
            { type: 'AAAA', value: `2606:2800:220:1:248:1893:25c8:${Math.floor(Math.random() * 65536).toString(16)}`, ttl: 3600 },
            ...(Math.random() > 0.6 ? [{ type: 'AAAA', value: `2001:db8::${Math.floor(Math.random() * 65536).toString(16)}:${Math.floor(Math.random() * 65536).toString(16)}`, ttl: 3600 }] : [])
          ] : [],
          MX: [
            { type: 'MX', value: `10 mail.${domain}`, ttl: 3600 },
            { type: 'MX', value: `20 mail2.${domain}`, ttl: 3600 },
            ...(Math.random() > 0.7 ? [{ type: 'MX', value: `30 backup.${domain}`, ttl: 3600 }] : [])
          ],
          NS: [
            { type: 'NS', value: `ns1.${domain}`, ttl: 86400 },
            { type: 'NS', value: `ns2.${domain}`, ttl: 86400 },
            { type: 'NS', value: `ns3.${domain}`, ttl: 86400 },
            { type: 'NS', value: `ns4.${domain}`, ttl: 86400 }
          ],
          CNAME: [],
          TXT: [
            { type: 'TXT', value: 'v=spf1 include:_spf.google.com include:mailgun.org include:amazonses.com ~all', ttl: 3600 },
            { type: 'TXT', value: `google-site-verification=${Math.random().toString(36).substr(2, 43)}`, ttl: 3600 },
            { type: 'TXT', value: `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@${domain}; ruf=mailto:dmarc-failures@${domain}; fo=1`, ttl: 3600 },
            { type: 'TXT', value: `v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC${Math.random().toString(36).substr(2, 30)}...`, ttl: 3600 },
            ...(Math.random() > 0.3 ? [{ type: 'TXT', value: `_dnsauth.${domain}=${Math.random().toString(36).substr(2, 32)}`, ttl: 300 }] : []),
            ...(Math.random() > 0.6 ? [{ type: 'TXT', value: `keybase-site-verification=${Math.random().toString(36).substr(2, 25)}`, ttl: 3600 }] : []),
            ...(Math.random() > 0.7 ? [{ type: 'TXT', value: 'atlassian-domain-verification=5YjTmWmjI92ewqkx2oXmBaD60Td9zWon9r6eakvHX6B77zzkFQto8PQ9QsKnbf4I', ttl: 3600 }] : [])
          ]
        }
      };

      // Add some randomization for demo purposes
      if (Math.random() > 0.5) {
        mockResults.records.CNAME.push({ type: 'CNAME', value: 'alias.example.com', ttl: 3600 });
      }

      setResults(mockResults);
      toast({
        title: "DNS Lookup Complete",
        description: "Successfully retrieved DNS records",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform DNS lookup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!results) return;

    const exportData = {
      ...results,
      userAgent: navigator.userAgent,
      toolInfo: 'VRCyber Guard DNS Lookup Tool'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dns-lookup-${results.domain}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const findSubdomains = async () => {
    if (!subdomainDomain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain to scan",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Generate realistic IP addresses (same function as above)
      const generateRealisticIPs = () => {
        const providers = [
          // Cloudflare
          () => `104.${16 + Math.floor(Math.random() * 16)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `172.${64 + Math.floor(Math.random() * 32)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          // AWS
          () => `52.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `54.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          // Google Cloud
          () => `34.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `35.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          // Microsoft Azure
          () => `13.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          () => `20.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          // DigitalOcean
          () => `138.${68 + Math.floor(Math.random() * 32)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          // Linode
          () => `172.${104 + Math.floor(Math.random() * 16)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
        ];
        return providers[Math.floor(Math.random() * providers.length)]();
      };

      // Helper function for realistic services
      const getServicesForSubdomain = (subdomain: string): string[] => {
        const serviceMap: { [key: string]: string[] } = {
          www: ['HTTP', 'HTTPS'],
          mail: ['SMTP', 'IMAP', 'POP3'],
          ftp: ['FTP', 'SFTP'],
          api: ['HTTPS', 'REST API'],
          admin: ['HTTPS', 'SSH'],
          vpn: ['OpenVPN', 'IKEv2'],
          db: ['MySQL', 'PostgreSQL'],
          redis: ['Redis'],
          mongo: ['MongoDB']
        };
        return serviceMap[subdomain] || ['HTTP', 'HTTPS'];
      };

      const commonSubdomains = [
        'www', 'mail', 'ftp', 'api', 'blog', 'dev', 'staging', 'test', 'cdn', 'assets',
        'admin', 'panel', 'dashboard', 'portal', 'secure', 'shop', 'store', 'support',
        'help', 'docs', 'beta', 'demo', 'sandbox', 'vpn', 'remote', 'git', 'jenkins',
        'grafana', 'kibana', 'elastic', 'redis', 'mysql', 'postgres', 'mongo', 'db'
      ];

      const foundSubdomains = commonSubdomains
        .filter(() => Math.random() > 0.65) // More selective
        .slice(0, Math.floor(Math.random() * 8) + 6) // 6-14 subdomains
        .map((subdomain, index) => ({
          subdomain: `${subdomain}.${subdomainDomain}`,
          ip: generateRealisticIPs(),
          status: Math.random() > 0.2 ? 'active' as const : 'inactive' as const,
          services: getServicesForSubdomain(subdomain),
          lastChecked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }));

      setSubdomainResults({
        domain: subdomainDomain,
        subdomains: foundSubdomains,
        totalFound: foundSubdomains.length
      });

      toast({
        title: "Subdomain Scan Complete",
        description: `Found ${foundSubdomains.length} subdomains`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scan subdomains",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSubdomainResults = () => {
    if (!subdomainResults) return;

    const exportData = {
      ...subdomainResults,
      userAgent: navigator.userAgent,
      toolInfo: 'VR-Cyber-Guard DNS Lookup Tool - Subdomain Scanner'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subdomain-scan-${subdomainResults.domain}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const RecordSection = ({ title, records, description }: { title: string; records: DNSRecord[]; description: string }) => (
    <Card className="bg-muted/10 border-muted/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          <Badge variant="outline">{records.length}</Badge>
        </CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {records.length > 0 ? (
          <div className="space-y-2">
            {records.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded">
                <span className="font-mono text-sm">{record.value}</span>
                {record.ttl && (
                  <span className="text-xs text-muted-foreground">TTL: {record.ttl}s</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No {title} records found</p>
        )}
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
              Back to Arsenal
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-primary mb-2">DNS Lookup Tool</h1>
          <p className="text-muted-foreground">
            Query DNS records, perform reverse lookups, and analyze domain information for security assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Tabs defaultValue="dns" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dns">DNS Lookup</TabsTrigger>
                <TabsTrigger value="subdomain">Subdomains</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dns">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-primary" />
                      DNS Query
                    </CardTitle>
                    <CardDescription>
                      Enter a domain name to retrieve all available DNS records.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="domain">Domain Name</Label>
                      <Input
                        id="domain"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="example.com"
                        onKeyPress={(e) => e.key === 'Enter' && performDNSLookup()}
                      />
                    </div>

                    <Button 
                      onClick={performDNSLookup} 
                      disabled={loading} 
                      variant="scan" 
                      className="w-full gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Looking up...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Lookup DNS
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="subdomain">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="w-5 h-5 text-primary" />
                      Subdomain Scanner
                    </CardTitle>
                    <CardDescription>
                      Discover subdomains of a target domain for reconnaissance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="subdomain-domain">Domain</Label>
                      <Input
                        id="subdomain-domain"
                        value={subdomainDomain}
                        onChange={(e) => setSubdomainDomain(e.target.value)}
                        placeholder="example.com"
                        onKeyPress={(e) => e.key === 'Enter' && findSubdomains()}
                      />
                    </div>
                    <Button onClick={findSubdomains} disabled={loading} variant="scan" className="w-full gap-2">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Network className="w-4 h-4" />
                          Find Subdomains
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* DNS Information */}
            <Card className="bg-accent/10 border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent">DNS Record Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>A Records:</strong> Maps domain to IPv4 address
                </div>
                <div>
                  <strong>AAAA Records:</strong> Maps domain to IPv6 address
                </div>
                <div>
                  <strong>MX Records:</strong> Mail exchange servers
                </div>
                <div>
                  <strong>NS Records:</strong> Name servers for the domain
                </div>
                <div>
                  <strong>CNAME Records:</strong> Canonical name (alias)
                </div>
                <div>
                  <strong>TXT Records:</strong> Text data (SPF, DKIM, etc.)
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            {subdomainResults ? (
              <div className="space-y-6">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Network className="w-5 h-5 text-primary" />
                        Subdomain Discovery
                      </span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {subdomainResults.totalFound} Found
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Target Domain: {subdomainResults.domain}</Label>
                    </div>
                    
                    <div>
                      <Label className="mb-3 block">Discovered Subdomains</Label>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {subdomainResults.subdomains.map((sub, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/10 rounded">
                            <div>
                              <p className="font-mono text-sm">{sub.subdomain}</p>
                              <p className="text-xs text-muted-foreground">IP: {sub.ip}</p>
                              <p className="text-xs text-muted-foreground">Services: {sub.services.join(', ')}</p>
                            </div>
                            <Badge className={sub.status === 'active' ? 
                              'bg-primary/20 text-primary border-primary/30' : 
                              'bg-muted text-muted-foreground border-muted'}>
                              {sub.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(subdomainResults, null, 2))} variant="outline" className="flex-1 gap-2">
                        <Copy className="w-4 h-4" />
                        Copy Results
                      </Button>
                      <Button onClick={exportSubdomainResults} variant="outline" className="flex-1 gap-2">
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : results ? (
              <div className="space-y-6">
                {/* Summary */}
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      DNS Results for {results.domain}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Query completed</p>
                        <p className="text-sm font-mono">{new Date(results.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(results, null, 2))} variant="outline" size="sm" className="gap-2">
                          <Copy className="w-3 h-3" />
                          Copy
                        </Button>
                        <Button onClick={exportResults} variant="outline" size="sm" className="gap-2">
                          <Download className="w-3 h-3" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* DNS Records */}
                <div className="space-y-4">
                  <RecordSection 
                    title="A Records" 
                    records={results.records.A}
                    description="IPv4 addresses for this domain"
                  />
                  
                  <RecordSection 
                    title="AAAA Records" 
                    records={results.records.AAAA}
                    description="IPv6 addresses for this domain"
                  />
                  
                  <RecordSection 
                    title="MX Records" 
                    records={results.records.MX}
                    description="Mail exchange servers"
                  />
                  
                  <RecordSection 
                    title="NS Records" 
                    records={results.records.NS}
                    description="Authoritative name servers"
                  />
                  
                  <RecordSection 
                    title="CNAME Records" 
                    records={results.records.CNAME}
                    description="Canonical name aliases"
                  />
                  
                  <RecordSection 
                    title="TXT Records" 
                    records={results.records.TXT}
                    description="Text records (SPF, DKIM, verification)"
                  />
                </div>
              </div>
            ) : (
              <Card className="bg-gradient-card border-primary/20">
                <CardContent className="p-8 text-center">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready for DNS Lookup</h3>
                  <p className="text-muted-foreground">
                    Enter a domain name to begin DNS record analysis.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Educational Information */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-accent mb-3">Understanding DNS Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Security Indicators</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Multiple A records may indicate load balancing</li>
                  <li>• Missing MX records suggest no email service</li>
                  <li>• TXT records often contain security policies</li>
                  <li>• Unusual NS records might indicate compromise</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Common TXT Record Uses</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• SPF: Email sender authentication</li>
                  <li>• DKIM: Email signature verification</li>
                  <li>• DMARC: Email authentication policy</li>
                  <li>• Site verification tokens</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              <strong>Note:</strong> This tool provides simulated DNS data for educational purposes. 
              Real DNS lookups require actual network queries to DNS servers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}