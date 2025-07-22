import { useState } from 'react';
import { AlertTriangle, ArrowLeft, Copy, Download, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface BreachData {
  name: string;
  date: string;
  compromisedData: string[];
  description: string;
  verified: boolean;
}

interface BreachResult {
  email: string;
  found: boolean;
  breachCount: number;
  breaches: BreachData[];
  riskLevel: 'low' | 'medium' | 'high';
}

export default function BreachChecker() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BreachResult | null>(null);
  const { toast } = useToast();

  const checkBreaches = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate breach checking
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Mock breach data
      const sampleBreaches: BreachData[] = [
        {
          name: "LinkedIn Data Breach",
          date: "2021-06-22",
          compromisedData: ["Email addresses", "Phone numbers", "Geolocation data", "LinkedIn URLs"],
          description: "700 million LinkedIn profiles were scraped and posted for sale",
          verified: true
        },
        {
          name: "Facebook Data Leak", 
          date: "2021-04-03",
          compromisedData: ["Email addresses", "Phone numbers", "Names", "Location data"],
          description: "533 million Facebook users' data was leaked online",
          verified: true
        },
        {
          name: "Collection #1",
          date: "2019-01-17",
          compromisedData: ["Email addresses", "Passwords"],
          description: "Large collection of credentials from multiple breaches",
          verified: false
        }
      ];

      // Simulate random breach results
      const random = Math.random();
      const foundBreaches = random > 0.7 ? [] : 
                           random > 0.4 ? [sampleBreaches[0]] :
                           random > 0.2 ? [sampleBreaches[0], sampleBreaches[1]] :
                           sampleBreaches;

      const riskLevel = foundBreaches.length === 0 ? 'low' :
                       foundBreaches.length <= 1 ? 'medium' : 'high';

      setResult({
        email,
        found: foundBreaches.length > 0,
        breachCount: foundBreaches.length,
        breaches: foundBreaches,
        riskLevel
      });

      toast({
        title: foundBreaches.length > 0 ? "Breaches Found" : "No Breaches Found",
        description: foundBreaches.length > 0 ? 
          `Found ${foundBreaches.length} breach(es)` : 
          "This email was not found in known breaches",
        variant: foundBreaches.length > 0 ? "destructive" : "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check breach databases",
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
      query_email: result.email,
      result: result,
      disclaimer: 'Results are for educational purposes only'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breach-check-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          
          <h1 className="text-3xl font-bold text-primary mb-2">Email Breach Checker</h1>
          <p className="text-muted-foreground">
            Check if email addresses have been compromised in known data breaches and security incidents.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Email Breach Check
                </CardTitle>
                <CardDescription>
                  Enter an email address to check against known data breach databases.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    onKeyPress={(e) => e.key === 'Enter' && checkBreaches()}
                  />
                </div>

                <Button 
                  onClick={checkBreaches} 
                  disabled={loading} 
                  variant="scan" 
                  className="w-full gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Checking breaches...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Check Breaches
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="bg-accent/10 border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent text-sm">Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Email queries are not stored or logged</p>
                <p>• Results are generated for demonstration</p>
                <p>• Real breach checking uses encrypted queries</p>
                <p>• Consider using services like HaveIBeenPwned for real checks</p>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            {result ? (
              <div className="space-y-6">
                {/* Summary */}
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {result.found ? (
                          <XCircle className="w-5 h-5 text-destructive" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                        Breach Check Results
                      </span>
                      <Badge className={getRiskColor(result.riskLevel)}>
                        {result.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label>Email Address</Label>
                        <p className="font-mono">{result.email}</p>
                      </div>
                      
                      <div>
                        <Label>Status</Label>
                        <p className={result.found ? "text-destructive" : "text-primary"}>
                          {result.found ? 
                            `Found in ${result.breachCount} breach(es)` : 
                            "Not found in known breaches"
                          }
                        </p>
                      </div>

                      {result.found && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                          <h4 className="font-semibold text-destructive mb-2">Recommended Actions</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Change passwords for affected accounts</li>
                            <li>• Enable two-factor authentication</li>
                            <li>• Monitor for suspicious activity</li>
                            <li>• Consider using a password manager</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Breach Details */}
                {result.breaches.length > 0 && (
                  <Card className="bg-gradient-card border-primary/20">
                    <CardHeader>
                      <CardTitle>Breach Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {result.breaches.map((breach, index) => (
                          <div key={index} className="border border-destructive/20 rounded-lg p-4 bg-destructive/5">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{breach.name}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant={breach.verified ? "destructive" : "outline"}>
                                  {breach.verified ? "Verified" : "Unverified"}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(breach.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              {breach.description}
                            </p>
                            
                            <div>
                              <Label className="text-sm">Compromised Data:</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {breach.compromisedData.map((data, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {data}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-6 pt-4 border-t border-border">
                        <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))} variant="outline" className="flex-1 gap-2">
                          <Copy className="w-4 h-4" />
                          Copy Results
                        </Button>
                        <Button onClick={exportResults} variant="outline" className="flex-1 gap-2">
                          <Download className="w-4 h-4" />
                          Export Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-gradient-card border-primary/20">
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Check</h3>
                  <p className="text-muted-foreground">
                    Enter an email address to check against known data breaches.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Educational Information */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-accent mb-3">Understanding Data Breaches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Common Breach Types</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>Database Leaks:</strong> Exposed databases due to misconfigurations</li>
                  <li>• <strong>Hacking:</strong> Unauthorized access by cybercriminals</li>
                  <li>• <strong>Insider Threats:</strong> Data stolen by employees or contractors</li>
                  <li>• <strong>Third-party:</strong> Breaches at service providers or vendors</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Protection Tips</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Use unique passwords for each account</li>
                  <li>• Enable two-factor authentication where possible</li>
                  <li>• Regularly monitor your accounts for suspicious activity</li>
                  <li>• Use a reputable password manager</li>
                  <li>• Be cautious about sharing personal information online</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              <strong>Disclaimer:</strong> This tool provides simulated breach data for educational purposes. 
              For actual breach checking, use legitimate services like HaveIBeenPwned.com.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}