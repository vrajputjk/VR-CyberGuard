import { useState } from 'react';
import { Image, ArrowLeft, Upload, Download, Key, Eye, EyeOff } from 'lucide-react';
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
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const hideMessage = () => {
    if (!message.trim()) {
      toast({ title: "Error", description: "Enter a message to hide", variant: "destructive" });
      return;
    }
    setResult(`Message "${message}" hidden in image (demo)`);
    toast({ title: "Success", description: "Message hidden successfully" });
  };

  const extractMessage = () => {
    setResult("Hidden message: Hello World! (demo extraction)");
    toast({ title: "Success", description: "Message extracted successfully" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Link to="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Arsenal
          </Button>
        </Link>
        
        <h1 className="text-3xl font-bold text-primary mb-2">Steganography Tool</h1>
        <p className="text-muted-foreground mb-8">
          Hide secret messages within images or extract hidden content from suspicious files.
        </p>

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
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Secret Message</Label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your secret message..." />
                </div>
                <div>
                  <Label>Passphrase</Label>
                  <Input value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder="Optional passphrase" />
                </div>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p>Upload image file (Coming soon)</p>
                </div>
                <Button onClick={hideMessage} variant="safe" className="w-full gap-2">
                  <Key className="w-4 h-4" />
                  Hide Message
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p>Upload image to analyze (Coming soon)</p>
                </div>
                <Button onClick={extractMessage} variant="scan" className="w-full gap-2">
                  <Eye className="w-4 h-4" />
                  Extract Message
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {result && (
          <Card className="mt-6 bg-gradient-card border-primary/20">
            <CardHeader><CardTitle>Result</CardTitle></CardHeader>
            <CardContent>
              <p className="font-mono">{result}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}