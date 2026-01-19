import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompleteProfileModal } from "./components/CompleteProfileModal";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/context/CartContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ServicePage from "./pages/ServicePage";
import CustomPackages from "./pages/CustomPackages";
import VideoAds from "./pages/VideoAds";
import BusinessPlans from "./pages/BusinessPlans";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <CompleteProfileModal />
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/service/:slug" element={<ServicePage />} />
                <Route path="/custom-packages" element={<CustomPackages />} />
                <Route path="/video-ads" element={<VideoAds />} />
                <Route path="/video-ads" element={<VideoAds />} />
                <Route path="/business-plans" element={<BusinessPlans />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<AdminDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
