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

    // Enhanced URL validation and normalization
    let url = originalUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      const urlObj = new URL(url);
      const obfuscations: ObfuscatedLink[] = [];

      // 1. Advanced URL Encoding (Double/Triple)
      const doubleEncoded = encodeURIComponent(encodeURIComponent(url));
      const tripleEncoded = encodeURIComponent(doubleEncoded);
      obfuscations.push({
        method: 'Double URL Encoding',
        original: url,
        obfuscated: doubleEncoded,
        explanation: 'Double-encoded URL that bypasses basic filters. Many WAFs miss this.',
        riskLevel: 'high'
      });

      // 2. Hex Encoding
      const hexEncoded = url.split('').map(char => '%' + char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
      obfuscations.push({
        method: 'Hex Encoding',
        original: url,
        obfuscated: hexEncoded,
        explanation: 'Converts URL to hexadecimal representation. Often bypasses content filters.',
        riskLevel: 'medium'
      });

      // 3. Advanced IP Obfuscation (Multiple formats)
      const ipFormats = [
        '3627734950', // Decimal format
        '0xd83ac7a6', // Hexadecimal format  
        '0327.0116.0307.0246', // Octal format
        '216.58.214.174' // Standard dotted
      ];
      
      ipFormats.forEach((ipFormat, index) => {
        const ipUrl = url.replace(urlObj.hostname, ipFormat);
        obfuscations.push({
          method: `IP Format ${index + 1} (${['Decimal', 'Hex', 'Octal', 'Standard'][index]})`,
          original: url,
          obfuscated: ipUrl,
          explanation: `IP in ${['decimal', 'hexadecimal', 'octal', 'dotted'][index]} format. Hides domain completely.`,
          riskLevel: 'high'
        });
      });

      // 4. Enhanced Homograph Attacks (Multiple scripts)
      const homographMappings = [
        { from: 'google', to: 'gοοgle' }, // Greek omicron
        { from: 'microsoft', to: 'micrοsοft' },
        { from: 'amazon', to: 'amаzon' }, // Cyrillic 'a'
        { from: 'paypal', to: 'pаypal' },
        { from: 'apple', to: 'аpple' },
        { from: 'facebook', to: 'fасebook' },
        { from: 'twitter', to: 'twittеr' }, // Cyrillic 'e'
        { from: 'github', to: 'githυb' }, // Greek upsilon
        { from: 'linkedin', to: 'linkеdin' }
      ];

      homographMappings.forEach(mapping => {
        if (urlObj.hostname.includes(mapping.from)) {
          const homographDomain = urlObj.hostname.replace(mapping.from, mapping.to);
          const homographUrl = url.replace(urlObj.hostname, homographDomain);
          obfuscations.push({
            method: `Homograph Attack (${mapping.from})`,
            original: url,
            obfuscated: homographUrl,
            explanation: `Uses Cyrillic/Greek characters that look identical to Latin. Extremely deceptive.`,
            riskLevel: 'high'
          });
        }
      });

      // 5. Advanced Subdomain Spoofing
      const spoofDomains = [
        `${urlObj.hostname}.evil-site.com`,
        `secure-${urlObj.hostname}.phishing.net`,
        `${urlObj.hostname}-verify.suspicious.org`,
        `login.${urlObj.hostname}.fake-bank.co`,
        `api.${urlObj.hostname}.malicious.io`
      ];

      spoofDomains.forEach((spoofDomain, index) => {
        const spoofUrl = url.replace(urlObj.hostname, spoofDomain);
        obfuscations.push({
          method: `Subdomain Spoofing #${index + 1}`,
          original: url,
          obfuscated: spoofUrl,
          explanation: 'Places legitimate domain as subdomain to trick users into trusting the URL.',
          riskLevel: 'high'
        });
      });

      // 6. Multiple URL Shortener Simulations
      const shorteners = [
        { service: 'bit.ly', pattern: 'https://bit.ly/' },
        { service: 'tinyurl.com', pattern: 'https://tinyurl.com/' },
        { service: 't.co', pattern: 'https://t.co/' },
        { service: 'goo.gl', pattern: 'https://goo.gl/' },
        { service: 'ow.ly', pattern: 'https://ow.ly/' }
      ];

      shorteners.forEach(shortener => {
        const shortCode = Math.random().toString(36).substr(2, 8);
        const shortUrl = shortener.pattern + shortCode;
        obfuscations.push({
          method: `URL Shortener (${shortener.service})`,
          original: url,
          obfuscated: shortUrl,
          explanation: `${shortener.service} short URL hiding actual destination. Very common in phishing.`,
          riskLevel: 'medium'
        });
      });

      // 7. Advanced Redirect Techniques
      const redirectMethods = [
        `javascript:window.location='${url}'`,
        `data:text/html,<meta http-equiv="refresh" content="0;url=${url}">`,
        `data:text/html,<script>location.href='${url}'</script>`,
        `https://redirect-service.com/go?url=${encodeURIComponent(url)}`,
        `https://proxy-tunnel.net/browse.php?u=${btoa(url)}`
      ];

      redirectMethods.forEach((redirect, index) => {
        const methods = ['JavaScript', 'Meta Refresh', 'Script Redirect', 'Redirect Service', 'Proxy Tunnel'];
        obfuscations.push({
          method: `${methods[index]} Redirect`,
          original: url,
          obfuscated: redirect,
          explanation: `Uses ${methods[index].toLowerCase()} to redirect to target. Can bypass many security filters.`,
          riskLevel: 'high'
        });
      });

      // 8. Unicode Normalization Attacks
      const unicodeTricks = [
        url.replace(/\./g, '\u2024'), // Unicode bullet
        url.replace(/\//g, '\u2215'), // Division slash
        url.replace(/-/g, '\u2010'), // Hyphen
        url.replace(/:/g, '\uFF1A'), // Fullwidth colon
        url.replace(/www/g, 'ⱳⱳⱳ') // Special w characters
      ];

      unicodeTricks.forEach((unicodeUrl, index) => {
        if (unicodeUrl !== url) {
          obfuscations.push({
            method: `Unicode Confusion #${index + 1}`,
            original: url,
            obfuscated: unicodeUrl,
            explanation: 'Uses Unicode characters that appear identical but have different codes.',
            riskLevel: 'medium'
          });
        }
      });

      // 9. Base64 and Advanced Encoding
      const base64Url = btoa(url);
      const base64Redirect = `data:text/html,<script>location.href=atob('${base64Url}')</script>`;
      obfuscations.push({
        method: 'Base64 Encoding',
        original: url,
        obfuscated: base64Redirect,
        explanation: 'URL encoded in Base64 within JavaScript. Requires decoding to see destination.',
        riskLevel: 'high'
      });

      // 10. IDN (Internationalized Domain Name) Spoofing
      const idnSpoof = url.replace(urlObj.hostname, 'xn--e1afmkfd.xn--p1ai'); // Example Punycode
      obfuscations.push({
        method: 'IDN/Punycode Spoofing',
        original: url,
        obfuscated: idnSpoof,
        explanation: 'Uses Internationalized Domain Names to create confusing domains that look legitimate.',
        riskLevel: 'high'
      });

      setResults(obfuscations);
      toast({
        title: "Advanced Obfuscation Complete",
        description: `Generated ${obfuscations.length} sophisticated attack variants`,
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