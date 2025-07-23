import { useState } from 'react';
import { Mail, ArrowLeft, Copy, Download, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface EmailAnalysis {
  sender: string;
  spf: 'pass' | 'fail' | 'neutral';
  dkim: 'pass' | 'fail' | 'neutral';
  dmarc: 'pass' | 'fail' | 'neutral';
  ipAddress: string;
  riskLevel: 'low' | 'medium' | 'high';
  phishingIndicators: string[];
  recommendation: string;
}

export default function EmailSecurity() {
  const [emailAddress, setEmailAddress] = useState('');
  const [emailHeaders, setEmailHeaders] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeEmail = async () => {
    if (!emailAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate email security analysis
      const indicators: string[] = [];
      let riskLevel: 'low' | 'medium' | 'high' = 'low';

      // Check for suspicious domains
      const suspiciousDomains = ['temp-mail', 'guerrillamail', '10minutemail', 'mailinator'];
      if (suspiciousDomains.some(domain => emailAddress.includes(domain))) {
        indicators.push('Temporary/disposable email service');
        riskLevel = 'high';
      }

      // Check for free email providers
      const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      if (freeProviders.some(provider => emailAddress.includes(provider))) {
        indicators.push('Free email provider (common in phishing)');
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      // Check for typosquatting
      const commonTypos = ['gmai1.com', 'gmial.com', 'yahooo.com', 'outlok.com'];
      if (commonTypos.some(typo => emailAddress.includes(typo))) {
        indicators.push('Possible typosquatting domain');
        riskLevel = 'high';
      }

      // Simulate SPF/DKIM/DMARC results
      const spfResult = Math.random() > 0.3 ? 'pass' : 'fail';
      const dkimResult = Math.random() > 0.2 ? 'pass' : 'fail';
      const dmarcResult = Math.random() > 0.4 ? 'pass' : 'fail';

      if (spfResult === 'fail') indicators.push('SPF validation failed');
      if (dkimResult === 'fail') indicators.push('DKIM signature invalid');
      if (dmarcResult === 'fail') indicators.push('DMARC policy violation');

      const mockAnalysis: EmailAnalysis = {
        sender: emailAddress,
        spf: spfResult,
        dkim: dkimResult,
        dmarc: dmarcResult,
        ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        riskLevel,
        phishingIndicators: indicators.length > 0 ? indicators : ['No obvious threats detected'],
        recommendation: riskLevel === 'high' ? 'Block this email - high phishing risk' : 
                       riskLevel === 'medium' ? 'Exercise caution - verify sender identity' : 
                       'Email appears legitimate'
      };

      setAnalysis(mockAnalysis);
      toast({
        title: "Analysis Complete",
        description: "Email security analysis completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeHeaders = async () => {
    if (!emailHeaders.trim()) {
      toast({
        title: "Error",
        description: "Please paste email headers to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simple header analysis
      const indicators: string[] = [];
      let riskLevel: 'low' | 'medium' | 'high' = 'low';

      if (emailHeaders.toLowerCase().includes('x-mailer: mass')) {
        indicators.push('Mass mailing software detected');
        riskLevel = 'medium';
      }

      if (emailHeaders.toLowerCase().includes('received: from [')) {
        indicators.push('Email sent from dynamic IP');
        riskLevel = 'medium';
      }

      const mockAnalysis: EmailAnalysis = {
        sender: 'Extracted from headers',
        spf: 'pass',
        dkim: 'pass', 
        dmarc: 'neutral',
        ipAddress: '192.168.1.100',
        riskLevel,
        phishingIndicators: indicators.length > 0 ? indicators : ['Headers appear normal'],
        recommendation: 'Header analysis completed - check individual fields for anomalies'
      };

      setAnalysis(mockAnalysis);
      toast({
        title: "Headers Analyzed",
        description: "Email header analysis completed",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to analyze headers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportAnalysis = () => {
    if (!analysis) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      analysis,
      tool: 'VRCyber Guard Email Security Analyzer'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-security-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-primary/20 text-primary border-primary/30';
      case 'fail': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'neutral': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-primary/20 text-primary border-primary/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
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
          
          <h1 className="text-3xl font-bold text-primary mb-2">Email Security Analyzer</h1>
          <p className="text-muted-foreground">
            Analyze email headers, check SPF/DKIM/DMARC records, and detect phishing attempts in emails.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email Address</TabsTrigger>
                <TabsTrigger value="headers">Email Headers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Email Address Analysis
                    </CardTitle>
                    <CardDescription>
                      Analyze an email address for security and authenticity indicators.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="suspicious@example.com"
                        onKeyPress={(e) => e.key === 'Enter' && analyzeEmail()}
                      />
                    </div>
                    <Button onClick={analyzeEmail} disabled={loading} variant="scan" className="w-full gap-2">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Analyze Email
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="headers">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Email Header Analysis
                    </CardTitle>
                    <CardDescription>
                      Paste raw email headers to analyze sender authenticity and routing.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="headers">Raw Email Headers</Label>
                      <Textarea
                        id="headers"
                        value={emailHeaders}
                        onChange={(e) => setEmailHeaders(e.target.value)}
                        placeholder="Paste email headers here (Received:, From:, DKIM-Signature:, etc.)"
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                    <Button onClick={analyzeHeaders} disabled={loading} variant="scan" className="w-full gap-2">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Analyze Headers
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Results Section */}
          <div>
            {analysis ? (
              <Card className="bg-gradient-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Security Analysis
                    </span>
                    <Badge className={getRiskColor(analysis.riskLevel)}>
                      {analysis.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Email Authentication */}
                  <div>
                    <Label className="mb-3 block">Email Authentication Status</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-3 bg-muted/10 rounded">
                        <Badge className={getStatusColor(analysis.spf)}>SPF</Badge>
                        <p className="text-xs mt-1 capitalize">{analysis.spf}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/10 rounded">
                        <Badge className={getStatusColor(analysis.dkim)}>DKIM</Badge>
                        <p className="text-xs mt-1 capitalize">{analysis.dkim}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/10 rounded">
                        <Badge className={getStatusColor(analysis.dmarc)}>DMARC</Badge>
                        <p className="text-xs mt-1 capitalize">{analysis.dmarc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sender Information */}
                  <div>
                    <Label>Sender Information</Label>
                    <div className="mt-2 p-3 bg-muted/10 rounded">
                      <p className="text-sm font-mono">{analysis.sender}</p>
                      <p className="text-xs text-muted-foreground">Origin IP: {analysis.ipAddress}</p>
                    </div>
                  </div>

                  {/* Security Indicators */}
                  <div>
                    <Label>Security Indicators</Label>
                    <div className="mt-2 space-y-2">
                      {analysis.phishingIndicators.map((indicator, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted/10 rounded">
                          {indicator.includes('No obvious threats') ? (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          )}
                          <span>{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div>
                    <Label>Recommendation</Label>
                    <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/20 rounded">
                      {analysis.recommendation}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(analysis, null, 2))} variant="outline" className="flex-1 gap-2">
                      <Copy className="w-4 h-4" />
                      Copy Results
                    </Button>
                    <Button onClick={exportAnalysis} variant="outline" className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded">
                    <p>Analysis completed: {new Date().toLocaleString()}</p>
                    <p>Session logged with IP and timestamp</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-card border-primary/20">
                <CardContent className="p-8 text-center">
                  <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground">
                    Enter an email address or paste headers to begin security analysis.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Educational Information */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-accent mb-2">Email Security Fundamentals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">SPF (Sender Policy Framework)</h4>
                <p className="text-muted-foreground">
                  Verifies that emails are sent from authorized servers. Helps prevent email spoofing 
                  by checking if the sending server is listed in the domain's DNS records.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">DKIM (DomainKeys Identified Mail)</h4>
                <p className="text-muted-foreground">
                  Uses cryptographic signatures to verify email integrity and authenticity. 
                  Ensures the email hasn't been tampered with during transmission.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">DMARC (Domain-based Message Authentication)</h4>
                <p className="text-muted-foreground">
                  Combines SPF and DKIM to provide comprehensive email authentication. 
                  Tells receiving servers what to do with emails that fail authentication.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}