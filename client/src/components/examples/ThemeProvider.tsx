import { ThemeProvider } from '../ThemeProvider';
import { Button } from '@/components/ui/button';
import { useTheme } from '../ThemeProvider';

function ThemeToggleExample() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Theme: {theme}</h3>
      <Button onClick={toggleTheme}>
        Toggle to {theme === 'light' ? 'dark' : 'light'} mode
      </Button>
      <div className="p-4 bg-card border rounded-md">
        <p className="text-card-foreground">This content adapts to the theme</p>
      </div>
    </div>
  );
}

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <ThemeToggleExample />
    </ThemeProvider>
  );
}