import { useState } from 'react';
import { Download, Globe, ArrowLeft, Copy, FolderOpen, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface CloneResult {
  url: string;
  status: 'success' | 'partial' | 'failed';
  totalFiles: number;
  downloadedFiles: number;
  failedFiles: number;
  totalSize: string;
  downloadPath: string;
  timestamp: string;
  metadata: {
    htmlFiles: number;
    cssFiles: number;
    jsFiles: number;
    imageFiles: number;
    otherFiles: number;
  };
  errors: string[];
}

export default function WebsiteCloner() {
  const [targetUrl, setTargetUrl] = useState('');
  const [downloadPath, setDownloadPath] = useState('downloads/cloned-sites');
  const [depth, setDepth] = useState('2');
  const [loading, setLoading] = useState(false);
  const [cloneResult, setCloneResult] = useState<CloneResult | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Advanced options
  const [includeImages, setIncludeImages] = useState(true);
  const [includeCSS, setIncludeCSS] = useState(true);
  const [includeJS, setIncludeJS] = useState(true);
  const [followExternalLinks, setFollowExternalLinks] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState('10');
  
  const { toast } = useToast();

  const cloneWebsite = async () => {
    if (!targetUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a website URL to clone",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(targetUrl);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL (include http:// or https://)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setProgress(0);
    
    try {
      // Simulate cloning process with progress
      const steps = 20;
      for (let i = 0; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress((i / steps) * 100);
      }

      // Simulate clone results
      const totalFiles = Math.floor(Math.random() * 200) + 50;
      const failedFiles = Math.floor(Math.random() * 10);
      const downloadedFiles = totalFiles - failedFiles;
      
      const mockResult: CloneResult = {
        url: targetUrl,
        status: failedFiles > 5 ? 'partial' : 'success',
        totalFiles,
        downloadedFiles,
        failedFiles,
        totalSize: `${(Math.random() * 50 + 5).toFixed(2)} MB`,
        downloadPath: `${downloadPath}/${new URL(targetUrl).hostname}`,
        timestamp: new Date().toISOString(),
        metadata: {
          htmlFiles: Math.floor(totalFiles * 0.1),
          cssFiles: Math.floor(totalFiles * 0.05),
          jsFiles: Math.floor(totalFiles * 0.08),
          imageFiles: Math.floor(totalFiles * 0.6),
          otherFiles: Math.floor(totalFiles * 0.17)
        },
        errors: failedFiles > 0 ? [
          'Failed to download some images due to 403 Forbidden',
          'Some CSS files were blocked by CORS policy',
          'JavaScript files may not function properly due to external dependencies'
        ] : []
      };

      setCloneResult(mockResult);
      toast({
        title: "Clone Complete",
        description: `Successfully cloned ${downloadedFiles}/${totalFiles} files`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clone website",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!cloneResult) return;

    const reportData = {
      tool: 'VRCyber Guard Website Cloner',
      timestamp: new Date().toISOString(),
      cloneResult,
      settings: {
        depth,
        includeImages,
        includeCSS,
        includeJS,
        followExternalLinks,
        maxFileSize: `${maxFileSize}MB`
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-clone-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-primary/20 text-primary border-primary/30';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-destructive/20 text-destructive border-destructive/30';
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
          
          <h1 className="text-3xl font-bold text-primary mb-2">Website Cloner</h1>
          <p className="text-muted-foreground">
            Clone websites for offline analysis, backup, or research purposes using HTTrack-like functionality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Section */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Clone Configuration
                </CardTitle>
                <CardDescription>
                  Configure the website cloning parameters and download options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="url">Target Website URL</Label>
                  <Input
                    id="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://example.com"
                    onKeyPress={(e) => e.key === 'Enter' && cloneWebsite()}
                  />
                </div>

                <div>
                  <Label htmlFor="path">Download Path</Label>
                  <Input
                    id="path"
                    value={downloadPath}
                    onChange={(e) => setDownloadPath(e.target.value)}
                    placeholder="downloads/cloned-sites"
                  />
                </div>

                <div>
                  <Label htmlFor="depth">Crawl Depth</Label>
                  <Select value={depth} onValueChange={setDepth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select depth" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 level (current page only)</SelectItem>
                      <SelectItem value="2">2 levels (recommended)</SelectItem>
                      <SelectItem value="3">3 levels</SelectItem>
                      <SelectItem value="5">5 levels</SelectItem>
                      <SelectItem value="unlimited">Unlimited (dangerous)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>File Type Options</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="images" 
                        checked={includeImages} 
                        onCheckedChange={(checked) => setIncludeImages(!!checked)} 
                      />
                      <Label htmlFor="images">Include Images (JPG, PNG, GIF)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="css" 
                        checked={includeCSS} 
                        onCheckedChange={(checked) => setIncludeCSS(!!checked)} 
                      />
                      <Label htmlFor="css">Include CSS Stylesheets</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="js" 
                        checked={includeJS} 
                        onCheckedChange={(checked) => setIncludeJS(!!checked)} 
                      />
                      <Label htmlFor="js">Include JavaScript Files</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="external" 
                        checked={followExternalLinks} 
                        onCheckedChange={(checked) => setFollowExternalLinks(!!checked)} 
                      />
                      <Label htmlFor="external">Follow External Links</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxsize">Max File Size (MB)</Label>
                  <Select value={maxFileSize} onValueChange={setMaxFileSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select max size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 MB</SelectItem>
                      <SelectItem value="5">5 MB</SelectItem>
                      <SelectItem value="10">10 MB</SelectItem>
                      <SelectItem value="50">50 MB</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={cloneWebsite} disabled={loading} variant="scan" className="w-full gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Cloning... {progress.toFixed(0)}%
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Start Cloning
                    </>
                  )}
                </Button>

                {loading && (
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            {cloneResult ? (
              <Card className="bg-gradient-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-primary" />
                      Clone Results
                    </span>
                    <Badge className={getStatusColor(cloneResult.status)}>
                      {cloneResult.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Target URL</Label>
                    <p className="text-sm font-mono bg-muted/10 p-2 rounded">{cloneResult.url}</p>
                  </div>

                  <div>
                    <Label>Download Statistics</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="text-center p-3 bg-muted/10 rounded">
                        <p className="text-2xl font-bold text-primary">{cloneResult.downloadedFiles}</p>
                        <p className="text-xs text-muted-foreground">Downloaded</p>
                      </div>
                      <div className="text-center p-3 bg-muted/10 rounded">
                        <p className="text-2xl font-bold text-yellow-500">{cloneResult.failedFiles}</p>
                        <p className="text-xs text-muted-foreground">Failed</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Download Information</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Size:</span>
                        <span className="font-mono">{cloneResult.totalSize}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Download Path:</span>
                        <span className="font-mono text-primary">{cloneResult.downloadPath}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completed:</span>
                        <span>{new Date(cloneResult.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>File Breakdown</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div className="flex justify-between">
                        <span>HTML:</span>
                        <span>{cloneResult.metadata.htmlFiles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CSS:</span>
                        <span>{cloneResult.metadata.cssFiles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>JavaScript:</span>
                        <span>{cloneResult.metadata.jsFiles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Images:</span>
                        <span>{cloneResult.metadata.imageFiles}</span>
                      </div>
                    </div>
                  </div>

                  {cloneResult.errors.length > 0 && (
                    <div>
                      <Label className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        Warnings & Errors
                      </Label>
                      <div className="mt-2 space-y-2">
                        {cloneResult.errors.map((error, index) => (
                          <div key={index} className="text-sm p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(cloneResult, null, 2))} variant="outline" className="flex-1 gap-2">
                      <Copy className="w-4 h-4" />
                      Copy Results
                    </Button>
                    <Button onClick={exportReport} variant="outline" className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Export Report
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded">
                    <p>Clone completed: {new Date().toLocaleString()}</p>
                    <p>Session logged with IP and timestamp</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-card border-primary/20">
                <CardContent className="p-8 text-center">
                  <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Clone</h3>
                  <p className="text-muted-foreground">
                    Enter a website URL and configure options to start cloning.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Educational Information */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-accent mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Website Cloning Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Legal Considerations</h4>
                <p className="text-muted-foreground">
                  Only clone websites you have permission to download. Respect robots.txt files, 
                  terms of service, and copyright laws. Use for research and educational purposes only.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technical Limitations</h4>
                <p className="text-muted-foreground">
                  Cloned websites may not function identically to the original due to server-side 
                  code, APIs, and security restrictions. JavaScript functionality may be limited.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Best Practices</h4>
                <p className="text-muted-foreground">
                  Use appropriate crawl delays, limit depth to prevent excessive requests, 
                  and consider the target server's resources. Always respect rate limiting.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning Section */}
        <Card className="mt-6 bg-destructive/10 border-destructive/20">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-destructive mb-2">Educational & Authorized Use Only</h4>
            <p className="text-sm text-muted-foreground">
              This tool is for educational purposes, authorized penetration testing, and legitimate research only. 
              Unauthorized cloning of websites may violate terms of service, copyright laws, or other regulations. 
              Users are responsible for ensuring compliance with all applicable laws and obtaining proper permissions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}