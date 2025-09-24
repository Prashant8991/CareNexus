import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface HealthCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status?: 'normal' | 'warning' | 'emergency';
  actionLabel?: string;
  onAction?: () => void;
  isEmergency?: boolean;
  children?: React.ReactNode;
}

const statusColors = {
  normal: 'bg-chart-2 text-white',
  warning: 'bg-chart-3 text-white', 
  emergency: 'bg-destructive text-destructive-foreground'
};

export function HealthCard({ 
  title, 
  description, 
  icon: Icon, 
  status = 'normal',
  actionLabel,
  onAction,
  isEmergency = false,
  children 
}: HealthCardProps) {
  return (
    <Card className={`transition-all duration-200 hover-elevate ${isEmergency ? 'border-destructive' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-md ${isEmergency ? 'bg-destructive' : 'bg-primary'}`}>
            <Icon className={`w-5 h-5 ${isEmergency ? 'text-destructive-foreground' : 'text-primary-foreground'}`} />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {description}
            </CardDescription>
          </div>
        </div>
        {status && (
          <Badge className={statusColors[status]} variant="secondary">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )}
      </CardHeader>
      
      {children && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
      
      {actionLabel && onAction && (
        <CardContent className="pt-0">
          <Button 
            onClick={onAction}
            variant={isEmergency ? "destructive" : "default"}
            size="sm"
            className="w-full"
            data-testid={`button-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {actionLabel}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}