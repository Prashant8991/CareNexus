import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { HealthCard } from '@/components/HealthCard';
import { EmergencyButton } from '@/components/EmergencyButton';
import { 
  Camera, 
  Heart, 
  MapPin, 
  BarChart3,
  Shield,
  Zap,
  Users
} from 'lucide-react';
import heroImage from '@assets/generated_images/Healthcare_professional_with_technology_b3362704.png';
import healthAppImage from '@assets/generated_images/Health_app_interface_mockup_90adedde.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                  Your AI-Powered
                  <span className="block text-chart-2">Health Companion</span>
                </h1>
                <p className="text-xl text-primary-foreground/90 mt-6 leading-relaxed">
                  Get instant skin analysis, first aid guidance, find nearby hospitals, 
                  and access emergency services - all powered by artificial intelligence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/skin-check">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="w-full sm:w-auto bg-white text-primary hover:bg-white/90"
                    data-testid="button-get-started"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Skin Check
                  </Button>
                </Link>
                <EmergencyButton size="lg" />
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Healthcare professional using digital technology"
                className="rounded-lg shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Complete Health Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need for proactive health monitoring and emergency preparedness in one intelligent platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <HealthCard
              title="AI Skin Analysis"
              description="Upload photos for instant AI-powered skin health assessment"
              icon={Camera}
              actionLabel="Start Analysis"
              onAction={() => console.log('Navigate to skin check')}
            />
            
            <HealthCard
              title="First Aid Guide"
              description="Step-by-step emergency response instructions"
              icon={Heart}
              actionLabel="View Guide"
              onAction={() => console.log('Navigate to first aid')}
            />
            
            <HealthCard
              title="Hospital Finder"
              description="Locate nearby medical facilities instantly"
              icon={MapPin}
              actionLabel="Find Hospitals"
              onAction={() => console.log('Navigate to hospitals')}
            />
            
            <HealthCard
              title="Health Dashboard"
              description="Track your health metrics and history"
              icon={BarChart3}
              actionLabel="View Dashboard"
              onAction={() => console.log('Navigate to dashboard')}
            />
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Medical Grade Security</h3>
              <p className="text-muted-foreground">
                HIPAA-compliant data protection with end-to-end encryption for your health information.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-chart-3 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Instant AI Analysis</h3>
              <p className="text-muted-foreground">
                Get immediate health insights powered by advanced machine learning algorithms.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Trusted by Thousands</h3>
              <p className="text-muted-foreground">
                Join our community of health-conscious individuals taking control of their wellbeing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Health Monitoring Made Simple
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Track your health journey with intuitive tools designed for everyone. 
                  From skin health monitoring to emergency preparedness, we've got you covered.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-chart-2 mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Smart Health Tracking</h4>
                    <p className="text-muted-foreground">Monitor vital signs and symptoms with AI assistance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-chart-3 mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Emergency Ready</h4>
                    <p className="text-muted-foreground">One-tap access to emergency services and contacts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Personalized Insights</h4>
                    <p className="text-muted-foreground">Get tailored health recommendations based on your data</p>
                  </div>
                </div>
              </div>
              
              <Link href="/dashboard">
                <Button size="lg" data-testid="button-explore-features">
                  Explore All Features
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <img 
                src={healthAppImage} 
                alt="AI Health Companion app interface"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}