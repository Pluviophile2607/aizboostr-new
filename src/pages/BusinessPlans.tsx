import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessPlansSection } from "@/components/BusinessPlansSection";

export default function BusinessPlans() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <BusinessPlansSection />
      </main>

      <Footer />
    </div>
  );
}
