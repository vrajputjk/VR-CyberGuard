import { useState } from 'react';
import { Shield, AlertTriangle, ArrowLeft, Copy, Download, Globe, FileText, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface PhishingResult {
  status: 'safe' | 'suspicious' | 'phishing';
  score: number;
  indicators: string[];
  explanation: string;
}

// Helper function for edit distance calculation
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  return matrix[str2.length][str1.length];
};

export default function PhishingDetector() {
  const [url, setUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhishingResult | null>(null);
  const { toast } = useToast();

  const analyzeURL = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate phishing detection logic
      const indicators: string[] = [];
      let score = 0;
      
      // Enhanced URL analysis patterns with comprehensive detection
      const urlLower = url.toLowerCase();
      let urlObj: URL;
      
      try {
        urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
      } catch (e) {
        indicators.push('Invalid URL format or malformed structure');
        score += 70;
        setResult({
          status: 'phishing',
          score: 70,
          indicators,
          explanation: 'Malformed URL detected. This is often a sign of phishing attempts.'
        });
        return;
      }
      
      const domain = urlObj.hostname.toLowerCase();
      const path = urlObj.pathname.toLowerCase();
      
      // Advanced URL shortener detection
      const shorteners = [
        'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link', 
        'tiny.cc', 'is.gd', 'buff.ly', 'rebrand.ly', 'cutt.ly', 'rb.gy',
        'adf.ly', 'bc.vc', 'lnkd.in', 'amzn.to', 'youtu.be', 'tco'
      ];
      if (shorteners.some(s => domain.includes(s))) {
        indicators.push('URL shortener detected - destination hidden, commonly used in phishing');
        score += 40;
      }
      
      // Enhanced typosquatting detection with Levenshtein distance
      const legitimateDomains = {
        'google.com': ['gooogle.com', 'googel.com', 'g00gle.com', 'googlle.com'],
        'facebook.com': ['facebbok.com', 'fecebook.com', 'facbook.com', 'facebook.co'],
        'microsoft.com': ['mircosoft.com', 'microsft.com', 'micr0soft.com'],
        'apple.com': ['aple.com', 'appple.com', 'app1e.com', 'aplle.com'],
        'amazon.com': ['amazom.com', 'amaz0n.com', 'amazone.com', 'amazon.co'],
        'paypal.com': ['payp4l.com', 'paypaI.com', 'paypal.co', 'paypaI.com'],
        'netflix.com': ['netf1ix.com', 'netflx.com', 'netfIix.com', 'netflix.co'],
        'spotify.com': ['sp0tify.com', 'spotfy.com', 'spotlfy.com'],
        'github.com': ['githvb.com', 'gitub.com', 'github.co'],
        'linkedin.com': ['linkedin.co', 'linkedln.com', 'lnkedin.com']
      };
      
      Object.entries(legitimateDomains).forEach(([legitimate, variants]) => {
        variants.forEach(variant => {
          if (domain.includes(variant.replace('.com', '').replace('.co', ''))) {
            indicators.push(`Typosquatting detected: mimics ${legitimate}`);
            score += 65;
          }
        });
        
        // Check Levenshtein distance for similar domains
        const legitDomain = legitimate.replace('.com', '');
        const currentDomain = domain.replace(/\.(com|org|net|co|io)$/, '');
        if (levenshteinDistance(currentDomain, legitDomain) <= 2 && currentDomain !== legitDomain) {
          indicators.push(`Possible typosquatting of ${legitimate} (edit distance: ${levenshteinDistance(currentDomain, legitDomain)})`);
          score += 50;
        }
      });
      
      // Advanced homograph attack detection
      const homographPatterns = [
        { name: 'Cyrillic a', pattern: /а/g, replacement: 'a' },
        { name: 'Cyrillic e', pattern: /е/g, replacement: 'e' },
        { name: 'Greek omicron', pattern: /ο/g, replacement: 'o' },
        { name: 'Cyrillic p', pattern: /р/g, replacement: 'p' },
        { name: 'Cyrillic c', pattern: /с/g, replacement: 'c' },
        { name: 'Cyrillic o', pattern: /о/g, replacement: 'o' },
        { name: 'Hebrew characters', pattern: /[א-ת]/g, replacement: '' },
        { name: 'Arabic characters', pattern: /[ا-ي]/g, replacement: '' }
      ];
      
      homographPatterns.forEach(pattern => {
        if (pattern.pattern.test(domain)) {
          indicators.push(`Homograph attack detected: ${pattern.name} used to mimic Latin characters`);
          score += 60;
        }
      });
      
      // Enhanced suspicious domain pattern detection
      const suspiciousPatterns = [
        { pattern: /secure-[a-z]+/, desc: 'Fake security prefix' },
        { pattern: /verify-[a-z]+/, desc: 'Verification spoofing' },
        { pattern: /update-[a-z]+/, desc: 'Update urgency tactics' },
        { pattern: /account-[a-z]+/, desc: 'Account impersonation' },
        { pattern: /support-[a-z]+/, desc: 'Support service spoofing' },
        { pattern: /login-[a-z]+/, desc: 'Login page impersonation' },
        { pattern: /[a-z]+-security/, desc: 'Security service spoofing' }
      ];
      
      suspiciousPatterns.forEach(({ pattern, desc }) => {
        if (pattern.test(domain)) {
          indicators.push(`Suspicious domain pattern: ${desc}`);
          score += 45;
        }
      });
      
      // Protocol security check
      if (urlObj.protocol !== 'https:') {
        indicators.push('Insecure HTTP protocol - data transmitted in plain text');
        score += 30;
      }
      
      // IP address usage instead of domain
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipPattern.test(domain)) {
        indicators.push('Direct IP address used instead of domain name');
        score += 50;
      }
      
      // Suspicious top-level domains
      const suspiciousTlds = ['.tk', '.ml', '.cf', '.ga', '.pw', '.top', '.click', '.download', '.zip'];
      const tld = domain.substring(domain.lastIndexOf('.'));
      if (suspiciousTlds.includes(tld)) {
        indicators.push(`Suspicious TLD "${tld}" commonly used for malicious purposes`);
        score += 35;
      }
      
      // Excessive subdomain analysis
      const subdomains = domain.split('.');
      if (subdomains.length > 4) {
        indicators.push(`Excessive subdomains (${subdomains.length}) - often used to confuse users`);
        score += 25;
      }
      
      // Domain length analysis
      if (domain.length > 40) {
        indicators.push(`Unusually long domain name (${domain.length} characters)`);
        score += 20;
      }
      
      // Suspicious path analysis
      const suspiciousPaths = [
        '/login', '/signin', '/verify', '/update', '/security', '/confirm',
        '/account-locked', '/suspended', '/billing-problem', '/expires-today',
        '/click-here', '/urgent', '/immediate-action', '/download.php'
      ];
      
      suspiciousPaths.forEach(suspiciousPath => {
        if (path.includes(suspiciousPath)) {
          indicators.push(`Suspicious URL path: "${suspiciousPath}" commonly used in phishing`);
          score += 15;
        }
      });
      
      // Port analysis
      const port = urlObj.port;
      const suspiciousPorts = ['8080', '8443', '8000', '3000', '4444', '9999'];
      if (port && suspiciousPorts.includes(port)) {
        indicators.push(`Suspicious port number: ${port}`);
        score += 20;
      }
      
      // URL encoding obfuscation
      if (url.includes('%') && (url.match(/%/g) || []).length > 5) {
        indicators.push('Excessive URL encoding detected - possible obfuscation');
        score += 30;
      }

      
      let status: 'safe' | 'suspicious' | 'phishing';
      let explanation: string;

      if (score >= 80) {
        status = 'phishing';
        explanation = 'CRITICAL: High probability of phishing attack. Multiple advanced threat indicators detected. DO NOT visit this URL.';
      } else if (score >= 50) {
        status = 'phishing';
        explanation = 'HIGH RISK: Strong indicators of phishing. This URL exhibits multiple suspicious characteristics.';
      } else if (score >= 25) {
        status = 'suspicious';
        explanation = 'CAUTION: Potentially suspicious URL. Exercise extreme caution and verify the source before proceeding.';
      } else {
        status = 'safe';
        explanation = 'LOW RISK: No obvious phishing indicators detected. However, always remain vigilant online.';
      }

      setResult({
        status,
        score,
        indicators: indicators.length > 0 ? indicators : ['No obvious threats detected'],
        explanation
      });

      toast({
        title: "Analysis Complete",
        description: "URL analysis completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze URL",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeText = async () => {
    if (!textContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const indicators: string[] = [];
      let score = 0;
      
      // Check for urgent language
      const urgentPhrases = ['urgent', 'immediate', 'expire', 'suspend', 'verify now', 'click here', 'act now', 'limited time', 'expires today', 'verify immediately', 'account will be closed', 'suspended', 'frozen', 'locked'];
      urgentPhrases.forEach(phrase => {
        if (textContent.toLowerCase().includes(phrase)) {
          indicators.push(`Urgent language: "${phrase}"`);
          score += 15;
        }
      });
      
      // Check for personal information requests
      const personalInfoRequests = ['social security', 'ssn', 'credit card', 'bank account', 'routing number', 'pin', 'mother\'s maiden name', 'date of birth', 'driver\'s license'];
      personalInfoRequests.forEach(request => {
        if (textContent.toLowerCase().includes(request)) {
          indicators.push(`Requests sensitive information: "${request}"`);
          score += 25;
        }
      });
      
      // Check for financial threats
      const financialThreats = ['account blocked', 'payment failed', 'unauthorized access', 'security alert'];
      financialThreats.forEach(threat => {
        if (textContent.toLowerCase().includes(threat)) {
          indicators.push(`Financial threat: "${threat}"`);
          score += 25;
        }
      });
      
      // Check for generic greetings
      if (textContent.toLowerCase().includes('dear customer') || textContent.toLowerCase().includes('dear user')) {
        indicators.push('Generic greeting instead of personalized');
        score += 20;
      }

      // Check for spelling/grammar issues (simplified)
      const commonErrors = ['recieve', 'seperate', 'occured', 'priviledge', 'definately', 'loose' /* for lose */, 'there account' /* their */, 'you\'re account' /* your */, 'affect' /* effect */, 'alot'];
      commonErrors.forEach(error => {
        if (textContent.toLowerCase().includes(error)) {
          indicators.push('Spelling/grammar errors detected');
          score += 10;
        }
      });
      
      // Check for reward/prize schemes
      const rewardSchemes = ['you have won', 'congratulations', 'claim your prize', 'free gift', 'winner', 'lottery', '$1000', 'cash prize', 'inheritance'];
      rewardSchemes.forEach(scheme => {
        if (textContent.toLowerCase().includes(scheme)) {
          indicators.push(`Possible reward scam: "${scheme}"`);
          score += 30;
        }
      });

      let status: 'safe' | 'suspicious' | 'phishing';
      let explanation: string;

      if (score >= 60) {
        status = 'phishing';
        explanation = 'High probability of phishing content. Multiple suspicious indicators detected.';
      } else if (score >= 25) {
        status = 'suspicious';
        explanation = 'Potentially suspicious content. Verify the sender and be cautious.';
      } else {
        status = 'safe';
        explanation = 'No obvious phishing indicators in the text content.';
      }

      setResult({
        status,
        score,
        indicators: indicators.length > 0 ? indicators : ['No obvious threats detected'],
        explanation
      });

      toast({
        title: "Analysis Complete",
        description: "Text analysis completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze text",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!result) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      analysis_type: url ? 'url' : 'text',
      input: url || textContent,
      result: result,
      user_ip: 'Detected via browser'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlObj;
    a.download = `phishing-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlObj);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-primary/20 text-primary border-primary/30';
      case 'suspicious': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'phishing': return 'bg-destructive/20 text-destructive border-destructive/30';
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
          
          <h1 className="text-3xl font-bold text-primary mb-2">Phishing Detector</h1>
          <p className="text-muted-foreground">
            Analyze URLs, text content, and files to identify potential phishing attempts and malicious content.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="file">File</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      URL Analysis
                    </CardTitle>
                    <CardDescription>
                      Enter a suspicious URL to check for phishing indicators.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="url">URL to Analyze</Label>
                      <Input
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://suspicious-site.com"
                        onKeyPress={(e) => e.key === 'Enter' && analyzeURL()}
                      />
                    </div>
                    <Button onClick={analyzeURL} disabled={loading} variant="scan" className="w-full gap-2">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Analyze URL
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="text">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Text Analysis
                    </CardTitle>
                    <CardDescription>
                      Paste suspicious text content to analyze for phishing patterns.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="text">Text Content</Label>
                      <Textarea
                        id="text"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        placeholder="Paste email content or message text here..."
                        rows={6}
                      />
                    </div>
                    <Button onClick={analyzeText} disabled={loading} variant="scan" className="w-full gap-2">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Analyze Text
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="file">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" />
                      File Analysis
                    </CardTitle>
                    <CardDescription>
                      Upload files to analyze for malicious content (coming soon).
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">File upload feature coming soon</p>
                      <p className="text-sm text-muted-foreground">Will support PDF, DOC, EXE analysis</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Results Section */}
          <div>
            {result ? (
              <Card className="bg-gradient-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Analysis Results
                    </span>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Threat Score</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            result.score >= 70 ? 'bg-destructive' : 
                            result.score >= 30 ? 'bg-yellow-500' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(result.score, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm font-semibold">{result.score}/100</span>
                    </div>
                  </div>

                  <div>
                    <Label>Explanation</Label>
                    <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/20 rounded">
                      {result.explanation}
                    </p>
                  </div>

                  <div>
                    <Label>Detected Indicators</Label>
                    <div className="mt-2 space-y-2">
                      {result.indicators.map((indicator, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span>{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))} variant="outline" className="flex-1 gap-2">
                      <Copy className="w-4 h-4" />
                      Copy Results
                    </Button>
                    <Button onClick={exportResults} variant="outline" className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded">
                    <p>Analysis completed at: {new Date().toLocaleString()}</p>
                    <p>Session logged with IP and timestamp</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-card border-primary/20">
                <CardContent className="p-8 text-center">
                  <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground">
                    Enter a URL or text content to begin phishing detection analysis.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Educational Note */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-accent mb-2">How Phishing Detection Works</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Our analyzer checks for common phishing indicators including suspicious URLs, urgent language, 
              generic greetings, and known attack patterns. This is a basic educational tool - always use 
              multiple sources for verification.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong className="text-primary">URL Indicators:</strong>
                <ul className="list-disc list-inside text-muted-foreground mt-1">
                  <li>URL shorteners</li>
                  <li>IP addresses</li>
                  <li>Suspicious domains</li>
                  <li>Missing HTTPS</li>
                </ul>
              </div>
              <div>
                <strong className="text-accent">Text Indicators:</strong>
                <ul className="list-disc list-inside text-muted-foreground mt-1">
                  <li>Urgent language</li>
                  <li>Generic greetings</li>
                  <li>Financial threats</li>
                  <li>Grammar errors</li>
                </ul>
              </div>
              <div>
                <strong className="text-yellow-400">Risk Levels:</strong>
                <ul className="list-disc list-inside text-muted-foreground mt-1">
                  <li>Safe: 0-29 points</li>
                  <li>Suspicious: 30-69</li>
                  <li>Phishing: 70+ points</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}