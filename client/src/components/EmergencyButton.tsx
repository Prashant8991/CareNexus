import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EmergencyButtonProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function EmergencyButton({ size = 'default', className = '' }: EmergencyButtonProps) {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const handleEmergencyCall = () => {
    setIsEmergencyActive(true);
    console.log('Emergency services contacted');
    // TODO: Integrate with Twilio for real emergency calls
    setTimeout(() => setIsEmergencyActive(false), 3000);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size={size}
          className={`relative overflow-hidden ${className}`}
          data-testid="button-emergency-sos"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Emergency SOS
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-destructive">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Emergency Assistance
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            This will immediately contact emergency services and notify your emergency contacts.
            <br /><br />
            <strong>Only use in real emergencies.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel data-testid="button-emergency-cancel">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleEmergencyCall}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            data-testid="button-emergency-confirm"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Emergency Services
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}