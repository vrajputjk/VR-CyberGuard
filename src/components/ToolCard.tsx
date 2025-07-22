import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolCardProps {
  title: string;
  description: string;
  category: 'scanning' | 'encryption' | 'awareness' | 'utilities';
  icon: LucideIcon;
  href: string;
  isNew?: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
}

const categoryColors = {
  scanning: 'bg-accent/20 text-accent border-accent/30',
  encryption: 'bg-primary/20 text-primary border-primary/30', 
  awareness: 'bg-destructive/20 text-destructive border-destructive/30',
  utilities: 'bg-secondary text-secondary-foreground border-secondary'
};

const riskColors = {
  low: 'bg-primary/20 text-primary border-primary/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-destructive/20 text-destructive border-destructive/30'
};

export const ToolCard = ({ 
  title, 
  description, 
  category, 
  icon: Icon, 
  href, 
  isNew = false,
  riskLevel = 'low'
}: ToolCardProps) => {
  return (
    <Card className="group bg-gradient-card border-border hover:border-primary/40 transition-all duration-300 hover:shadow-cyber">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={categoryColors[category]}>
                  {category}
                </Badge>
                {riskLevel && (
                  <Badge variant="outline" className={riskColors[riskLevel]}>
                    {riskLevel} risk
                  </Badge>
                )}
                {isNew && (
                  <Badge className="bg-primary text-primary-foreground animate-glow">
                    NEW
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </CardDescription>
        <Link to={href}>
          <Button variant="cyber" className="w-full group-hover:shadow-glow-primary">
            Launch Tool
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};