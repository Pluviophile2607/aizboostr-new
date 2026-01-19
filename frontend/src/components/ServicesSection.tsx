import { ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";



export function ServicesSection() {
  return (
    <section id="services" className="pt-8 pb-32 relative bg-background">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal scrolling cards at top */}


        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Everything You Need to
            <span className="block text-foreground">Dominate with AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive AI solutions for every aspect of your business growth.
          </p>
        </div>

        {/* Custom Packages CTA */}
        <Link to="/business-plans?tab=custom" className="block mt-20 group">
          <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 hover:border-foreground/30 hover:shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-foreground transition-colors duration-300">
                <Package className="h-7 w-7 text-foreground group-hover:text-background transition-colors duration-300" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Custom Packages</h3>
                <p className="text-muted-foreground">Tailored AI solutions for your unique business needs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              Explore Options <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}