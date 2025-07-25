import { useState } from 'react';
import { Search, ArrowLeft, Copy, Download, Globe, FolderOpen, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface DirectoryResult {
  path: string;
  status: number;
  size: string;
  lastModified: string;
  type: 'directory' | 'file';
  interesting: boolean;
}

interface DirbResults {
  target: string;
  wordlist: string;
  timestamp: string;
  totalRequests: number;
  foundPaths: DirectoryResult[];
  progress: number;
  completed: boolean;
}

export default function Dirb() {
  const [target, setTarget] = useState('');
  const [customWordlist, setCustomWordlist] = useState('');
  const [selectedWordlist, setSelectedWordlist] = useState('common');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DirbResults | null>(null);
  const { toast } = useToast();

  const commonWordlists = {
    common: ['admin', 'administrator', 'login', 'uploads', 'images', 'js', 'css', 'api', 'backup', 'config', 'test', 'dev', 'old', 'tmp'],
    directories: ['admin', 'administrator', 'uploads', 'images', 'files', 'docs', 'backup', 'old', 'test', 'dev', 'api', 'assets', 'static', 'public'],
    files: ['robots.txt', 'sitemap.xml', '.htaccess', 'config.php', 'admin.php', 'login.php', 'upload.php', 'backup.zip', 'database.sql', 'test.txt'],
    sensitive: ['admin', 'administrator', 'login', 'backup', 'config', 'database', 'sql', 'env', 'git', 'svn', 'old', 'bak', 'tmp']
  };

  const startDirectoryBruteforce = async () => {
    if (!target.trim()) {
      toast({
        title: "Error",
        description: "Please enter a target URL",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(target);
    } catch {
      toast({
        title: "Error", 
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      // Get wordlist
      let wordlist: string[];
      if (customWordlist.trim()) {
        wordlist = customWordlist.split('\n').map(w => w.trim()).filter(w => w);
      } else {
        wordlist = commonWordlists[selectedWordlist as keyof typeof commonWordlists];
      }

      // Initialize results
      const initialResults: DirbResults = {
        target,
        wordlist: customWordlist.trim() ? 'Custom' : selectedWordlist,
        timestamp: new Date().toISOString(),
        totalRequests: wordlist.length,
        foundPaths: [],
        progress: 0,
        completed: false
      };

      setResults(initialResults);

      // Simulate directory bruteforce with progress updates
      for (let i = 0; i < wordlist.length; i++) {
        const word = wordlist[i];
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

        // Simulate HTTP responses
        const statusCodes = [200, 301, 302, 403, 404, 500];
        const randomStatus = statusCodes[Math.floor(Math.random() * statusCodes.length)];
        
        // Only add "found" paths (not 404s)
        if (randomStatus !== 404 && Math.random() > 0.7) {
          const newPath: DirectoryResult = {
            path: `/${word}`,
            status: randomStatus,
            size: `${Math.floor(Math.random() * 10000)}B`,
            lastModified: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            type: Math.random() > 0.6 ? 'directory' : 'file',
            interesting: ['admin', 'login', 'backup', 'config', 'database', 'env'].some(s => word.includes(s))
          };

          setResults(prev => prev ? {
            ...prev,
            foundPaths: [...prev.foundPaths, newPath],
            progress: Math.round(((i + 1) / wordlist.length) * 100)
          } : null);
        } else {
          setResults(prev => prev ? {
            ...prev,
            progress: Math.round(((i + 1) / wordlist.length) * 100)
          } : null);
        }
      }

      // Mark as completed
      setResults(prev => prev ? { ...prev, completed: true } : null);

      toast({
        title: "Directory Scan Complete",
        description: `Found ${results?.foundPaths.length || 0} accessible paths`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform directory scan",
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
      toolInfo: 'VR-Cyber-Guard Dirb Tool'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dirb-scan-${results.target.replace(/[^a-zA-Z0-9]/g, '_')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-primary/20 text-primary border-primary/30';
    if (status >= 300 && status < 400) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (status >= 400 && status < 500) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (status >= 500) return 'bg-destructive/20 text-destructive border-destructive/30';
    return 'bg-muted text-muted-foreground border-muted';
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
          
          <h1 className="text-3xl font-bold text-primary mb-2">Dirb Directory Scanner</h1>
          <p className="text-muted-foreground">
            Discover hidden directories and files on web servers using dictionary-based attacks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Directory Bruteforce
                </CardTitle>
                <CardDescription>
                  Scan for hidden directories and files using wordlist-based enumeration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="target">Target URL</Label>
                  <Input
                    id="target"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="https://example.com"
                    onKeyPress={(e) => e.key === 'Enter' && startDirectoryBruteforce()}
                  />
                </div>

                <div>
                  <Label htmlFor="wordlist">Wordlist</Label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={selectedWordlist}
                    onChange={(e) => setSelectedWordlist(e.target.value)}
                  >
                    <option value="common">Common Paths</option>
                    <option value="directories">Directory Names</option>
                    <option value="files">Common Files</option>
                    <option value="sensitive">Sensitive Paths</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="custom-wordlist">Custom Wordlist (one per line)</Label>
                  <Textarea
                    id="custom-wordlist"
                    value={customWordlist}
                    onChange={(e) => setCustomWordlist(e.target.value)}
                    placeholder="admin&#10;login&#10;backup&#10;config"
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>

                <Button 
                  onClick={startDirectoryBruteforce} 
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
                      <Search className="w-4 h-4" />
                      Start Scan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Information Card */}
            <Card className="bg-accent/10 border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent">Directory Scanning Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Status Codes:</strong>
                  <ul className="mt-1 text-muted-foreground">
                    <li>• 200: Resource found and accessible</li>
                    <li>• 301/302: Redirected (potentially interesting)</li>
                    <li>• 403: Forbidden (exists but protected)</li>
                    <li>• 404: Not found</li>
                  </ul>
                </div>
                <div>
                  <strong>Interesting Paths:</strong> admin, login, backup, config, database, env files
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            {results ? (
              <div className="space-y-6">
                {/* Progress and Summary */}
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-primary" />
                      Scan Results for {new URL(results.target).hostname}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress: {results.progress}%</span>
                        <span>Found: {results.foundPaths.length} paths</span>
                      </div>
                      <Progress value={results.progress} className="w-full" />
                      
                      {results.completed && (
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
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Found Paths */}
                {results.foundPaths.length > 0 && (
                  <Card className="bg-muted/10 border-muted/20">
                    <CardHeader>
                      <CardTitle>Discovered Paths</CardTitle>
                      <CardDescription>
                        {results.foundPaths.filter(p => p.interesting).length} potentially interesting paths found
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {results.foundPaths.map((path, index) => (
                          <div key={index} className={`flex items-center justify-between p-3 rounded border ${path.interesting ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-background/50'}`}>
                            <div className="flex items-center gap-3">
                              {path.interesting && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                              <span className="font-mono text-sm">{results.target}{path.path}</span>
                              {path.type === 'directory' && <Badge variant="outline">DIR</Badge>}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(path.status)}>
                                {path.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{path.size}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-gradient-card border-primary/20">
                <CardContent className="p-8 text-center">
                  <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Scan</h3>
                  <p className="text-muted-foreground">
                    Enter a target URL and select a wordlist to begin directory discovery.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Educational Information */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-accent mb-3">About Directory Bruteforcing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">What is Dirb?</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Dictionary-based web content scanner</li>
                  <li>• Discovers hidden directories and files</li>
                  <li>• Uses wordlists to brute force paths</li>
                  <li>• Identifies potentially sensitive resources</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Common Findings</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Admin panels (/admin, /administrator)</li>
                  <li>• Backup files (.bak, .old, .backup)</li>
                  <li>• Configuration files (.env, config.php)</li>
                  <li>• Development directories (/test, /dev)</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              <strong>Disclaimer:</strong> This tool simulates directory scanning for educational purposes. 
              Only use on systems you own or have explicit permission to test.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}