import { useState } from "react";
import { 
  Shield, 
  Search, 
  Lock, 
  Globe, 
  Wifi, 
  Mail, 
  Hash, 
  Link, 
  Image, 
  FolderSearch, 
  Bug,
  Home,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const toolCategories = [
  {
    title: "Information Gathering",
    icon: Search,
    tools: [
      { title: "IP Lookup", url: "/ip-lookup", icon: Globe },
      { title: "DNS Lookup", url: "/dns-lookup", icon: Wifi },
      { title: "Network Scanner", url: "/network-scanner", icon: Wifi }
    ]
  },
  {
    title: "Vulnerability Assessment", 
    icon: Shield,
    tools: [
      { title: "Nikto Scanner", url: "/nikto", icon: Bug },
      { title: "Dirb Scanner", url: "/dirb", icon: FolderSearch },
      { title: "Phishing Detector", url: "/phishing-detector", icon: Shield }
    ]
  },
  {
    title: "Security Analysis",
    icon: Mail,
    tools: [
      { title: "Email Security", url: "/email-security", icon: Mail },
      { title: "Breach Checker", url: "/breach-checker", icon: Shield },
      { title: "Link Obfuscator", url: "/link-obfuscator", icon: Link }
    ]
  },
  {
    title: "Cryptography & Steganography",
    icon: Lock,
    tools: [
      { title: "Encryption Tools", url: "/encryption", icon: Lock },
      { title: "Hash Generator", url: "/hasher", icon: Hash },
      { title: "Steganography", url: "/steganography", icon: Image }
    ]
  }
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupTitle: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupTitle)) {
      newExpanded.delete(groupTitle);
    } else {
      newExpanded.add(groupTitle);
    }
    setExpandedGroups(newExpanded);
  };

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/20 text-primary font-medium border-l-2 border-primary" : "hover:bg-muted/50";

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarContent className="p-2">
        {/* Dashboard Link */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/" className={getNavCls}>
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Tool Categories */}
        {toolCategories.map((category) => {
          const hasActiveTool = category.tools.some(tool => isActive(tool.url));
          const isExpanded = expandedGroups.has(category.title) || hasActiveTool;
          
          return (
            <SidebarGroup key={category.title}>
              <SidebarGroupLabel className="cursor-pointer hover:text-primary transition-colors">
                <Button
                  variant="ghost"
                  className="w-full justify-between h-auto p-2 text-xs font-medium"
                  onClick={() => toggleGroup(category.title)}
                >
                  <div className="flex items-center gap-2">
                    <category.icon className="h-3 w-3" />
                    <span>{category.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              </SidebarGroupLabel>

              {isExpanded && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {category.tools.map((tool) => (
                      <SidebarMenuItem key={tool.title}>
                        <SidebarMenuButton asChild>
                          <NavLink to={tool.url} className={getNavCls}>
                            <tool.icon className="h-4 w-4" />
                            <span>{tool.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}