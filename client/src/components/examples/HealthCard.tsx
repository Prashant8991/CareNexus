import { HealthCard } from '../HealthCard';
import { Camera, Heart, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function HealthCardExample() {
  return (
    <div className="p-6 space-y-6 bg-background">
      <h2 className="text-2xl font-semibold mb-4">Health Card Examples</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Normal Card */}
        <HealthCard
          title="Skin Check"
          description="AI-powered skin analysis"
          icon={Camera}
          status="normal"
          actionLabel="Start Analysis"
          onAction={() => console.log('Skin check started')}
        />
        
        {/* Warning Card */}
        <HealthCard
          title="Blood Pressure"
          description="Monitor your vital signs"
          icon={Heart}
          status="warning"
          actionLabel="View Details"
          onAction={() => console.log('Blood pressure details')}
        >
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Latest Reading</span>
              <span className="font-medium">128/82 mmHg</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
        </HealthCard>
        
        {/* Emergency Card */}
        <HealthCard
          title="Emergency SOS"
          description="Get immediate help"
          icon={AlertTriangle}
          status="emergency"
          actionLabel="Call Emergency"
          onAction={() => console.log('Emergency call initiated')}
          isEmergency={true}
        />
      </div>
    </div>
  );
}