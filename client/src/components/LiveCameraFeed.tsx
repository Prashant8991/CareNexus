import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  CameraOff,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Video,
  FlipHorizontal
} from 'lucide-react';

interface LiveAnalysisResult {
  condition: string;
  confidence: number;
  timestamp: number;
  tips: string[];
}

interface LiveCameraFeedProps {
  className?: string;
}

export function LiveCameraFeed({ className = '' }: LiveCameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<LiveAnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<LiveAnalysisResult[]>([]);
  const [isAutoAnalyzing, setIsAutoAnalyzing] = useState(false);
  // Always use front camera only
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start camera stream
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' // Always use front camera
        }
      });
      
      if (videoRef.current) {
        console.log('Setting MediaStream to video element. Stream active:', mediaStream.active);
        console.log('Stream tracks:', mediaStream.getTracks().map(t => t.kind + ':' + t.readyState));
        
        videoRef.current.srcObject = mediaStream;
        // Add event listeners to debug video loading
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
        };
        videoRef.current.oncanplay = () => {
          console.log('Video can start playing');
        };
        videoRef.current.onerror = (e) => {
          console.error('Video element error:', e);
        };
        videoRef.current.onloadstart = () => {
          console.log('Video load started');
        };
        
        // Ensure the video plays
        videoRef.current.play().catch(err => {
          console.error('Video play failed:', err);
        });
      }
      
      setStream(mediaStream);
      setIsStreaming(true);
    } catch (err: any) {
      setError('Camera access denied or not available. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsStreaming(false);
    setIsAutoAnalyzing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };


  // Capture frame from video and analyze
  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob for analysis
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const formData = new FormData();
        formData.append('image', blob, 'camera-frame.jpg');
        
        try {
          const response = await fetch('/api/skin/analyze', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error('Analysis failed');
          }
          
          const result = await response.json();
          const analysisResult: LiveAnalysisResult = {
            condition: result.condition,
            confidence: result.confidence,
            timestamp: Date.now(),
            tips: result.tips || []
          };
          
          setCurrentResult(analysisResult);
          setAnalysisHistory(prev => [analysisResult, ...prev.slice(0, 9)]); // Keep last 10 results
          
        } catch (err) {
          console.error('Analysis error:', err);
          setError('Analysis failed. Please try again.');
        }
      }, 'image/jpeg', 0.8);
      
    } catch (err) {
      console.error('Capture error:', err);
      setError('Failed to capture frame. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing]);

  // Toggle auto analysis
  const toggleAutoAnalysis = () => {
    if (isAutoAnalyzing) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsAutoAnalyzing(false);
    } else {
      // Start auto analysis every 3 seconds
      intervalRef.current = setInterval(captureAndAnalyze, 3000);
      setIsAutoAnalyzing(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-chart-2';
    if (confidence > 0.6) return 'text-chart-3';
    return 'text-chart-1';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-primary" />
            <span>Live Skin Analysis</span>
          </CardTitle>
          <CardDescription>
            Real-time skin condition detection using your camera
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Stream */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9', minHeight: '300px', backgroundColor: '#000' }}>
            {isStreaming ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  controls={false}
                  width="640"
                  height="480"
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    backgroundColor: 'transparent',
                    zIndex: 1
                  }}
                  data-testid="video-camera-feed"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium">Analyzing...</span>
                    </div>
                  </div>
                )}
                {currentResult && (
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 max-w-xs">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold">Live Detection</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold capitalize">{currentResult.condition}</div>
                      <div className={`text-sm font-medium ${getConfidenceColor(currentResult.confidence)}`}>
                        {Math.round(currentResult.confidence * 100)}% confidence
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <Camera className="w-16 h-16 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Camera Not Active</h3>
                <p className="text-sm text-center">Click "Start Camera" to begin live analysis</p>
              </div>
            )}
          </div>

          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            {!isStreaming ? (
              <Button 
                onClick={startCamera}
                className="flex-1 min-w-0"
                data-testid="button-start-camera"
              >
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            ) : (
              <>
                <Button 
                  onClick={stopCamera}
                  variant="outline"
                  className="flex-1 min-w-0"
                  data-testid="button-stop-camera"
                >
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
                <Button 
                  onClick={captureAndAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 min-w-0"
                  data-testid="button-analyze-frame"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Now
                </Button>
                <Button 
                  onClick={toggleAutoAnalysis}
                  variant={isAutoAnalyzing ? "destructive" : "secondary"}
                  className="flex-1 min-w-0"
                  data-testid="button-toggle-auto-analysis"
                >
                  {isAutoAnalyzing ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Stop Auto
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Auto Analysis
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-start space-x-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-destructive font-medium">Error</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Analysis Result */}
      {currentResult && (
        <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-chart-2" />
                <span>Current Analysis</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {new Date(currentResult.timestamp).toLocaleTimeString()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <h3 className="text-xl font-bold capitalize text-foreground mb-1">
                  {currentResult.condition}
                </h3>
                <p className="text-sm text-muted-foreground">Detected Condition</p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <h3 className={`text-xl font-bold mb-1 ${getConfidenceColor(currentResult.confidence)}`}>
                  {Math.round(currentResult.confidence * 100)}%
                </h3>
                <p className="text-sm text-muted-foreground">Confidence</p>
              </div>
            </div>
            
            {currentResult.tips.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Recommendations:</h4>
                <div className="bg-muted/50 rounded-lg p-3">
                  <ul className="space-y-1">
                    {currentResult.tips.map((tip, index) => (
                      <li key={index} className="text-sm flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-2 flex-shrink-0"></div>
                        <span className="capitalize">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>Recent detections from your live session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analysisHistory.map((result, index) => (
                <div key={result.timestamp} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium capitalize">{result.condition}</div>
                    <Badge variant="outline" className={getConfidenceColor(result.confidence)}>
                      {Math.round(result.confidence * 100)}%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}