import { EmergencyButton } from '../EmergencyButton';

export default function EmergencyButtonExample() {
  return (
    <div className="p-6 space-y-6 bg-background">
      <h2 className="text-2xl font-semibold mb-4">Emergency Button Examples</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Different Sizes</h3>
          <div className="flex flex-wrap gap-4">
            <EmergencyButton size="sm" />
            <EmergencyButton size="default" />
            <EmergencyButton size="lg" />
          </div>
        </div>
        
        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            Click any button to see the emergency confirmation dialog. 
            This component would integrate with Twilio for real emergency calls.
          </p>
        </div>
      </div>
    </div>
  );
}