import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { VideoAdsSection } from "@/components/VideoAdsSection";
import { SupportSection } from "@/components/SupportSection";
import { Footer } from "@/components/Footer";
import { BusinessPlansSection } from "@/components/BusinessPlansSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <VideoAdsSection />
      <BusinessPlansSection previewMode={true} />
      <SupportSection />
      <Footer />
    </main>
  );
};

export default Index;
