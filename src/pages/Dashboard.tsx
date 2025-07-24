import { Shield, Scan, Lock, Eye, Globe, Mail, Network, Image, Key, Search, Fingerprint, AlertTriangle, Hash } from 'lucide-react';
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
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">VRCyber Guard</h1>
                <p className="text-sm text-muted-foreground">Your Cybersecurity Arsenal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span>Secure Connection</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Stay Safe Online
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access professional cybersecurity tools to protect yourself and understand digital threats. 
            All activities are logged with your IP and timestamp for transparency.
          </p>
        </div>

        {/* IP Display */}
        <div className="mb-8">
          <IPDisplay />
        </div>

        {/* Tools Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Network className="w-6 h-6 text-primary" />
            Security Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <ToolCard
                key={index}
                title={tool.title}
                description={tool.description}
                category={tool.category}
                icon={tool.icon}
                href={tool.href}
                riskLevel={tool.riskLevel}
                isNew={tool.isNew}
              />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-destructive mb-2">Educational & Research Purposes Only</h4>
          <p className="text-sm text-muted-foreground">
            These tools are designed for educational purposes, security research, and authorized testing only. 
            Users are responsible for ensuring compliance with all applicable laws and regulations. 
            Unauthorized use against systems you do not own is prohibited.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 VRCyber Guard. Built for cybersecurity education and awareness.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              All tool usage is logged with IP addresses and timestamps for security and transparency.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}