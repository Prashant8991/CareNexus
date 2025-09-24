import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Card>
          <CardContent className="p-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl font-bold text-muted-foreground">?</span>
            </div>
            
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Page Not Found
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="space-y-4">
              <Link href="/">
                <Button size="lg" className="w-full" data-testid="button-go-home">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => window.history.back()}
                className="w-full"
                data-testid="button-go-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}