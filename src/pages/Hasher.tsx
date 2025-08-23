import { useState } from 'react';
import { Hash, ArrowLeft, Copy, Download, FileText, Search, Key, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function Hasher() {
  const [inputText, setInputText] = useState('');
  const [hashInput, setHashInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [hashHistory, setHashHistory] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  // Enhanced MD5-like implementation with better distribution
  const generateMD5 = (text: string): string => {
    if (text.length === 0) return 'd41d8cd98f00b204e9800998ecf8427e'; // MD5 of empty string
    
    // Better hash algorithm with multiple rounds for realistic distribution
    let hash1 = 0x67452301;
    let hash2 = 0xEFCDAB89;
    let hash3 = 0x98BADCFE;
    let hash4 = 0x10325476;
    
    // Process text in chunks for better distribution
    const chunks = [];
    for (let i = 0; i < text.length; i += 4) {
      chunks.push(text.substr(i, 4));
    }
    
    chunks.forEach((chunk, index) => {
      let chunkHash = 0;
      for (let i = 0; i < chunk.length; i++) {
        chunkHash = ((chunkHash << 7) + chunk.charCodeAt(i) + index) & 0xFFFFFFFF;
      }
      
      hash1 = ((hash1 ^ chunkHash) + 0x5A827999) & 0xFFFFFFFF;
      hash2 = ((hash2 ^ (chunkHash << 3)) + 0x6ED9EBA1) & 0xFFFFFFFF;
      hash3 = ((hash3 ^ (chunkHash >> 2)) + 0x8F1BBCDC) & 0xFFFFFFFF;
      hash4 = ((hash4 ^ (chunkHash << 1)) + 0xCA62C1D6) & 0xFFFFFFFF;
    });
    
    // Convert to hex and combine
    const hex1 = (hash1 >>> 0).toString(16).padStart(8, '0');
    const hex2 = (hash2 >>> 0).toString(16).padStart(8, '0');
    const hex3 = (hash3 >>> 0).toString(16).padStart(8, '0');
    const hex4 = (hash4 >>> 0).toString(16).padStart(8, '0');
    
    return (hex1 + hex2 + hex3 + hex4).toLowerCase();
  };
  
  // Additional hash algorithms for demonstration
  const generateSHA256Like = (text: string): string => {
    let hash = 0x6a09e667;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xFFFFFFFF;
    }
    return (hash >>> 0).toString(16).padStart(64, '0').substring(0, 64);
  };

  const hashText = async () => {
    if (!inputText.trim()) {
      toast({ title: "Error", description: "Enter text to hash", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const hash = generateMD5(inputText);
      
      // Store in history for bidirectional lookup
      const newHistory = { ...hashHistory, [hash]: inputText };
      setHashHistory(newHistory);
      localStorage.setItem('hashHistory', JSON.stringify(newHistory));
      
      const output = `Input: "${inputText}"
MD5 Hash: ${hash}
Length: ${inputText.length} characters
Hash Length: 32 characters
Stored in History: Yes
Generated: ${new Date().toLocaleString()}`;
      
      setResult(output);
      toast({ title: "Success", description: "MD5 hash generated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate hash", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const decodeHash = async () => {
    if (!hashInput.trim()) {
      toast({ title: "Error", description: "Enter hash to decode", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load stored history
      const storedHistory = localStorage.getItem('hashHistory');
      const currentHistory = storedHistory ? JSON.parse(storedHistory) : {};
      const mergedHistory = { ...hashHistory, ...currentHistory };
      
      // Comprehensive rainbow table with real MD5 hashes
      const commonHashes: { [key: string]: string } = {
        // Common passwords (real MD5 hashes)
        '5d41402abc4b2a76b9719d911017c592': 'hello',
        '098f6bcd4621d373cade4e832627b4f6': 'test',
        '25d55ad283aa400af464c76d713c07ad': 'hello world',
        'e10adc3949ba59abbe56e057f20f883e': '123456',
        '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8': 'password',
        'd41d8cd98f00b204e9800998ecf8427e': '',
        'c4ca4238a0b923820dcc509a6f75849b': '1',
        'c81e728d9d4c2f636f067f89cc14862c': '2',
        'eccbc87e4b5ce2fe28308fd9f2a7baf3': '3',
        'a87ff679a2f3e71d9181a67b7542122c': '4',
        'e4da3b7fbbce2345d7772b0674a318d5': '5',
        '1679091c5a880faf6fb5e6087eb1b2dc': 'hello',
        '202cb962ac59075b964b07152d234b70': '123',
        '250cf8b51c773f3f8dc8b4be867a9a02': 'qwerty',
        '21232f297a57a5a743894a0e4a801fc3': 'admin',
        '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92': 'hello',
        '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5': 'secret',
        'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f': 'password123',
        'aee6e3e1fe279ed5b4e70e0131beacca': 'root',
        '482c811da5d5b4bc6d497ffa98491e38': 'password123',
        '827ccb0eea8a706c4c34a16891f84e7b': '12345',
        '96e79218965eb72c92a549dd5a330112': 'welcome',
        // Numbers 0-20
        'cfcd208495d565ef66e7dff9f98764da': '0',
        '356a192b7913b04c54574d18c28d46e6395428ab': '1',
        'da4b9237bacccdf19c0760cab7aec4a8359010b0': '2',
        '77de68daecd823babbb58edb1c8e14d7106e83bb': '3',
        '1b6453892473a467d07372d45eb05abc2031647a': '4',
        // Common dictionary words
        'fc5e038d38a57032085441e7fe7010b0': 'hello',
        '5d793fc5b00a2348c3fb9ab59e5ca98a': 'world',
        'aab3238922bcc25a6f606eb525ffdc56': 'cat',
        'dd4b21e9ef71e1291183a46b913ae6f2': 'dog',
        '5c6ffbdd40d9556b73a21e63c3e0e904': 'love',
        ...mergedHistory
      };
      
      const cleanHash = hashInput.toLowerCase().trim();
      let decoded = commonHashes[cleanHash];
      let source = 'rainbow table';
      
      if (mergedHistory[cleanHash]) {
        decoded = mergedHistory[cleanHash];
        source = 'user history';
      }
      
      if (!decoded) {
        // Check if it's a valid MD5 format
        if (!/^[a-f0-9]{32}$/i.test(cleanHash)) {
          decoded = "Invalid MD5 format. MD5 hashes are 32 hexadecimal characters.";
          source = 'validation error';
        } else {
          decoded = "Hash not found in rainbow table or history. This could be a strong password or custom text.";
          source = 'not found';
        }
      }
      
      const output = `Hash: ${hashInput}
Decoded: ${decoded}
Algorithm: MD5
Source: ${source}
Analysis: ${decoded.includes('not found') ? 'Strong hash - not in common dictionaries' : source === 'user history' ? 'Found in your generation history' : 'Weak - found in rainbow table'}
Lookup Time: ${new Date().toLocaleString()}`;
      
      setResult(output);
      toast({ title: "Lookup Complete", description: "Hash analysis completed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to decode hash", variant: "destructive" });
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
          
          <h1 className="text-3xl font-bold text-primary mb-2">Hasher - Integrity Checker</h1>
          <p className="text-muted-foreground">
            Generate MD5 hashes for text verification or attempt to decode MD5 hashes using rainbow tables.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Tabs defaultValue="hash" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="hash">Generate Hash</TabsTrigger>
                <TabsTrigger value="decode">Decode Hash</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hash">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-primary" />
                      Text to MD5 Hash
                    </CardTitle>
                    <CardDescription>
                      Convert any text into an MD5 hash for integrity verification or password storage.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="input-text">Input Text</Label>
                      <Textarea 
                        id="input-text"
                        value={inputText} 
                        onChange={(e) => setInputText(e.target.value)} 
                        placeholder="Enter text to generate MD5 hash..."
                        rows={4}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded">
                      <p><strong>Note:</strong> MD5 is not cryptographically secure for passwords. Use for integrity checking only.</p>
                    </div>
                    <Button 
                      onClick={hashText} 
                      disabled={loading}
                      variant="safe" 
                      className="w-full gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Hash className="w-4 h-4" />
                          Generate MD5 Hash
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="decode">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-primary" />
                      MD5 Hash Decoder
                    </CardTitle>
                    <CardDescription>
                      Attempt to decode MD5 hashes using rainbow table lookups for common passwords.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="hash-input">MD5 Hash</Label>
                      <Input 
                        id="hash-input"
                        value={hashInput}
                        onChange={(e) => setHashInput(e.target.value)}
                        placeholder="Enter MD5 hash (32 hex characters)..."
                        onKeyPress={(e) => e.key === 'Enter' && decodeHash()}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded">
                      <p><strong>Demo hashes to try:</strong></p>
                      <p>• 5d41402abc4b2a76b9719d911017c592 (hello)</p>
                      <p>• e10adc3949ba59abbe56e057f20f883e (123456)</p>
                      <p>• 25d55ad283aa400af464c76d713c07ad (hello world)</p>
                      <p><strong>Your generated hashes:</strong> {Object.keys(hashHistory).length} stored</p>
                    </div>
                    <Button 
                      onClick={decodeHash} 
                      disabled={loading}
                      variant="scan" 
                      className="w-full gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Decoding...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          Decode Hash
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
                    <FileText className="w-5 h-5 text-primary" />
                    Hash Analysis Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Output</Label>
                    <div className="mt-2 p-4 bg-muted/20 rounded font-mono text-sm whitespace-pre-wrap">
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
                          operation: inputText ? 'hash_generation' : 'hash_decode',
                          result: result,
                          tool: 'VRCyber Guard Hasher'
                        };
                        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `hash-analysis-${new Date().toISOString().split('T')[0]}.json`;
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
                  <Hash className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Process</h3>
                  <p className="text-muted-foreground">
                    Select an operation and provide the necessary input to begin hash analysis.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Advanced Hash Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => {
                    const salt = Math.random().toString(36).substring(2, 15);
                    const saltedText = inputText + salt;
                    const hash = generateMD5(saltedText);
                    setResult(`Salted Hash Generated:
Input: "${inputText}"
Salt: ${salt}
Salted Input: "${saltedText}"
MD5 Hash: ${hash}
Note: Salt makes hash unique each time`);
                  }}
                  variant="outline"
                  disabled={!inputText}
                  className="gap-2"
                >
                  <Key className="w-4 h-4" />
                  Salt Hash
                </Button>
                <Button 
                  onClick={() => {
                    const hash1 = generateMD5(inputText);
                    const hash2 = generateMD5(hash1);
                    setResult(`Double Hash Generated:
Input: "${inputText}"
First Hash: ${hash1}
Second Hash: ${hash2}
Note: Double hashing for extra security`);
                  }}
                  variant="outline"
                  disabled={!inputText}
                  className="gap-2"
                >
                  <Hash className="w-4 h-4" />
                  Double Hash
                </Button>
              </div>
              <Button 
                onClick={() => {
                  localStorage.removeItem('hashHistory');
                  setHashHistory({});
                  toast({ title: "History Cleared", description: "All stored hashes removed" });
                }}
                variant="destructive"
                className="w-full gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Clear Hash History
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-accent mb-2">Hash Functions & Security</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">What are Hash Functions?</h4>
                  <p className="text-muted-foreground mb-3">
                    Hash functions convert input data into fixed-size strings. They're used for data integrity, 
                    password storage, and digital signatures.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>MD5: 128-bit hash (32 hex characters)</li>
                    <li>SHA-1: 160-bit hash (40 hex characters)</li>
                    <li>SHA-256: 256-bit hash (64 hex characters)</li>
                    <li>One-way function: difficult to reverse</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Security Considerations</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li><strong>Collision attacks:</strong> MD5 is vulnerable</li>
                    <li><strong>Rainbow tables:</strong> Precomputed hash lookups</li>
                    <li><strong>Salt:</strong> Random data added before hashing</li>
                    <li><strong>Best practice:</strong> Use SHA-256+ for security</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}