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
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary">VRCyber Guard</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
            Professional cybersecurity arsenal for ethical hacking and security research
          </p>
          <div className="flex justify-center">
            <IPDisplay />
          </div>
        </div>

        {/* All Tools Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">Security Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-card border border-destructive/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-destructive mb-2">Educational Use Only</h3>
              <p className="text-sm text-muted-foreground mb-3">
                These tools are for authorized testing and security research. Always ensure proper permission before use.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <span>Only test systems you own</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <span>Follow responsible disclosure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}