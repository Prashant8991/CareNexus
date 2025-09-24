import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { EmergencyButton } from '@/components/EmergencyButton';
import { FirstAidAssistant } from '@/components/FirstAidAssistant';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Search, 
  Heart, 
  AlertTriangle,
  Phone,
  Clock,
  CheckCircle,
  ArrowRight,
  Thermometer,
  Zap,
  Shield,
  Play,
  Pause
} from 'lucide-react';

interface FirstAidGuide {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  steps: string[];
  emergencyCall: boolean;
  icon: any;
}

interface FirstAidResponse {
  answerText: string;
  followUps: string[];
  severityScore: number;
  audioUrl?: string;
}

// TODO: Replace with real first aid data from medical database
const firstAidGuides: FirstAidGuide[] = [
  {
    id: 'cpr',
    title: 'CPR (Cardiopulmonary Resuscitation)',
    description: 'Life-saving technique for cardiac arrest',
    severity: 'high',
    emergencyCall: true,
    icon: Heart,
    steps: [
      'Call 101 immediately',
      'Place person on firm, flat surface',
      'Tilt head back, lift chin',
      'Place heel of hand on center of chest',
      'Push hard and fast at least 2 inches deep',
      'Allow complete chest recoil between compressions',
      'Compress at rate of 100-120 per minute',
      'Continue until emergency services arrive'
    ]
  },
  {
    id: 'choking',
    title: 'Choking',
    description: 'When airway is blocked by foreign object',
    severity: 'high',
    emergencyCall: true,
    icon: AlertTriangle,
    steps: [
      'Ask "Are you choking?" if they can speak',
      'Call 101 if they cannot speak or breathe',
      'Stand behind person, wrap arms around waist',
      'Make fist with one hand above navel',
      'Grasp fist with other hand',
      'Give quick upward thrusts',
      'Continue until object comes out',
      'If person becomes unconscious, start CPR'
    ]
  },
  {
    id: 'burn',
    title: 'Minor Burns',
    description: 'Treatment for first and second-degree burns',
    severity: 'medium',
    emergencyCall: false,
    icon: Thermometer,
    steps: [
      'Remove from heat source immediately',
      'Cool burn with cool (not cold) water for 10-15 minutes',
      'Remove tight items before swelling starts',
      'Do not break blisters if they form',
      'Apply moisturizer or aloe vera gel',
      'Cover with sterile gauze loosely',
      'Take over-the-counter pain medication',
      'Seek medical care if burn is larger than 3 inches'
    ]
  },
  {
    id: 'cut',
    title: 'Cuts and Scrapes',
    description: 'Basic wound care for minor injuries',
    severity: 'low',
    emergencyCall: false,
    icon: Shield,
    steps: [
      'Clean your hands with soap and water',
      'Stop the bleeding by applying pressure',
      'Clean the wound with clean water',
      'Apply antibiotic ointment if available',
      'Cover with sterile bandage or adhesive bandage',
      'Change dressing daily and keep wound clean',
      'Watch for signs of infection (redness, swelling, pus)',
      'Seek medical care if wound is deep or won\'t stop bleeding'
    ]
  }
];

