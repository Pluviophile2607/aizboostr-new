import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Package, Settings, Sparkles } from "lucide-react";

export default function CustomPackages() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Package className="h-4 w-4" />
              Custom Packages
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Tailored AI Solutions
              <span className="block text-primary glow-text">For Your Business</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We understand that every business is unique. Our custom packages are designed to meet your specific needs, 
              combining the perfect mix of AI automation, marketing, and systems to drive your success.
            </p>
          </div>
        </section>

        {/* Video Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="glass-card rounded-3xl overflow-hidden p-2">
            <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center border border-border">
              {/* Video placeholder - replace src with actual video */}
              <video 
                className="w-full h-full rounded-2xl object-cover"
                controls
                poster=""
              >
                <source src="" type="video/mp4" />
                <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                  <Sparkles className="h-16 w-16" />
                  <p className="text-lg font-medium">Video Coming Soon</p>
                </div>
              </video>
            </div>
          </div>
        </section>

        {/* Customize Your Plan Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              CUSTOMIZE YOUR PLAN
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Build your perfect AI package by selecting the services that matter most to your business. 
              Our team will work with you to create a solution that fits your goals and budget.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Flexible Options</h3>
                <p className="text-muted-foreground text-sm">Mix and match services to create your ideal package</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Scalable Solutions</h3>
                <p className="text-muted-foreground text-sm">Start small and expand as your business grows</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Dedicated Support</h3>
                <p className="text-muted-foreground text-sm">Personal consultation to guide your choices</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
