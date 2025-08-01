import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'cyber' | 'pulse';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const variantClasses = {
    default: 'border-2 border-current border-t-transparent rounded-full animate-spin',
    cyber: 'border-2 border-primary border-t-transparent rounded-full animate-spin shadow-glow-primary',
    pulse: 'bg-primary rounded-full animate-pulse'
  };

  return (
    <div 
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}