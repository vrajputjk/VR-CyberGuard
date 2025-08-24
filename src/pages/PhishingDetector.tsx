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
      
      // Enhanced URL analysis patterns
      const urlLower = url.toLowerCase();
      
      // URL shorteners (higher risk)
      const shorteners = ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly', 'short.link', 'tiny.cc', 'is.gd', 'buff.ly', 'rebrand.ly', 'cutt.ly'];
      if (shorteners.some(s => urlLower.includes(s))) {
        indicators.push('URL shortener detected - hides true destination');
        score += 35;
      }
      
      // Known phishing patterns and typosquatting
      const legitimateDomains = ['google', 'facebook', 'microsoft', 'apple', 'amazon', 'paypal', 'netflix', 'spotify', 'dropbox', 'github'];
      const suspiciousVariations = ['g00gle', 'facebbok', 'micr0soft', 'app1e', 'amaz0n', 'payp4l', 'netf1ix', 'sp0tify', 'dr0pbox', 'githvb'];
      
      if (suspiciousVariations.some(variation => urlLower.includes(variation))) {
        indicators.push('Possible typosquatting - mimics legitimate domain');
        score += 60;
      }
      
      // Check for brand impersonation with common misspellings
      legitimateDomains.forEach(domain => {
        if (urlLower.includes(domain) && !urlLower.includes(`${domain}.com`) && !urlLower.includes(`${domain}.org`)) {
          indicators.push(`Possible brand impersonation of ${domain}`);
          score += 45;
        }
      });
      
      // Suspicious keywords
      const suspiciousKeywords = ['phishing', 'malware', 'virus', 'hack', 'crack', 'trojan', 'ransomware'];
      if (suspiciousKeywords.some(keyword => urlLower.includes(keyword))) {
        indicators.push('Suspicious keywords in URL detected');
        score += 50;
      }
      
      // Security indicators
      if (!url.startsWith('https://')) {
        indicators.push('No HTTPS encryption - data not secure');
        score += 25;
      }
      
      // Homograph/IDN attacks
      if (/[а-я]/.test(url) || /[α-ω]/.test(url) || /[א-ת]/.test(url)) {
        indicators.push('Possible homograph attack using non-Latin characters');
        score += 45;
      }
      
      // Suspicious domain patterns
      const suspiciousPrefixes = ['secure-', 'verify-', 'update-', 'confirm-', 'account-', 'support-', 'help-'];
      if (suspiciousPrefixes.some(prefix => urlLower.includes(prefix))) {
        indicators.push('Suspicious domain pattern mimicking legitimate services');
        score += 40;
      }

      // IP addresses instead of domains
      if (/\d+\.\d+\.\d+\.\d+/.test(url)) {
        indicators.push('IP address used instead of domain name');
        score += 45;
      }

      // Excessive subdomains
      const subdomainCount = (url.match(/\./g) || []).length;
      if (subdomainCount > 4) {
        indicators.push('Excessive subdomains detected');
        score += 25;
      }

      // Suspicious TLDs
      const suspiciousTlds = ['.tk', '.ml', '.cf', '.ga', '.pw', '.top'];
      if (suspiciousTlds.some(tld => urlLower.includes(tld))) {
        indicators.push('Suspicious top-level domain');
        score += 30;
      }

      // Long domains
      try {
        const domain = new URL(url).hostname;
        if (domain.length > 30) {
          indicators.push('Unusually long domain name');
          score += 20;
        }
      } catch (e) {
        indicators.push('Invalid URL format');
        score += 60;
      }

      let status: 'safe' | 'suspicious' | 'phishing';
      let explanation: string;

      if (score >= 70) {
        status = 'phishing';
        explanation = 'High probability of phishing. Multiple red flags detected. Do not visit this URL.';
      } else if (score >= 30) {
        status = 'suspicious';
        explanation = 'Potentially suspicious. Exercise caution and verify the source before proceeding.';
      } else {
        status = 'safe';
        explanation = 'No obvious phishing indicators detected. However, always remain vigilant.';
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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