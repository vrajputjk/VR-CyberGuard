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
  const featuredTools = tools.filter(tool => tool.isNew || ['scanning', 'awareness'].includes(tool.category)).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cyber opacity-50"></div>
        <div className="relative container mx-auto px-6 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 animate-fade-in">
            VRCyber Guard
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Professional cybersecurity arsenal for ethical hacking and security research
          </p>
          <div className="flex justify-center">
            <IPDisplay />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Featured Tools */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">Security Tools</h2>
          <p className="text-muted-foreground mb-8">
            Choose from our collection of penetration testing and security analysis tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {featuredTools.map((tool, index) => (
            <ToolCard key={index} {...tool} />
          ))}
        </div>

        {/* All Tools Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 border border-border rounded-lg hover:border-primary/40 transition-colors">
            <Search className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Information Gathering</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {tools.filter(tool => ['utilities', 'awareness', 'recon'].includes(tool.category)).length} tools
            </p>
            <p className="text-xs text-muted-foreground">
              IP lookup, DNS analysis, breach checking
            </p>
          </div>

          <div className="text-center p-6 border border-border rounded-lg hover:border-primary/40 transition-colors">
            <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Vulnerability Assessment</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {tools.filter(tool => tool.category === 'scanning').length} tools
            </p>
            <p className="text-xs text-muted-foreground">
              Network scanning, web vulnerability testing
            </p>
          </div>

          <div className="text-center p-6 border border-border rounded-lg hover:border-primary/40 transition-colors">
            <Lock className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Security & Cryptography</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {tools.filter(tool => tool.category === 'encryption').length} tools
            </p>
            <p className="text-xs text-muted-foreground">
              Encryption, steganography, hashing
            </p>
          </div>
        </div>

        {/* Compact Disclaimer */}
        <div className="bg-card border border-destructive/20 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-sm font-medium text-destructive">Educational Use Only</span>
          </div>
          <p className="text-xs text-muted-foreground">
            These tools are for authorized testing and security research. Always ensure proper permission before use.
          </p>
        </div>
      </div>
    </div>
  );
}