export default function FirstAid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<FirstAidResponse | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const [selectedGuide, setSelectedGuide] = useState<FirstAidGuide | null>(null);

  const filteredGuides = firstAidGuides.filter(guide =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-chart-2 text-white';
      case 'medium': return 'bg-chart-3 text-white';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (selectedGuide) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedGuide(null)}
              data-testid="button-back-to-guides"
            >
              ← Back to Guides
            </Button>
            {selectedGuide.emergencyCall && <EmergencyButton />}
          </div>

          {/* Emergency Alert */}
          {selectedGuide.emergencyCall && (
            <Card className="mb-8 border-destructive bg-destructive/10">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-destructive" />
                  <div>
                    <h3 className="font-bold text-destructive text-lg">CALL 101 IMMEDIATELY</h3>
                    <p className="text-destructive/80">
                      This is a life-threatening emergency. Call emergency services before following these steps.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Guide Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${selectedGuide.severity === 'high' ? 'bg-destructive' : 'bg-primary'}`}>
                  <selectedGuide.icon className={`w-6 h-6 ${selectedGuide.severity === 'high' ? 'text-destructive-foreground' : 'text-primary-foreground'}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{selectedGuide.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {selectedGuide.description}
                  </CardDescription>
                </div>
                <Badge className={getSeverityColor(selectedGuide.severity)}>
                  {selectedGuide.severity.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Step-by-Step Instructions
              </h3>
              
              <div className="space-y-4">
                {selectedGuide.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary-foreground">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{step}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-chart-3/10 border border-chart-3/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-chart-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-chart-3 mb-1">Important Reminder</h4>
                    <p className="text-sm text-muted-foreground">
                      These instructions are for emergency situations only. Always seek professional medical help when needed. 
                      If you're unsure about the severity of an injury or illness, contact emergency services or a healthcare provider.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AI First Aid Assistant */}
        <FirstAidAssistant />

        {/* AI First Aid Assistant */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>AI First Aid Assistant</CardTitle>
              <CardDescription>Get instant, personalized first aid guidance powered by AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Describe the emergency situation... e.g., 'Someone is choking on food' or 'Deep cut on finger, bleeding heavily'"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  disabled={loadingAI}
                  className="min-h-[100px]"
                  data-testid="textarea-first-aid-scenario"
                />
                
                <Button
                  onClick={async () => {
                    if (!aiQuestion.trim()) {
                      toast({ title: "Please describe the scenario", variant: "destructive" });
                      return;
                    }
                    
                    setLoadingAI(true);
                    try {
                      const response = await fetch('/api/first-aid', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ scenario: aiQuestion.trim(), language: 'english' })
                      });
                      const data = await response.json();
                      setAiAnswer(data);
                    } catch (error) {
                      toast({ title: "Error getting first aid guidance", description: "Please try again", variant: "destructive" });
                    } finally {
                      setLoadingAI(false);
                    }
                  }}
                  disabled={loadingAI}
                  className="w-full"
                  data-testid="button-get-first-aid-guidance"
                >
                  {loadingAI ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Getting Guidance...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Get First Aid Guidance
                    </>
                  )}
                </Button>
              </div>
              
              {aiAnswer && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">First Aid Instructions</h3>
                    <div className="flex items-center space-x-2">
                      {aiAnswer.severityScore && (
                        <Badge className={aiAnswer.severityScore > 7 ? 'bg-destructive' : aiAnswer.severityScore > 4 ? 'bg-chart-3' : 'bg-chart-2'}>
                          Severity: {aiAnswer.severityScore}/10
                        </Badge>
                      )}
                      {aiAnswer.audioUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (isPlaying) {
                              audio?.pause();
                              setIsPlaying(false);
                            } else {
                              const newAudio = new Audio(aiAnswer.audioUrl!);
                              newAudio.onended = () => setIsPlaying(false);
                              newAudio.play();
                              setAudio(newAudio);
                              setIsPlaying(true);
                            }
                          }}
                          data-testid="button-play-audio"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                          {isPlaying ? 'Pause' : 'Play'} Audio
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="whitespace-pre-wrap text-sm">{aiAnswer.answerText}</div>
                  </div>
                  
                  {aiAnswer.followUps && aiAnswer.followUps.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Follow-up Questions:</h4>
                      <div className="space-y-1">
                        {aiAnswer.followUps.map((question, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => setAiQuestion(question)}
                            className="h-auto text-left justify-start p-2 text-sm text-muted-foreground hover:text-foreground"
                            data-testid={`button-followup-${index}`}
                          >
                            • {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAiAnswer(null);
                        setAiQuestion('');
                      }}
                      data-testid="button-clear-guidance"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            First Aid Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Step-by-step emergency response instructions for common medical situations. 
            Always call emergency services for life-threatening conditions.
          </p>
        </div>

        {/* Emergency Action */}
        <div className="flex justify-center mb-12">
          <EmergencyButton size="lg" />
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search first aid guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-guides"
            />
          </div>
        </div>

        {/* First Aid Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Card 
              key={guide.id} 
              className="cursor-pointer hover-elevate transition-all duration-200"
              onClick={() => setSelectedGuide(guide)}
              data-testid={`card-guide-${guide.id}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-md ${guide.severity === 'high' ? 'bg-destructive' : 'bg-primary'}`}>
                    <guide.icon className={`w-5 h-5 ${guide.severity === 'high' ? 'text-destructive-foreground' : 'text-primary-foreground'}`} />
                  </div>
                  <Badge className={getSeverityColor(guide.severity)}>
                    {guide.severity.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{guide.steps.length} steps</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                
                {guide.emergencyCall && (
                  <div className="mt-3 flex items-center space-x-2 text-sm text-destructive">
                    <Phone className="w-4 h-4" />
                    <span>Call 101 first</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No guides found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}

        {/* Important Notice */}
        <Card className="mt-12 border-chart-3 bg-chart-3/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-chart-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Medical Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  This first aid information is provided for educational purposes only and should not replace professional medical training. 
                  In case of a medical emergency, always call your local emergency number immediately. Consider taking a certified first aid course 
                  for proper hands-on training.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}