import { Navbar } from "@/components/Navbar";
import { VideoAdsSection } from "@/components/VideoAdsSection";
import { Footer } from "@/components/Footer";

const VideoAds = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <VideoAdsSection />
      </div>
      <Footer />
    </main>
  );
};

export default VideoAds;
