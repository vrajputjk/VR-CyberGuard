import { Shield, Scan, Lock, Eye, Globe, Mail, Network, Image, Key, Search, Fingerprint, AlertTriangle, Hash, Download, FolderOpen, Bug } from 'lucide-react';
import { IPDisplay } from '@/components/IPDisplay';
import { ToolCard } from '@/components/ToolCard';

const tools = [
  {
    title: "What's My IP",
    description: "Discover your public IP address, location, ISP, and browser information for security awareness.",
    category: 'utilities' as const,
    icon: Globe,
    href: '/ip-lookup',
    riskLevel: 'low' as const
  },
  {
    title: "Phishing Detector",
    description: "Analyze URLs, text content, and files to identify potential phishing attempts and malicious content.",
    category: 'awareness' as const,
    icon: Shield,
    href: '/phishing-detector',
    riskLevel: 'medium' as const
  },
  {
    title: "Network Scanner", 
    description: "Perform basic and advanced network scans to discover open ports, services, and potential vulnerabilities.",
    category: 'scanning' as const,
    icon: Scan,
    href: '/network-scanner',
    riskLevel: 'high' as const
  },
  {
    title: "Encryption Tools",
    description: "Encrypt and decrypt text or files using various algorithms including AES, RSA, and Base64 encoding.",
    category: 'encryption' as const,
    icon: Lock,
    href: '/encryption',
    riskLevel: 'low' as const
  },
  {
    title: "Steganography",
    description: "Hide secret messages within images or extract hidden content from suspicious image files.",
    category: 'encryption' as const,
    icon: Image,
    href: '/steganography',
    riskLevel: 'medium' as const,
    isNew: true
  },
  {
    title: "Email Security",
    description: "Analyze email headers, check SPF/DKIM/DMARC records, and detect phishing attempts in emails.",
    category: 'awareness' as const,
    icon: Mail,
    href: '/email-security',
    riskLevel: 'medium' as const
  },
  {
    title: "DNS Lookup",
    description: "Query DNS records, perform reverse lookups, and analyze domain information for security assessment.",
    category: 'utilities' as const,
    icon: Search,
    href: '/dns-lookup',
    riskLevel: 'low' as const
  },
  {
    title: "Breach Checker",
    description: "Check if email addresses have been compromised in known data breaches and security incidents.",
    category: 'awareness' as const,
    icon: AlertTriangle,
    href: '/breach-checker',
    riskLevel: 'medium' as const
  },
  {
    title: "Link Obfuscator",
    description: "Educational tool to demonstrate URL manipulation techniques used in phishing attacks.",
    category: 'awareness' as const,
    icon: Eye,
    href: '/link-obfuscator',
    riskLevel: 'high' as const
  },
  {
    title: "Hasher - Integrity Checker",
    description: "Generate MD5 hashes for text verification or decode hashes using rainbow table lookups.",
    category: 'utilities' as const,
    icon: Hash,
    href: '/hasher',
    riskLevel: 'low' as const,
    isNew: true
  },
  {
    title: "Dirb",
    description: "Discover hidden directories and files on web servers using dictionary-based attacks.",
    category: 'recon' as const,
    icon: FolderOpen,
    href: '/dirb',
    riskLevel: 'medium' as const,
    isNew: true
  },
  {
    title: "Nikto Scanner",
    description: "Advanced web vulnerability scanner for comprehensive security assessment and penetration testing.",
    category: 'scanning' as const,
    icon: Bug,
    href: '/nikto',
    riskLevel: 'high' as const,
    isNew: true
  }
];

export default function Dashboard() {
  const featuredTools = tools.filter(tool => tool.isNew || ['scanning', 'awareness'].includes(tool.category));
  const popularTools = tools.filter(tool => ['utilities', 'encryption'].includes(tool.category)).slice(0, 4);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-sm">
                <Shield className="w-16 h-16 text-primary animate-cyber-pulse" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6 animate-fade-in cyber-text">
            VRCyber Guard
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in delay-200">
            Advanced cybersecurity arsenal for ethical hackers and security professionals
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in delay-300">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Your IP:</span>
              <IPDisplay />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">{tools.length} Security Tools</span>
            </div>
          </div>
        </div>

        {/* Featured Tools Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4 animate-fade-in">
              Featured Security Tools
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
            {featuredTools.map((tool, index) => (
              <div key={index} className="animate-fade-in hover-glow" style={{ animationDelay: `${index * 100}ms` }}>
                <ToolCard {...tool} />
              </div>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-primary mb-8 animate-fade-in">
            Explore by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative p-8 bg-gradient-card border border-border rounded-xl hover:border-primary/40 transition-all duration-500 hover:shadow-cyber hover-scale animate-fade-in">
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Search className="w-16 h-16 text-primary" />
              </div>
              <Search className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Information Gathering</h3>
              <p className="text-muted-foreground mb-4">
                Reconnaissance and data collection tools for security assessment
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <span className="font-medium">{tools.filter(tool => ['utilities', 'awareness', 'recon'].includes(tool.category)).length} tools</span>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="group relative p-8 bg-gradient-card border border-border rounded-xl hover:border-accent/40 transition-all duration-500 hover:shadow-glow-accent hover-scale animate-fade-in delay-100">
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Scan className="w-16 h-16 text-accent" />
              </div>
              <Scan className="w-10 h-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">Vulnerability Assessment</h3>
              <p className="text-muted-foreground mb-4">
                Advanced scanning and penetration testing capabilities
              </p>
              <div className="flex items-center gap-2 text-sm text-accent">
                <span className="font-medium">{tools.filter(tool => tool.category === 'scanning').length} tools</span>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="group relative p-8 bg-gradient-card border border-border rounded-xl hover:border-destructive/40 transition-all duration-500 hover:shadow-glow-destructive hover-scale animate-fade-in delay-200">
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Lock className="w-16 h-16 text-destructive" />
              </div>
              <Lock className="w-10 h-10 text-destructive mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 group-hover:text-destructive transition-colors">Security & Cryptography</h3>
              <p className="text-muted-foreground mb-4">
                Encryption, steganography, and secure communication tools
              </p>
              <div className="flex items-center gap-2 text-sm text-destructive">
                <span className="font-medium">{tools.filter(tool => tool.category === 'encryption').length} tools</span>
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Tools */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-primary mb-8 animate-fade-in">
            Popular Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.map((tool, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <ToolCard {...tool} />
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Disclaimer */}
        <div className="relative overflow-hidden bg-gradient-to-r from-destructive/5 via-yellow-500/5 to-destructive/5 border border-destructive/20 rounded-2xl p-8 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-destructive/5 to-transparent animate-pulse"></div>
          <div className="relative flex items-start gap-6">
            <div className="p-3 bg-destructive/10 rounded-full border border-destructive/20">
              <AlertTriangle className="w-8 h-8 text-destructive animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-destructive mb-3">Ethical Use Only</h3>
              <p className="text-muted-foreground mb-4 max-w-3xl">
                These tools are designed for educational purposes, authorized penetration testing, and security research. 
                Always ensure proper authorization before testing any systems.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Only test systems you own</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Follow responsible disclosure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Respect system availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Educational use priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}