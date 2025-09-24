import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, X, Check } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload?: (file: File) => void;
  onImageRemove?: () => void;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

export function ImageUpload({ 
  onImageUpload,
  onImageRemove,
  maxSizeInMB = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}: ImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setError(`Please upload a valid image file (${acceptedFormats.map(f => f.split('/')[1]).join(', ')})`);
      setIsUploading(false);
      return;
    }

    // Validate file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeInMB}MB`);
      setIsUploading(false);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setIsUploading(false);
      onImageUpload?.(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setError(null);
    onImageRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        data-testid="input-file-upload"
      />

      {!uploadedImage ? (
        <Card className="border-dashed border-2 border-muted hover-elevate transition-colors cursor-pointer" onClick={triggerFileSelect}>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click to select or drag and drop your image here
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} 
              • Max size: {maxSizeInMB}MB
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative">
              <img 
                src={uploadedImage} 
                alt="Uploaded" 
                className="w-full h-64 object-cover rounded-md"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleRemoveImage}
                  data-testid="button-remove-image"
                  className="bg-background/80 backdrop-blur-sm hover:bg-background"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2">
                <div className="bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 flex items-center space-x-1">
                  <Check className="w-3 h-3 text-chart-2" />
                  <span className="text-xs font-medium">Image uploaded</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
          {error}
        </div>
      )}

      {!uploadedImage && (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={triggerFileSelect}
            disabled={isUploading}
            data-testid="button-choose-file"
            className="flex-1"
          >
            <Camera className="w-4 h-4 mr-2" />
            Choose File
          </Button>
        </div>
      )}
    </div>
  );
}