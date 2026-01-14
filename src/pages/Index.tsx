import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { VideoAdsSection } from "@/components/VideoAdsSection";
import { SupportSection } from "@/components/SupportSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <VideoAdsSection />
      <SupportSection />
      <Footer />
    </main>
  );
};

export default Index;
