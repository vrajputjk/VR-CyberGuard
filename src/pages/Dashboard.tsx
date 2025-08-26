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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Cybersecurity Arsenal</h1>
              <p className="text-muted-foreground">
                Professional-grade security tools for penetration testing and security research.
              </p>
            </div>
            <IPDisplay />
          </div>
        </div>

        {/* Tool Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Information Gathering */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary border-b border-primary/20 pb-2">
              Information Gathering
            </h2>
            <div className="space-y-4">
              {tools.filter(tool => ['utilities', 'awareness', 'recon'].includes(tool.category)).map((tool, index) => (
                <ToolCard key={index} {...tool} />
              ))}
            </div>
          </div>

          {/* Vulnerability Assessment */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary border-b border-primary/20 pb-2">
              Vulnerability Assessment
            </h2>
            <div className="space-y-4">
              {tools.filter(tool => tool.category === 'scanning').map((tool, index) => (
                <ToolCard key={index} {...tool} />
              ))}
            </div>
          </div>

          {/* Security Analysis */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary border-b border-primary/20 pb-2">
              Security & Cryptography
            </h2>
            <div className="space-y-4">
              {tools.filter(tool => tool.category === 'encryption').map((tool, index) => (
                <ToolCard key={index} {...tool} />
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gradient-to-r from-destructive/10 to-yellow-500/10 border border-destructive/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-destructive flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-destructive mb-2">Important Disclaimer</h3>
              <p className="text-sm text-muted-foreground mb-4">
                These tools are designed for educational purposes, authorized penetration testing, and security research only. 
                Users are responsible for ensuring they have proper authorization before testing any systems they do not own.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Only use on systems you own or have explicit written permission to test</li>
                <li>• Unauthorized access to computer systems is illegal in most jurisdictions</li>
                <li>• Always follow responsible disclosure practices for any vulnerabilities found</li>
                <li>• Consider the impact of your testing on system availability and performance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2024 VRCyber Guard. Educational use only. Activity logged for security purposes.</p>
        </footer>
      </div>
    </div>
  );
}