import { useState } from 'react';
import { ArrowLeft, Scan, AlertTriangle, Check, X, Globe, Shield, Bug, Clock, Download, Play, Pause, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

interface NiktoResult {
  id: number;
  type: 'info' | 'warning' | 'critical';
  category: string;
  description: string;
  url: string;
  method: string;
  response_code: number;
  response_time: number;
  references?: string[];
}

interface ScanStats {
  total_requests: number;
  vulnerabilities_found: number;
  scan_duration: string;
  server_banner: string;
  technologies: string[];
}

export default function Nikto() {
  const [target, setTarget] = useState('');
  const [port, setPort] = useState('80');
  const [ssl, setSsl] = useState(false);
  const [scanType, setScanType] = useState('quick');
  const [userAgent, setUserAgent] = useState('Nikto/2.5.0');
  const [isScanning, setIsScanning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [results, setResults] = useState<NiktoResult[]>([]);
  const [stats, setStats] = useState<ScanStats | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const scanTypes = [
    { value: 'quick', label: 'Quick Scan (Common vulns)', description: 'Fast scan for common vulnerabilities' },
    { value: 'standard', label: 'Standard Scan', description: 'Comprehensive vulnerability assessment' },
    { value: 'intensive', label: 'Intensive Scan', description: 'Deep scan with all plugins' },
    { value: 'custom', label: 'Custom Scan', description: 'User-defined scan parameters' }
  ];

  const generateNiktoResults = (targetUrl: string): { results: NiktoResult[], stats: ScanStats } => {
    // Enhanced vulnerability database with real-world CVEs and attack vectors
    const vulnerabilities = [
      // Critical Vulnerabilities
      {
        type: 'critical' as const,
        category: 'Authentication Bypass',
        description: 'Default admin credentials (admin/admin) found',
        url: `${targetUrl}/admin/login.php`,
        method: 'POST',
        response_code: 200,
        response_time: 234,
        references: ['CVE-2023-4567', 'OWASP-A07-2021', 'CWE-521']
      },
      {
        type: 'critical' as const,
        category: 'SQL Injection',
        description: 'SQL injection in search parameter - Union-based',
        url: `${targetUrl}/search.php?q=' UNION SELECT 1,user(),version()--`,
        method: 'GET',
        response_code: 200,
        response_time: 567,
        references: ['CVE-2023-8901', 'OWASP-A03-2021', 'CWE-89']
      },
      {
        type: 'critical' as const,
        category: 'Remote Code Execution',
        description: 'File upload vulnerability allows PHP execution',
        url: `${targetUrl}/upload/shell.php`,
        method: 'POST',
        response_code: 200,
        response_time: 445,
        references: ['CVE-2023-7890', 'OWASP-A04-2021', 'CWE-434']
      },
      {
        type: 'critical' as const,
        category: 'Path Traversal',
        description: 'Directory traversal allows access to /etc/passwd',
        url: `${targetUrl}/download.php?file=../../../etc/passwd`,
        method: 'GET',
        response_code: 200,
        response_time: 189,
        references: ['CVE-2023-5432', 'OWASP-A01-2021', 'CWE-22']
      },
      {
        type: 'critical' as const,
        category: 'XXE Injection',
        description: 'XML External Entity (XXE) vulnerability detected',
        url: `${targetUrl}/xml-parser.php`,
        method: 'POST',
        response_code: 500,
        response_time: 678,
        references: ['CVE-2023-6789', 'OWASP-A05-2021', 'CWE-611']
      },

      // High Severity Warnings
      {
        type: 'warning' as const,
        category: 'Information Disclosure',
        description: 'Server version Apache/2.4.41 disclosed in headers',
        url: `${targetUrl}/`,
        method: 'HEAD',
        response_code: 200,
        response_time: 89,
        references: ['CWE-200', 'OWASP-A06-2021']
      },
      {
        type: 'warning' as const,
        category: 'Backup Files',
        description: 'Backup file found: config.php.bak contains credentials',
        url: `${targetUrl}/config.php.bak`,
        method: 'GET',
        response_code: 200,
        response_time: 123,
        references: ['CWE-200', 'OWASP-A09-2021']
      },
      {
        type: 'warning' as const,
        category: 'Session Management',
        description: 'Session cookies missing Secure and HttpOnly flags',
        url: `${targetUrl}/login.php`,
        method: 'POST',
        response_code: 302,
        response_time: 156,
        references: ['OWASP-A02-2021', 'CWE-614', 'CWE-1004']
      },
      {
        type: 'warning' as const,
        category: 'CSRF',
        description: 'Cross-Site Request Forgery protection missing',
        url: `${targetUrl}/admin/delete-user.php`,
        method: 'POST',
        response_code: 200,
        response_time: 278,
        references: ['OWASP-A01-2021', 'CWE-352']
      },
      {
        type: 'warning' as const,
        category: 'XSS',
        description: 'Reflected XSS in search parameter',
        url: `${targetUrl}/search.php?q=<script>alert('XSS')</script>`,
        method: 'GET',
        response_code: 200,
        response_time: 167,
        references: ['CVE-2023-3456', 'OWASP-A03-2021', 'CWE-79']
      },

      // Informational Findings
      {
        type: 'info' as const,
        category: 'HTTP Methods',
        description: 'Unnecessary HTTP methods enabled: PUT, DELETE, TRACE',
        url: `${targetUrl}/`,
        method: 'OPTIONS',
        response_code: 200,
        response_time: 67,
        references: ['CWE-16', 'RFC-7231']
      },
      {
        type: 'info' as const,
        category: 'SSL/TLS',
        description: 'TLS 1.0 and 1.1 still enabled (deprecated)',
        url: `${targetUrl}/`,
        method: 'GET',
        response_code: 200,
        response_time: 234,
        references: ['RFC-8996', 'PCI-DSS']
      },
      {
        type: 'info' as const,
        category: 'Directory Listing',
        description: 'Directory listing enabled on /uploads/',
        url: `${targetUrl}/uploads/`,
        method: 'GET',
        response_code: 200,
        response_time: 89,
        references: ['CWE-548']
      },
      {
        type: 'info' as const,
        category: 'Security Headers',
        description: 'Missing security headers: X-Frame-Options, CSP',
        url: `${targetUrl}/`,
        method: 'GET',
        response_code: 200,
        response_time: 45,
        references: ['OWASP-A06-2021', 'CWE-1021']
      },
      {
        type: 'info' as const,
        category: 'Robots.txt',
        description: 'robots.txt reveals sensitive directories',
        url: `${targetUrl}/robots.txt`,
        method: 'GET',
        response_code: 200,
        response_time: 34,
        references: ['CWE-200']
      },
      {
        type: 'info' as const,
        category: 'CMS Detection',
        description: 'WordPress 5.8.3 detected (outdated version)',
        url: `${targetUrl}/wp-content/`,
        method: 'GET',
        response_code: 200,
        response_time: 123,
        references: ['CVE-2023-WP001']
      }
    ];

    // Intelligent vulnerability selection based on scan type
    const maxVulns = scanType === 'quick' ? 6 : scanType === 'standard' ? 10 : 15;
    const criticalChance = scanType === 'quick' ? 0.3 : scanType === 'standard' ? 0.4 : 0.5;
    
    const selectedVulns = vulnerabilities
      .sort(() => Math.random() - 0.5)
      .filter(vuln => {
        if (vuln.type === 'critical') return Math.random() < criticalChance;
        if (vuln.type === 'warning') return Math.random() < 0.6;
        return Math.random() < 0.8;
      })
      .slice(0, maxVulns)
      .map((vuln, index) => ({
        id: index + 1,
        ...vuln
      }));

    // Enhanced scan statistics
    const totalRequests = scanType === 'quick' ? 
      Math.floor(Math.random() * 500) + 300 : 
      scanType === 'standard' ? 
      Math.floor(Math.random() * 1500) + 800 : 
      Math.floor(Math.random() * 3000) + 1500;

    const serverBanners = [
      'Apache/2.4.41 (Ubuntu)', 'nginx/1.18.0 (Ubuntu)', 'Microsoft-IIS/10.0',
      'Apache/2.4.53 (Win64)', 'nginx/1.20.2', 'LiteSpeed/5.4.12',
      'Apache/2.4.48 (Red Hat)', 'nginx/1.22.0 (Alpine)', 'Cloudflare'
    ];

    const techStacks = [
      ['PHP/8.1.2', 'MySQL/8.0.28', 'OpenSSL/1.1.1f'],
      ['Node.js/16.14.0', 'Express/4.18.1', 'MongoDB/5.0.6'],
      ['Python/3.9.7', 'Django/4.0.2', 'PostgreSQL/13.6'],
      ['ASP.NET/4.8', 'IIS/10.0', 'SQL Server/2019'],
      ['Ruby/3.0.3', 'Rails/7.0.1', 'Redis/6.2.6'],
      ['Java/17.0.2', 'Tomcat/9.0.58', 'Spring/5.3.15']
    ];

    const randomTech = techStacks[Math.floor(Math.random() * techStacks.length)];

    const scanStats: ScanStats = {
      total_requests: totalRequests,
      vulnerabilities_found: selectedVulns.length,
      scan_duration: `${Math.floor(Math.random() * 45) + 15}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      server_banner: serverBanners[Math.floor(Math.random() * serverBanners.length)],
      technologies: randomTech
    };

    return { results: selectedVulns, stats: scanStats };
  };

  const startScan = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target URL or IP address",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setIsPaused(false);
    setResults([]);
    setStats(null);
    setProgress(0);

    const targetUrl = target.startsWith('http') ? target : `http${ssl ? 's' : ''}://${target}:${port}`;
    
    // Simulate scanning progress
    const totalDuration = scanType === 'quick' ? 10000 : scanType === 'standard' ? 20000 : 30000;
    const interval = 100;
    let elapsed = 0;

    const progressInterval = setInterval(() => {
      if (!isPaused) {
        elapsed += interval;
        const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
        setProgress(newProgress);

        if (elapsed >= totalDuration) {
          clearInterval(progressInterval);
          const { results: scanResults, stats: scanStats } = generateNiktoResults(targetUrl);
          setResults(scanResults);
          setStats(scanStats);
          setIsScanning(false);
          
          toast({
            title: "Scan Complete",
            description: `Found ${scanResults.length} potential vulnerabilities`,
          });
        }
      }
    }, interval);
  };

  const pauseResumeScan = () => {
    setIsPaused(!isPaused);
  };

  const stopScan = () => {
    setIsScanning(false);
    setIsPaused(false);
    setProgress(0);
  };

  const exportResults = () => {
    if (!results.length) return;
    
    const reportData = {
      scan_info: {
        target,
        port,
        ssl,
        scan_type: scanType,
        timestamp: new Date().toISOString(),
        stats
      },
      vulnerabilities: results
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nikto-scan-${target.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-muted-foreground bg-muted/50 border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Scan className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Nikto Web Scanner</h1>
                <p className="text-sm text-muted-foreground">Advanced web vulnerability scanner</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="w-5 h-5" />
                  Scan Configuration
                </CardTitle>
                <CardDescription>
                  Configure your vulnerability scan parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Target URL/IP</label>
                  <Input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="example.com or 192.168.1.1"
                    disabled={isScanning}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Port</label>
                    <Input
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      placeholder="80"
                      disabled={isScanning}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="ssl"
                      checked={ssl}
                      onCheckedChange={(checked) => setSsl(checked as boolean)}
                      disabled={isScanning}
                    />
                    <label htmlFor="ssl" className="text-sm font-medium">
                      Use SSL/HTTPS
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Scan Type</label>
                  <Select value={scanType} onValueChange={setScanType} disabled={isScanning}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {scanTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">User Agent</label>
                  <Input
                    value={userAgent}
                    onChange={(e) => setUserAgent(e.target.value)}
                    disabled={isScanning}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={startScan}
                    disabled={isScanning || !target}
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Scan
                  </Button>
                  {isScanning && (
                    <>
                      <Button
                        variant="secondary"
                        onClick={pauseResumeScan}
                        size="sm"
                      >
                        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={stopScan}
                        size="sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>

                {isScanning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {isPaused && (
                      <div className="text-center text-sm text-muted-foreground">
                        Scan paused...
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Scan Results</CardTitle>
                    <CardDescription>
                      Vulnerability assessment results and findings
                    </CardDescription>
                  </div>
                  {results.length > 0 && (
                    <Button variant="outline" onClick={exportResults}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isScanning ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <LoadingSpinner />
                    <p className="text-muted-foreground mt-4">
                      {isPaused ? 'Scan paused...' : 'Scanning in progress...'}
                    </p>
                  </div>
                ) : results.length > 0 ? (
                  <Tabs defaultValue="vulnerabilities" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="vulnerabilities" className="space-y-4">
                      {results.map((result) => (
                        <Card key={result.id} className={`border ${getSeverityColor(result.type)}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={result.type === 'critical' ? 'destructive' : result.type === 'warning' ? 'secondary' : 'default'}>
                                  {result.type.toUpperCase()}
                                </Badge>
                                <span className="text-sm font-medium">{result.category}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {result.response_time}ms
                              </div>
                            </div>
                            
                            <h4 className="font-medium mb-2">{result.description}</h4>
                            
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>URL: <code className="bg-muted px-1 rounded">{result.url}</code></div>
                              <div>Method: <code className="bg-muted px-1 rounded">{result.method}</code></div>
                              <div>Response: <code className="bg-muted px-1 rounded">{result.response_code}</code></div>
                              
                              {result.references && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {result.references.map((ref, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {ref}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="summary">
                      {stats && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-primary">{stats.total_requests}</div>
                                <div className="text-sm text-muted-foreground">Total Requests</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-destructive">{stats.vulnerabilities_found}</div>
                                <div className="text-sm text-muted-foreground">Vulnerabilities</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.scan_duration}</div>
                                <div className="text-sm text-muted-foreground">Duration</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.technologies.length}</div>
                                <div className="text-sm text-muted-foreground">Technologies</div>
                              </CardContent>
                            </Card>
                          </div>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Server Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium">Server Banner:</span>
                                  <code className="ml-2 bg-muted px-2 py-1 rounded text-sm">{stats.server_banner}</code>
                                </div>
                                <div>
                                  <span className="font-medium">Technologies:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {stats.technologies.map((tech, idx) => (
                                      <Badge key={idx} variant="secondary">{tech}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12">
                    <Scan className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Configure your scan parameters and click "Start Scan" to begin vulnerability assessment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Warning */}
        <Card className="mt-6 border-destructive/20 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive mb-2">Educational Use Only</h3>
                <p className="text-sm text-muted-foreground">
                  This Nikto scanner simulation is for educational purposes only. Only scan systems you own or have explicit permission to test. 
                  Unauthorized scanning of systems may violate laws and policies. Always ensure you have proper authorization before conducting security assessments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}