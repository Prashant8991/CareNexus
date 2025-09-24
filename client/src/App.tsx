import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";

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
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <Router />
          </div>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;