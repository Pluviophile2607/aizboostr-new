import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ServicePage from "./pages/ServicePage";
import NotFound from "./pages/NotFound";
import IntroVideo from "./components/IntroVideo";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(() => {
    return sessionStorage.getItem("introPlayed") === "true";
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("introPlayed", "true");
    setHasPlayedIntro(true);
  };

  if (showIntro && !hasPlayedIntro) {
    return <IntroVideo onComplete={handleIntroComplete} />;
  }

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/service/:slug" element={<ServicePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
