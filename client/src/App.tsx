import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Pages
import Home from "@/pages/Home";
import SkinCheck from "@/pages/SkinCheck";
import FirstAid from "@/pages/FirstAid";
import Hospitals from "@/pages/Hospitals";
import SOS from "@/pages/SOS";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/skin-check" component={SkinCheck} />
      <Route path="/first-aid" component={FirstAid} />
      <Route path="/hospitals" component={Hospitals} />
      <Route path="/sos" component={SOS} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
              {/* Global decorative background accents */}
              <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full bg-primary/15 blur-3xl" />
                <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-chart-2/20 blur-3xl" />
                <div className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-chart-3/10 blur-2xl" />
              </div>
              <Navigation />
              <Router />
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;