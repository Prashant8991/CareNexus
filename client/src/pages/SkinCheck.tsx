import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';
import { 
  Camera, 
  CheckCircle, 
  Clock,
  Shield,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface AnalysisResult {
  condition: string;
  confidence: number;
  tips: string[];
  source?: {
    provider: string;
    model: string;
    url?: string;
  }
  isTestModel?: boolean;
  raw?: Array<{ label: string; score: number }>;
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
    
    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);

      const resp = await fetch('/api/skin/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || 'Analysis failed');
      }

      const result = await resp.json() as AnalysisResult;
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      // Set a fallback result in case of error
      setAnalysisResult({
        condition: "analysis failed",
        confidence: 0,
        tips: ["Please try uploading a clearer image", "Ensure good lighting"]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartNewAnalysis = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
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
                <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span>Analysis Results</span>
                    </CardTitle>
                    <CardDescription>
                      AI-powered skin health assessment completed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Condition */}
                    <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/10">
                      <h3 className="text-2xl font-bold text-foreground mb-2 capitalize">
                        {analysisResult.condition}
                      </h3>
                      <p className="text-sm text-muted-foreground">Detected condition</p>
                    </div>

                    {/* Confidence */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Confidence Level</span>
                        <span className="text-lg font-bold text-primary">
                          {Math.round(analysisResult.confidence * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={analysisResult.confidence * 100} 
                        className="h-3 bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Higher confidence indicates more accurate analysis
                      </p>
                    </div>

                    {/* Tips */}
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-chart-2" />
                        <span>Recommended Actions</span>
                      </h4>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <ul className="space-y-3">
                          {analysisResult.tips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 rounded-full bg-chart-2 mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-foreground capitalize">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Source */}
                    {analysisResult.source && (
                      <div className="text-xs text-muted-foreground">
                        Source: {analysisResult.source.provider} · {analysisResult.source.model}{' '}
                        {analysisResult.source.url && (
                          <a className="underline" href={analysisResult.source.url} target="_blank" rel="noreferrer">model card</a>
                        )}
                      </div>
                    )}

                  {/* Diagnostic note if a placeholder model is used */}
                  {analysisResult.isTestModel && (
                    <div className="text-xs text-amber-600">
                      Note: Using a placeholder test model. Configure HF_MODEL_ID to a dermatology model (e.g. HAM10000/ISIC) for meaningful predictions.
                    </div>
                  )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleStartNewAnalysis}
                    className="flex-1 group hover:scale-105 transition-all duration-200"
                    data-testid="button-start-new-analysis"
                  >
                    <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                    Start New Analysis
                  </Button>
                  <Button 
                    onClick={() => console.log('Save result')}
                    className="flex-1 group hover:scale-105 transition-all duration-200"
                    data-testid="button-save-result"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
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