import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Clock,
  Shield
} from 'lucide-react';

interface AnalysisResult {
  condition: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  shouldConsultDoctor: boolean;
}

export default function SkinCheck() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedFile(file);
    setAnalysisResult(null);
  };

  const handleImageRemove = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    
    // TODO: Replace with real AI analysis API call
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis result
    const mockResult: AnalysisResult = {
      condition: 'Normal Skin Condition',
      confidence: 85,
      riskLevel: 'low',
      recommendations: [
        'Continue regular skin monitoring',
        'Use SPF 30+ sunscreen daily',
        'Maintain good hydration',
        'Consider monthly self-examinations'
      ],
      shouldConsultDoctor: false
    };
    
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-chart-2 text-white';
      case 'medium': return 'bg-chart-3 text-white';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return CheckCircle;
      case 'medium': return Info;
      case 'high': return AlertTriangle;
      default: return Info;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            AI Skin Analysis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a clear photo of your skin concern for instant AI-powered analysis. 
            Our advanced algorithms can help identify potential skin conditions.
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-chart-3 bg-chart-3/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-chart-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Important Medical Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  This AI analysis is for informational purposes only and should not replace professional medical advice. 
                  Always consult with a healthcare professional for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Skin Photo</CardTitle>
                <CardDescription>
                  Take a clear, well-lit photo of the area of concern. Ensure good lighting and focus.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload 
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  maxSizeInMB={5}
                  acceptedFormats={['image/jpeg', 'image/png']}
                />
                
                {uploadedFile && !analysisResult && (
                  <div className="mt-6">
                    <Button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full"
                      size="lg"
                      data-testid="button-analyze-skin"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Analyze Skin
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">AI Analysis in Progress</span>
                    </div>
                    <Progress value={66} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Processing image with advanced machine learning algorithms...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysisResult && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Analysis Results
                      <Badge className={getRiskColor(analysisResult.riskLevel)}>
                        {analysisResult.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{analysisResult.condition}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence Level</span>
                          <span className="font-medium">{analysisResult.confidence}%</span>
                        </div>
                        <Progress value={analysisResult.confidence} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {analysisResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {analysisResult.shouldConsultDoctor && (
                      <Card className="border-chart-3 bg-chart-3/10">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-chart-3" />
                            <span className="font-semibold text-sm">Medical Consultation Recommended</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Based on the analysis, we recommend consulting with a dermatologist for professional evaluation.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setUploadedFile(null);
                      setAnalysisResult(null);
                    }}
                    className="flex-1"
                    data-testid="button-new-analysis"
                  >
                    New Analysis
                  </Button>
                  <Button 
                    onClick={() => console.log('Save result')}
                    className="flex-1"
                    data-testid="button-save-result"
                  >
                    Save Result
                  </Button>
                </div>
              </>
            )}
            
            {!uploadedFile && !analysisResult && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Ready for Analysis</h3>
                  <p className="text-muted-foreground">
                    Upload a photo to get started with AI-powered skin analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tips */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Photo Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold">Good Lighting</h4>
                <p className="text-sm text-muted-foreground">Use natural daylight or bright indoor lighting</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold">Clear Focus</h4>
                <p className="text-sm text-muted-foreground">Ensure the area is in sharp focus and well-defined</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold">Close-up View</h4>
                <p className="text-sm text-muted-foreground">Take the photo close enough to see details clearly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}