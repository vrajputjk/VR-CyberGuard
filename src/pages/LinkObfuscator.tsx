import { useState } from 'react';
import { Eye, ArrowLeft, Copy, Download, AlertTriangle, Globe, Link2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface ObfuscatedLink {
  method: string;
  original: string;
  obfuscated: string;
  explanation: string;
  riskLevel: 'high' | 'medium' | 'low';
}

export default function LinkObfuscator() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [results, setResults] = useState<ObfuscatedLink[]>([]);
  const { toast } = useToast();

  const obfuscateUrl = () => {
    if (!originalUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to obfuscate",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    let url = originalUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      const urlObj = new URL(url);
      const obfuscations: ObfuscatedLink[] = [];

      // 1. URL Encoding
      const urlEncoded = encodeURIComponent(url);
      obfuscations.push({
        method: 'URL Encoding',
        original: url,
        obfuscated: urlEncoded,
        explanation: 'Encodes the URL using percent-encoding. Often used to bypass simple URL filters.',
        riskLevel: 'medium'
      });

      // 2. IP Address Conversion
      try {
        // Mock IP conversion (in real implementation, would resolve DNS)
        const mockIP = '216.58.214.174'; // Google's IP as example
        const ipUrl = url.replace(urlObj.hostname, mockIP);
        obfuscations.push({
          method: 'IP Address',
          original: url,
          obfuscated: ipUrl,
          explanation: 'Replaces domain name with IP address. Hides the actual domain from casual inspection.',
          riskLevel: 'high'
        });
      } catch (e) {
        // Ignore IP conversion errors
      }

      // 3. Homograph Attack
      const homographDomain = urlObj.hostname
        .replace(/google/g, 'gοοgle') // Using Greek omicron
        .replace(/microsoft/g, 'micrοsοft')
        .replace(/amazon/g, 'amаzon') // Using Cyrillic 'a'
        .replace(/paypal/g, 'pаypal');
      
      if (homographDomain !== urlObj.hostname) {
        const homographUrl = url.replace(urlObj.hostname, homographDomain);
        obfuscations.push({
          method: 'Homograph Attack',
          original: url,
          obfuscated: homographUrl,
          explanation: 'Uses similar-looking characters from different alphabets. Very deceptive to users.',
          riskLevel: 'high'
        });
      }

      // 4. Subdomain Obfuscation
      const subdomainUrl = url.replace(urlObj.hostname, `${urlObj.hostname}.suspicious-site.com`);
      obfuscations.push({
        method: 'Subdomain Spoofing',
        original: url,
        obfuscated: subdomainUrl,
        explanation: 'Places legitimate domain as subdomain of malicious domain. Tricks users into trusting the URL.',
        riskLevel: 'high'
      });

      // 5. URL Shortener Simulation
      const shortUrl = `https://bit.ly/${Math.random().toString(36).substr(2, 8)}`;
      obfuscations.push({
        method: 'URL Shortener',
        original: url,
        obfuscated: shortUrl,
        explanation: 'Hides the actual destination behind a short URL. Commonly used in phishing campaigns.',
        riskLevel: 'medium'
      });

      // 6. Data URI Scheme
      const dataUri = `data:text/html,<script>window.location='${url}'</script>`;
      obfuscations.push({
        method: 'Data URI Redirect',
        original: url,
        obfuscated: dataUri,
        explanation: 'Uses data URI to create an HTML redirect. Can bypass some security filters.',
        riskLevel: 'high'
      });

      // 7. Unicode Normalization
      const unicodeUrl = url.replace(/\./g, '\u2024'); // Unicode bullet point
      obfuscations.push({
        method: 'Unicode Confusion',
        original: url,
        obfuscated: unicodeUrl,
        explanation: 'Uses Unicode characters that look like normal punctuation but are different.',
        riskLevel: 'medium'
      });

      setResults(obfuscations);
      toast({
        title: "Obfuscation Complete",
        description: `Generated ${obfuscations.length} obfuscated variants`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid URL format",
        variant: "destructive",
      });
    }
  };

  const exportResults = () => {
    if (results.length === 0) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      originalUrl,
      obfuscations: results,
      disclaimer: 'Generated for educational purposes only',
      tool: 'VRCyber Guard Link Obfuscator'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `link-obfuscation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-primary/20 text-primary border-primary/30';
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
          
          <h1 className="text-3xl font-bold text-primary mb-2">Link Obfuscator</h1>
          <p className="text-muted-foreground">
            Educational tool to demonstrate URL manipulation techniques used in phishing attacks.
          </p>
        </div>

        {/* Warning Notice */}
        <Card className="mb-8 bg-destructive/10 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Educational Purposes Only
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>Warning:</strong> This tool demonstrates URL obfuscation techniques used by attackers. 
              The generated URLs are for educational and security awareness purposes only. 
              Do not use these techniques for malicious purposes or unauthorized testing.
            </p>
            <div className="mt-3 text-xs text-muted-foreground">
              <p>• Use only for authorized security testing</p>
              <p>• Help educate others about phishing techniques</p>
              <p>• Respect all applicable laws and regulations</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-primary" />
                  URL to Obfuscate
                </CardTitle>
                <CardDescription>
                  Enter a legitimate URL to see how attackers might disguise it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="url">Original URL</Label>
                  <Input
                    id="url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="https://www.google.com"
                    onKeyPress={(e) => e.key === 'Enter' && obfuscateUrl()}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter any legitimate URL (e.g., google.com, microsoft.com, paypal.com)
                  </p>
                </div>
                <Button onClick={obfuscateUrl} variant="scan" className="w-full gap-2">
                  <Eye className="w-4 h-4" />
                  Generate Obfuscated URLs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            {results.length > 0 ? (
              <Card className="bg-gradient-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Obfuscation Results
                    </span>
                    <Badge variant="outline">{results.length} variants</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {results.map((result, index) => (
                      <div key={index} className="p-4 bg-muted/10 rounded border border-muted/20">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">{result.method}</h4>
                          <Badge className={getRiskColor(result.riskLevel)}>
                            {result.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs">Obfuscated URL:</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="flex-1 text-xs bg-muted/20 p-2 rounded font-mono break-all">
                                {result.obfuscated}
                              </code>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  navigator.clipboard.writeText(result.obfuscated);
                                  toast({ title: "Copied", description: "URL copied to clipboard" });
                                }}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{result.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(results, null, 2));
                        toast({ title: "Copied", description: "All results copied to clipboard" });
                      }} 
                      variant="outline" 
                      className="flex-1 gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy All
                    </Button>
                    <Button onClick={exportResults} variant="outline" className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded">
                    <p>Generated: {new Date().toLocaleString()}</p>
                    <p>Remember: These are attack techniques - use responsibly</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-card border-primary/20">
                <CardContent className="p-8 text-center">
                  <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Obfuscate</h3>
                  <p className="text-muted-foreground">
                    Enter a URL to see various obfuscation techniques used by attackers.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Educational Information */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-accent mb-2">Understanding URL Obfuscation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Common Techniques</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>Homograph Attacks:</strong> Using similar characters from different alphabets</li>
                  <li>• <strong>IP Addresses:</strong> Replacing domain names with IP addresses</li>
                  <li>• <strong>URL Shorteners:</strong> Hiding destination behind short URLs</li>
                  <li>• <strong>Subdomain Spoofing:</strong> Making malicious domains look legitimate</li>
                  <li>• <strong>Unicode Confusion:</strong> Using special Unicode characters</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Protection Tips</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Always hover over links to see the actual destination</li>
                  <li>• Be suspicious of URLs with IP addresses</li>
                  <li>• Verify short URLs using preview services</li>
                  <li>• Look for unusual characters in domain names</li>
                  <li>• Use browser security features and extensions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}