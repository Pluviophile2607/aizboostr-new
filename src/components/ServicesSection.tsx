import { Bot, Megaphone, GraduationCap, Server, Sparkles, Zap, ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
const services = [{
  icon: Bot,
  title: "AI Automation",
  description: "Automate your business processes with intelligent AI systems that work 24/7.",
  slug: "ai-automation"
}, {
  icon: Megaphone,
  title: "AI Marketing",
  description: "Data-driven marketing campaigns powered by advanced AI analytics.",
  slug: "ai-marketing"
}, {
  icon: GraduationCap,
  title: "AI Academy",
  description: "Learn to build and sell AI-powered courses with our comprehensive training.",
  slug: "ai-academy"
}, {
  icon: Server,
  title: "SaaS Solutions",
  description: "Custom software solutions built with cutting-edge AI technology.",
  slug: "saas-solutions"
}, {
  icon: Sparkles,
  title: "Brand Building",
  description: "Transform your brand identity with AI-generated content and strategies.",
  slug: "brand-building"
}, {
  icon: Zap,
  title: "AI Systems",
  description: "Enterprise-grade AI infrastructure for scalable business growth.",
  slug: "ai-systems"
}];
export function ServicesSection() {
  return <section id="services" className="pt-8 pb-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal scrolling cards at top */}
        <nav className="mb-16">
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {services.map((service, index) => <Link to={`/service/${service.slug}`} key={service.title} className="group flex-shrink-0 w-72 snap-center" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <article className="bg-card border border-border rounded-2xl p-6 h-full transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <service.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-card-foreground">{service.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                  <div className="flex items-center gap-1.5 text-primary text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore <ArrowRight className="h-4 w-4" />
                  </div>
                </article>
              </Link>)}
          </div>
        </nav>

        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Everything You Need to
            <span className="block text-primary glow-text">Dominate with AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive AI solutions for every aspect of your business growth.
          </p>
        </div>

        {/* Custom Packages CTA */}
        <Link to="/custom-packages" className="block mt-20 group">
          <div className="glass-card rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 hover:border-primary/30">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <Package className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Custom Packages</h3>
                <p className="text-muted-foreground">Tailored AI solutions for your unique business needs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              Explore Options <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </Link>
      </div>
    </section>;
}