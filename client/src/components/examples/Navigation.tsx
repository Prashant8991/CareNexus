import { Navigation } from '../Navigation';
import { ThemeProvider } from '../ThemeProvider';

export default function NavigationExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Navigation Example</h2>
          <p className="text-muted-foreground">
            This shows the navigation bar with all menu items. Try clicking different items and toggling the theme.
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}