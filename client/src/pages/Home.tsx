import { Link, useLocation } from 'wouter';
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
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import heroImage from '@assets/generated_images/Healthcare_professional_with_technology_b3362704.png';
import healthAppImage from '@assets/generated_images/Health_app_interface_mockup_90adedde.png';

export default function Home() {
  const [, navigate] = useLocation();

  // Navigation handlers for HealthCard components
  const handleNavigateToSkinCheck = () => navigate('/skin-check');
  const handleNavigateToFirstAid = () => navigate('/first-aid');
  const handleNavigateToHospitals = () => navigate('/hospitals');
  const handleNavigateToDashboard = () => navigate('/dashboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-chart-2 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-chart-3 rounded-full animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center space-x-2 text-primary-foreground/80">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-wide">AI-POWERED HEALTHCARE</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                  Your AI-Powered
                  <span className="block text-chart-2 drop-shadow-sm">Health Companion</span>
                </h1>
                <p className="text-lg sm:text-xl text-primary-foreground/90 leading-relaxed max-w-2xl">
                  Get instant skin analysis, first aid guidance, find nearby hospitals, 
                  and access emergency services - all powered by artificial intelligence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/skin-check">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group"
                    data-testid="button-get-started"
                  >
                    <Camera className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Start Skin Check
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <EmergencyButton size="lg" />
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-chart-2/20 to-chart-3/20 rounded-lg transform rotate-6"></div>
              <img 
                src={heroImage} 
                alt="Healthcare professional using digital technology"
                className="relative rounded-lg shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center space-x-2 text-primary mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide uppercase">HEALTH FEATURES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Complete Health Management
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need for proactive health monitoring and emergency preparedness in one intelligent platform.
            </p>
          </div>
          
          {/* Enhanced responsive grid with staggered animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="transform hover:scale-105 transition-all duration-300 hover:z-10" style={{animationDelay: '0ms'}}>
              <HealthCard
                title="AI Skin Analysis"
                description="Upload photos for instant AI-powered skin health assessment"
                icon={Camera}
                actionLabel="Start Analysis"
                onAction={handleNavigateToSkinCheck}
              />
            </div>
            
            <div className="transform hover:scale-105 transition-all duration-300 hover:z-10" style={{animationDelay: '100ms'}}>
              <HealthCard
                title="First Aid Guide"
                description="Step-by-step emergency response instructions"
                icon={Heart}
                actionLabel="View Guide"
                onAction={handleNavigateToFirstAid}
              />
            </div>
            
            <div className="transform hover:scale-105 transition-all duration-300 hover:z-10" style={{animationDelay: '200ms'}}>
              <HealthCard
                title="Hospital Finder"
                description="Locate nearby medical facilities instantly"
                icon={MapPin}
                actionLabel="Find Hospitals"
                onAction={handleNavigateToHospitals}
              />
            </div>
            
            <div className="transform hover:scale-105 transition-all duration-300 hover:z-10" style={{animationDelay: '300ms'}}>
              <HealthCard
                title="Health Dashboard"
                description="Track your health metrics and history"
                icon={BarChart3}
                actionLabel="View Dashboard"
                onAction={handleNavigateToDashboard}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 sm:py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center space-y-4 group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow group-hover:animate-pulse">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">Medical Grade Security</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                HIPAA-compliant data protection with end-to-end encryption for your health information.
              </p>
            </div>
            
            <div className="text-center space-y-4 group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-chart-3 rounded-full flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow group-hover:animate-pulse">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">Instant AI Analysis</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Get immediate health insights powered by advanced machine learning algorithms.
              </p>
            </div>
            
            <div className="text-center space-y-4 group hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow group-hover:animate-pulse">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">Trusted by Thousands</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Join our community of health-conscious individuals taking control of their wellbeing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center space-x-2 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-wide uppercase">FEATURES</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
                  Health Monitoring Made Simple
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Track your health journey with intuitive tools designed for everyone. 
                  From skin health monitoring to emergency preparedness, we've got you covered.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group hover:translate-x-2 transition-transform duration-200">
                  <div className="w-2 h-2 rounded-full bg-chart-2 mt-2 group-hover:animate-pulse"></div>
                  <div>
                    <h4 className="font-semibold">Smart Health Tracking</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">Monitor vital signs and symptoms with AI assistance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group hover:translate-x-2 transition-transform duration-200">
                  <div className="w-2 h-2 rounded-full bg-chart-3 mt-2 group-hover:animate-pulse"></div>
                  <div>
                    <h4 className="font-semibold">Emergency Ready</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">One-tap access to emergency services and contacts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group hover:translate-x-2 transition-transform duration-200">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 group-hover:animate-pulse"></div>
                  <div>
                    <h4 className="font-semibold">Personalized Insights</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">Get tailored health recommendations based on your data</p>
                  </div>
                </div>
              </div>
              
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="group hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  data-testid="button-explore-features"
                >
                  Explore All Features
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-chart-2/10 rounded-lg transform -rotate-6"></div>
              <img 
                src={healthAppImage} 
                alt="AI Health Companion app interface"
                className="relative rounded-lg shadow-xl w-full h-auto transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}