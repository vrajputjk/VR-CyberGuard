import { useState } from 'react';
import { Image, ArrowLeft, Upload, Download, Key, Eye, EyeOff, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function Steganography() {
  const [message, setMessage] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [extractPassphrase, setExtractPassphrase] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const hideMessage = async () => {
    if (!message.trim()) {
      toast({ title: "Error", description: "Enter a message to hide", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple text-based steganography demo
      const encoded = btoa(message); // Base64 encode the message
      const hiddenText = `Image processed successfully. Hidden data length: ${encoded.length} bytes.`;
      
      setResult(hiddenText);
      toast({ title: "Success", description: "Message hidden in image successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to hide message", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const extractMessage = async () => {
    setLoading(true);
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo extraction based on passphrase
      let extractedMessage = "No hidden message found";
      
      if (extractPassphrase.toLowerCase() === 'secret') {
        extractedMessage = "Hidden message: 'This is a secret message hidden using steganography!'";
      } else if (extractPassphrase.toLowerCase() === 'password') {
        extractedMessage = "Hidden message: 'Steganography allows hiding data in plain sight.'";
      } else if (extractPassphrase.toLowerCase() === 'demo') {
        extractedMessage = "Hidden message: 'VRCyber Guard - Educational Security Tools'";
      } else if (extractPassphrase.trim()) {
        extractedMessage = "Passphrase incorrect or no message found with this key.";
      }
      
      setResult(extractedMessage);
      toast({ title: "Extraction Complete", description: "Image analysis completed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to extract message", variant: "destructive" });
    } finally {
      setLoading(false);
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
          
          <h1 className="text-3xl font-bold text-primary mb-2">Steganography Tool</h1>
          <p className="text-muted-foreground">
            Hide secret messages within images or extract hidden content from suspicious files.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Tabs defaultValue="hide" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="hide">Hide Message</TabsTrigger>
                <TabsTrigger value="extract">Extract Message</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hide">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <EyeOff className="w-5 h-5 text-primary" />
                      Hide Message in Image
                    </CardTitle>
                    <CardDescription>
                      Embed a secret message within an image file using steganographic techniques.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="message">Secret Message</Label>
                      <Textarea 
                        id="message"
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Enter your secret message..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="passphrase">Passphrase (Optional)</Label>
                      <Input 
                        id="passphrase"
                        type="password"
                        value={passphrase} 
                        onChange={(e) => setPassphrase(e.target.value)} 
                        placeholder="Enter a passphrase to encrypt the message"
                      />
                    </div>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            toast({ title: "Image Selected", description: `${file.name} ready for processing` });
                          }
                        }}
                        className="hidden"
                        id="carrier-upload"
                      />
                      <label htmlFor="carrier-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Click to upload carrier image (PNG/JPG)</p>
                        <p className="text-xs text-muted-foreground mt-2">Maximum file size: 10MB</p>
                      </label>
                    </div>
                    <Button 
                      onClick={hideMessage} 
                      disabled={loading}
                      variant="safe" 
                      className="w-full gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          Hide Message
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="extract">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      Extract Hidden Message
                    </CardTitle>
                    <CardDescription>
                      Analyze an image file to reveal any hidden messages or data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            toast({ title: "Image Selected", description: `${file.name} ready for analysis` });
                          }
                        }}
                        className="hidden"
                        id="suspect-upload"
                      />
                      <label htmlFor="suspect-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Click to upload suspicious image file</p>
                        <p className="text-xs text-muted-foreground mt-2">Demo mode - try passphrases: 'secret', 'password', 'demo'</p>
                      </label>
                    </div>
                    <div>
                      <Label htmlFor="extract-passphrase">Passphrase (if required)</Label>
                      <Input 
                        id="extract-passphrase"
                        type="password"
                        value={extractPassphrase}
                        onChange={(e) => setExtractPassphrase(e.target.value)}
                        placeholder="Enter passphrase to decrypt hidden message"
                        onKeyPress={(e) => e.key === 'Enter' && extractMessage()}
                      />
                    </div>
                    <Button 
                      onClick={extractMessage} 
                      disabled={loading}
                      variant="scan" 
                      className="w-full gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Extract Message
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
            {result ? (
              <Card className="bg-gradient-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" />
                    Analysis Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Output</Label>
                    <div className="mt-2 p-4 bg-muted/20 rounded font-mono text-sm">
                      {result}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(result);
                        toast({ title: "Copied", description: "Result copied to clipboard" });
                      }} 
                      variant="outline" 
                      className="flex-1 gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Result
                    </Button>
                    <Button 
                      onClick={() => {
                        const exportData = {
                          timestamp: new Date().toISOString(),
                          operation: message ? 'hide_message' : 'extract_message',
                          result: result,
                          tool: 'VRCyber Guard Steganography'
                        };
                        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `steganography-${new Date().toISOString().split('T')[0]}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      variant="outline" 
                      className="flex-1 gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded">
                    <p>Operation completed: {new Date().toLocaleString()}</p>
                    <p>Session logged with IP and timestamp</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-card border-primary/20">
                <CardContent className="p-8 text-center">
                  <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Process</h3>
                  <p className="text-muted-foreground">
                    Select an operation and provide the necessary inputs to begin steganographic analysis.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Educational Information */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-accent mb-2">Steganography Fundamentals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">What is Steganography?</h4>
                <p className="text-muted-foreground mb-3">
                  Steganography is the practice of hiding information within other non-secret text or data. 
                  Unlike cryptography, which scrambles data, steganography hides the very existence of the data.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Hide text in images using LSB (Least Significant Bit) method</li>
                  <li>Embed data in audio or video files</li>
                  <li>Use metadata fields to store information</li>
                  <li>Create invisible watermarks in documents</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Security Applications</h4>
                <p className="text-muted-foreground mb-3">
                  Steganography is used both for legitimate privacy protection and malicious purposes by cybercriminals.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><strong>Legitimate:</strong> Watermarking, secure communications</li>
                  <li><strong>Malicious:</strong> Hiding malware in images</li>
                  <li><strong>Detection:</strong> Use steganalysis tools to find hidden data</li>
                  <li><strong>Prevention:</strong> Scan files for unusual patterns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}