import { ImageUpload } from '../ImageUpload';

export default function ImageUploadExample() {
  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file.name, file.size);
  };

  const handleImageRemove = () => {
    console.log('Image removed');
  };

  return (
    <div className="p-6 space-y-6 bg-background">
      <h2 className="text-2xl font-semibold mb-4">Image Upload Examples</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Standard Upload</h3>
          <ImageUpload 
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Restricted Upload (2MB, JPEG only)</h3>
          <ImageUpload 
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            maxSizeInMB={2}
            acceptedFormats={['image/jpeg']}
          />
        </div>
      </div>
      
      <div className="p-4 bg-muted rounded-md">
        <p className="text-sm text-muted-foreground">
          Try uploading different image types and sizes to see validation in action.
          Check the console for upload events.
        </p>
      </div>
    </div>
  );
}