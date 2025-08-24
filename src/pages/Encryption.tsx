import { useState } from 'react';
import { Lock, Unlock, ArrowLeft, Copy, Download, Key, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function Encryption() {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState('');
  const [method, setMethod] = useState('base64');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const encryptText = () => {
    if (!plaintext.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to encrypt",
        variant: "destructive",
      });
      return;
    }

    try {
      let encrypted = '';
      
      switch (method) {
        case 'base64':
          encrypted = btoa(unescape(encodeURIComponent(plaintext)));
          break;
        case 'caesar':
          const shift = parseInt(key) || 3;
          encrypted = plaintext.split('').map(char => {
            if (char.match(/[a-z]/i)) {
              const code = char.charCodeAt(0);
              const base = code >= 65 && code <= 90 ? 65 : 97;
              return String.fromCharCode(((code - base + shift) % 26) + base);
            }
            return char;
          }).join('');
          break;
        case 'vigenere':
          const keyStr = key.toUpperCase() || 'KEY';
          let keyIndex = 0;
          encrypted = plaintext.split('').map(char => {
            if (char.match(/[a-z]/i)) {
              const code = char.charCodeAt(0);
              const base = code >= 65 && code <= 90 ? 65 : 97;
              const keyShift = keyStr.charCodeAt(keyIndex % keyStr.length) - 65;
              keyIndex++;
              return String.fromCharCode(((code - base + keyShift) % 26) + base);
            }
            return char;
          }).join('');
          break;
        case 'atbash':
          encrypted = plaintext.split('').map(char => {
            if (char.match(/[a-z]/i)) {
              const code = char.charCodeAt(0);
              const base = code >= 65 && code <= 90 ? 65 : 97;
              return String.fromCharCode((25 - (code - base)) + base);
            }
            return char;
          }).join('');
          break;
        case 'reverse':
          encrypted = plaintext.split('').reverse().join('');
          break;
        case 'hex':
          encrypted = Array.from(new TextEncoder().encode(plaintext))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
          break;
        case 'rot13':
          encrypted = plaintext.replace(/[a-zA-Z]/g, char => {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
          });
          break;
        case 'rot47':
          encrypted = plaintext.replace(/[!-~]/g, char => {
            return String.fromCharCode(33 + ((char.charCodeAt(0) - 33 + 47) % 94));
          });
          break;
        case 'binary':
          encrypted = Array.from(new TextEncoder().encode(plaintext))
            .map(byte => byte.toString(2).padStart(8, '0'))
            .join(' ');
          break;
        case 'morse':
          const morseCode: { [key: string]: string } = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
            'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
            'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
            '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/'
          };
          encrypted = plaintext.toUpperCase().split('').map(char => morseCode[char] || char).join(' ');
          break;
        default:
          throw new Error('Unknown encryption method');
      }
      
      setResult(encrypted);
      toast({
        title: "Success",
        description: "Text encrypted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Encryption failed",
        variant: "destructive",
      });
    }
  };

  const decryptText = () => {
    if (!ciphertext.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to decrypt",
        variant: "destructive",
      });
      return;
    }

    try {
      let decrypted = '';
      
      switch (method) {
        case 'base64':
          decrypted = decodeURIComponent(escape(atob(ciphertext)));
          break;
        case 'caesar':
          const shift = parseInt(key) || 3;
          decrypted = ciphertext.split('').map(char => {
            if (char.match(/[a-z]/i)) {
              const code = char.charCodeAt(0);
              const base = code >= 65 && code <= 90 ? 65 : 97;
              return String.fromCharCode(((code - base - shift + 26) % 26) + base);
            }
            return char;
          }).join('');
          break;
        case 'vigenere':
          const keyStr = key.toUpperCase() || 'KEY';
          let keyIndex = 0;
          decrypted = ciphertext.split('').map(char => {
            if (char.match(/[a-z]/i)) {
              const code = char.charCodeAt(0);
              const base = code >= 65 && code <= 90 ? 65 : 97;
              const keyShift = keyStr.charCodeAt(keyIndex % keyStr.length) - 65;
              keyIndex++;
              return String.fromCharCode(((code - base - keyShift + 26) % 26) + base);
            }
            return char;
          }).join('');
          break;
        case 'atbash':
          decrypted = ciphertext.split('').map(char => {
            if (char.match(/[a-z]/i)) {
              const code = char.charCodeAt(0);
              const base = code >= 65 && code <= 90 ? 65 : 97;
              return String.fromCharCode((25 - (code - base)) + base);
            }
            return char;
          }).join('');
          break;
        case 'reverse':
          decrypted = ciphertext.split('').reverse().join('');
          break;
        case 'hex':
          const hexBytes = ciphertext.match(/.{1,2}/g) || [];
          const bytes = hexBytes.map(hex => parseInt(hex, 16));
          decrypted = new TextDecoder().decode(new Uint8Array(bytes));
          break;
        case 'rot13':
          decrypted = ciphertext.replace(/[a-zA-Z]/g, char => {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
          });
          break;
        case 'rot47':
          decrypted = ciphertext.replace(/[!-~]/g, char => {
            return String.fromCharCode(33 + ((char.charCodeAt(0) - 33 - 47 + 94) % 94));
          });
          break;
        case 'binary':
          const binaryValues = ciphertext.split(' ').filter(bin => bin);
          const binaryBytes = binaryValues.map(bin => parseInt(bin, 2));
          decrypted = new TextDecoder().decode(new Uint8Array(binaryBytes));
          break;
        case 'morse':
          const morseToChar: { [key: string]: string } = {
            '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H',
            '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P',
            '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
            '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
            '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9', '/': ' '
          };
          decrypted = ciphertext.split(' ').map(morse => morseToChar[morse] || morse).join('');
          break;
        default:
          throw new Error('Unknown decryption method');
      }
      
      setResult(decrypted);
      toast({
        title: "Success",
        description: "Text decrypted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Decryption failed",
        variant: "destructive",
      });
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied",
      description: "Result copied to clipboard",
    });
  };

  const exportResult = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      method: method,
      key: key,
      result: result,
      operation: plaintext ? 'encryption' : 'decryption'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encryption-result-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateRandomKey = () => {
    if (method === 'caesar') {
      setKey((Math.floor(Math.random() * 25) + 1).toString());
    } else if (method === 'vigenere') {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randomKey = Array.from({ length: Math.floor(Math.random() * 8) + 5 }, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('');
      setKey(randomKey);
    } else {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      const randomKey = Array.from({ length: 16 }, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('');
      setKey(randomKey);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-primary mb-2">Encryption Tools</h1>
          <p className="text-muted-foreground">
            Encrypt and decrypt text using various algorithms for learning and security purposes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  Encryption Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="method">Encryption Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base64">Base64 Encoding</SelectItem>
                      <SelectItem value="caesar">Caesar Cipher</SelectItem>
                      <SelectItem value="vigenere">Vigenere Cipher</SelectItem>
                      <SelectItem value="atbash">Atbash Cipher</SelectItem>
                      <SelectItem value="reverse">Reverse Text</SelectItem>
                      <SelectItem value="hex">Hexadecimal</SelectItem>
                      <SelectItem value="rot13">ROT13 Cipher</SelectItem>
                      <SelectItem value="rot47">ROT47 Cipher</SelectItem>
                      <SelectItem value="binary">Binary Encoding</SelectItem>
                      <SelectItem value="morse">Morse Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(method === 'caesar' || method === 'vigenere') && (
                  <div>
                    <Label htmlFor="key">
                      {method === 'caesar' ? 'Shift Value' : method === 'vigenere' ? 'Key Word' : 'Encryption Key'}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder={method === 'caesar' ? '3' : method === 'vigenere' ? 'KEYWORD' : 'Enter key...'}
                        type={method === 'caesar' ? 'number' : 'text'}
                      />
                      <Button variant="outline" onClick={generateRandomKey}>
                        Random
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="encrypt" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
                <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
              </TabsList>
              
              <TabsContent value="encrypt">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      Encrypt Text
                    </CardTitle>
                    <CardDescription>
                      Enter the text you want to encrypt using the selected method.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="plaintext">Plain Text</Label>
                      <Textarea
                        id="plaintext"
                        value={plaintext}
                        onChange={(e) => setPlaintext(e.target.value)}
                        placeholder="Enter text to encrypt..."
                        rows={6}
                      />
                    </div>
                    <Button onClick={encryptText} variant="safe" className="w-full gap-2">
                      <Lock className="w-4 h-4" />
                      Encrypt Text
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="decrypt">
                <Card className="bg-gradient-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Unlock className="w-5 h-5 text-accent" />
                      Decrypt Text
                    </CardTitle>
                    <CardDescription>
                      Enter the encrypted text you want to decrypt.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="ciphertext">Encrypted Text</Label>
                      <Textarea
                        id="ciphertext"
                        value={ciphertext}
                        onChange={(e) => setCiphertext(e.target.value)}
                        placeholder="Enter encrypted text..."
                        rows={6}
                      />
                    </div>
                    <Button onClick={decryptText} variant="scan" className="w-full gap-2">
                      <Unlock className="w-4 h-4" />
                      Decrypt Text
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Result Section */}
          <div>
            <Card className="bg-gradient-card border-primary/20 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Output</Label>
                  <Textarea
                    value={result}
                    readOnly
                    placeholder="Result will appear here..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
                
                {result && (
                  <div className="flex gap-2">
                    <Button onClick={copyResult} variant="outline" className="flex-1 gap-2">
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button onClick={exportResult} variant="outline" className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                )}

                <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded">
                  <p className="font-semibold mb-1">Current Session:</p>
                  <p>Method: {method}</p>
                  <p>Time: {new Date().toLocaleString()}</p>
                  {key && <p>Key/Shift: {method === 'caesar' ? key : '***hidden***'}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Educational Note */}
        <Card className="mt-8 bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-accent mb-2">Educational Note</h3>
            <p className="text-sm text-muted-foreground">
              These are basic encryption methods for educational purposes. For real security needs, 
              use established cryptographic libraries with proper key management. Methods like Caesar cipher 
              and Base64 are easily reversible and should not be used for protecting sensitive data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}