import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";

import { AcademySection } from "@/components/AcademySection";
import { SaaSSection } from "@/components/SaaSSection";
import { SystemsSection } from "@/components/SystemsSection";
import { VideoAdsSection } from "@/components/VideoAdsSection";

import { SupportSection } from "@/components/SupportSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      
      <AcademySection />
      <SaaSSection />
      <SystemsSection />
      <VideoAdsSection />
      
      <SupportSection />
      <Footer />
    </main>
  );
};

export default Index;
