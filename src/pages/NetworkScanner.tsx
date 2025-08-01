import { useState } from 'react';
import { Scan, ArrowLeft, Copy, Download, Globe, Server, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface ScanResult {
  port: number;
  status: 'open' | 'closed' | 'filtered';
  service?: string;
  version?: string;
  banner?: string;
}

interface ScanResults {
  target: string;
  scanType: string;
  timestamp: string;
  results: ScanResult[];
  summary: {
    totalPorts: number;
    openPorts: number;
    closedPorts: number;
    filteredPorts: number;
  };
}

export default function NetworkScanner() {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScanResults | null>(null);
  const { toast } = useToast();

  const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995];
  const topPorts = [21, 22, 23, 25, 53, 80, 110, 135, 139, 143, 443, 445, 993, 995, 1433, 1723, 3306, 3389, 5432, 5900, 8080, 8443, 9200, 27017];

  const simulatePortScan = async () => {
    if (!target.trim()) {
      toast({
        title: "Error",
        description: "Please enter a target to scan",
        variant: "destructive",
      });
      return;
    }

    // Basic validation
    const isValidIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(target);
    const isValidDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(target);
    
    if (!isValidIP && !isValidDomain) {
      toast({
        title: "Error",
        description: "Please enter a valid IP address or domain name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate scan delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const portsToScan = scanType === 'basic' ? commonPorts : topPorts;
      const scanResults: ScanResult[] = [];

      // Simulate port scan results
      for (const port of portsToScan) {
        const random = Math.random();
        let status: 'open' | 'closed' | 'filtered';
        let service: string | undefined;
        let version: string | undefined;

        // Enhanced service detection with realistic probabilities
        const isCommonPort = [21, 22, 80, 443].includes(port);
        const openProbability = isCommonPort ? 0.4 : 0.15;
        
        if (random > (1 - openProbability)) {
          status = 'open';
          // Enhanced service detection
          switch (port) {
            case 21: service = 'FTP'; version = Math.random() > 0.5 ? 'vsftpd 3.0.3' : 'ProFTPD 1.3.6'; break;
            case 22: service = 'SSH'; version = Math.random() > 0.5 ? 'OpenSSH 8.9' : 'OpenSSH 7.4'; break;
            case 23: service = 'Telnet'; version = 'BSD-derived'; break;
            case 25: service = 'SMTP'; version = Math.random() > 0.5 ? 'Postfix 3.4.13' : 'Exim 4.94'; break;
            case 53: service = 'DNS'; version = Math.random() > 0.5 ? 'BIND 9.16.1' : 'dnsmasq 2.80'; break;
            case 80: service = 'HTTP'; version = Math.random() > 0.5 ? 'Apache 2.4.41' : 'nginx 1.18.0'; break;
            case 110: service = 'POP3'; version = 'Dovecot 2.3.13'; break;
            case 135: service = 'RPC'; version = 'Microsoft Windows RPC'; break;
            case 139: service = 'NetBIOS-SSN'; version = 'Samba 4.13.17'; break;
            case 143: service = 'IMAP'; version = 'Dovecot 2.3.13'; break;
            case 443: service = 'HTTPS'; version = Math.random() > 0.5 ? 'Apache 2.4.41' : 'nginx 1.18.0'; break;
            case 445: service = 'SMB'; version = 'Samba 4.13.17'; break;
            case 993: service = 'IMAPS'; version = 'Dovecot 2.3.13'; break;
            case 995: service = 'POP3S'; version = 'Dovecot 2.3.13'; break;
            case 1433: service = 'MSSQL'; version = 'Microsoft SQL Server 2019'; break;
            case 1723: service = 'PPTP'; version = 'Microsoft PPTP VPN'; break;
            case 3306: service = 'MySQL'; version = Math.random() > 0.5 ? 'MySQL 8.0.28' : 'MariaDB 10.6.7'; break;
            case 3389: service = 'RDP'; version = 'Microsoft Terminal Services'; break;
            case 5432: service = 'PostgreSQL'; version = 'PostgreSQL 13.7'; break;
            case 5900: service = 'VNC'; version = 'VNC 4.1.3'; break;
            case 8080: service = 'HTTP-Proxy'; version = 'Tomcat 9.0.62'; break;
            case 8443: service = 'HTTPS-Alt'; version = 'Tomcat 9.0.62'; break;
            case 9200: service = 'Elasticsearch'; version = 'Elasticsearch 7.17.3'; break;
            case 27017: service = 'MongoDB'; version = 'MongoDB 5.0.8'; break;
            default: service = 'Unknown'; version = 'Unknown version';
          }
        } else if (random > 0.55) {
          status = 'filtered';
        } else {
          status = 'closed';
        }

        scanResults.push({
          port,
          status,
          service,
          version
        });
      }

      const summary = {
        totalPorts: portsToScan.length,
        openPorts: scanResults.filter(r => r.status === 'open').length,
        closedPorts: scanResults.filter(r => r.status === 'closed').length,
        filteredPorts: scanResults.filter(r => r.status === 'filtered').length
      };

      setResults({
        target,
        scanType,
        timestamp: new Date().toISOString(),
        results: scanResults,
        summary
      });

      toast({
        title: "Scan Complete",
        description: `Found ${summary.openPorts} open ports`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete network scan",
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
      scannerInfo: 'VRCyber Guard Network Scanner v1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network-scan-${results.target}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'filtered': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'closed': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

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
          
          <h1 className="text-3xl font-bold text-primary mb-2">Network Scanner</h1>
          <p className="text-muted-foreground">
            Perform basic and advanced network scans to discover open ports, services, and potential vulnerabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Configuration */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="w-5 h-5 text-primary" />
                  Scanner Configuration
                </CardTitle>
                <CardDescription>
                  Configure your network scan parameters and target.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="target">Target (IP or Domain)</Label>
                  <Input
                    id="target"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="192.168.1.1 or example.com"
                    onKeyPress={(e) => e.key === 'Enter' && simulatePortScan()}
                  />
                </div>

                <div>
                  <Label htmlFor="scan-type">Scan Type</Label>
                  <Select value={scanType} onValueChange={setScanType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Scan (Common Ports)</SelectItem>
                      <SelectItem value="advanced">Advanced Scan (Top 1000 Ports)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {scanType === 'basic' ? 'Scans 11 most common ports' : 'Scans top 20 ports with service detection'}
                  </p>
                </div>

                <Button 
                  onClick={simulatePortScan} 
                  disabled={loading} 
                  variant="scan" 
                  className="w-full gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4" />
                      Start Scan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Scan Information */}
            <Card className="bg-destructive/10 border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Shield className="w-5 h-5" />
                  Important Warning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <strong>Educational Use Only:</strong> This scanner is for learning purposes and authorized testing only. 
                  Never scan networks or systems you don't own without explicit permission. Unauthorized scanning 
                  may violate laws and terms of service.
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  <p>• Only scan your own networks</p>
                  <p>• Get written permission for penetration testing</p>
                  <p>• Respect rate limits and service availability</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            {results ? (
              <div className="space-y-6">
                {/* Summary */}
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="w-5 h-5 text-primary" />
                      Scan Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Target</Label>
                        <p className="font-mono">{results.target}</p>
                      </div>
                      <div>
                        <Label>Scan Type</Label>
                        <p className="capitalize">{results.scanType}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-3 bg-muted/20 rounded">
                        <p className="text-2xl font-bold">{results.summary.totalPorts}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                      <div className="p-3 bg-destructive/10 rounded">
                        <p className="text-2xl font-bold text-destructive">{results.summary.openPorts}</p>
                        <p className="text-xs text-muted-foreground">Open</p>
                      </div>
                      <div className="p-3 bg-yellow-500/10 rounded">
                        <p className="text-2xl font-bold text-yellow-400">{results.summary.filteredPorts}</p>
                        <p className="text-xs text-muted-foreground">Filtered</p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded">
                        <p className="text-2xl font-bold text-primary">{results.summary.closedPorts}</p>
                        <p className="text-xs text-muted-foreground">Closed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Results */}
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle>Port Scan Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {results.results.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/10 rounded border border-muted/20">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-semibold">{result.port}</span>
                            <Badge className={getStatusColor(result.status)}>
                              {result.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            {result.service && (
                              <p className="text-sm font-medium">{result.service}</p>
                            )}
                            {result.version && (
                              <p className="text-xs text-muted-foreground">{result.version}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                      <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(results, null, 2))} variant="outline" className="flex-1 gap-2">
                        <Copy className="w-4 h-4" />
                        Copy Results
                      </Button>
                      <Button onClick={exportResults} variant="outline" className="flex-1 gap-2">
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded mt-4">
                      <p>Scan completed: {new Date(results.timestamp).toLocaleString()}</p>
                      <p>All scan activities are logged for security purposes</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-gradient-card border-primary/20">
                <CardContent className="p-8 text-center">
                  <Scan className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Scan</h3>
                  <p className="text-muted-foreground">
                    Configure your target and scan type to begin network analysis.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Educational Information */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-accent mb-2">Network Scanning Basics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Common Ports & Services</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 21 - FTP (File Transfer)</li>
                  <li>• 22 - SSH (Secure Shell)</li>
                  <li>• 23 - Telnet (Unencrypted)</li>
                  <li>• 25 - SMTP (Email)</li>
                  <li>• 53 - DNS (Domain Names)</li>
                  <li>• 80 - HTTP (Web)</li>
                  <li>• 443 - HTTPS (Secure Web)</li>
                  <li>• 3389 - RDP (Remote Desktop)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Port States</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <span className="text-destructive">Open</span> - Service is running and accepting connections</li>
                  <li>• <span className="text-yellow-400">Filtered</span> - Firewall is blocking or filtering the port</li>
                  <li>• <span className="text-primary">Closed</span> - No service is running on this port</li>
                </ul>
                <p className="mt-3 text-xs">
                  <strong>Note:</strong> This is a simulated scanner for educational purposes. 
                  Real network scanning requires specialized tools like Nmap.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}