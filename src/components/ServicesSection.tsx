import { Bot, Megaphone, GraduationCap, Server, Sparkles, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import zedCharacter from "@/assets/zed-character.png";

const services = [
  {
    icon: Bot,
    title: "AI Automation",
    description: "Automate your business processes with intelligent AI systems that work 24/7.",
    slug: "ai-automation",
  },
  {
    icon: Megaphone,
    title: "AI Marketing",
    description: "Data-driven marketing campaigns powered by advanced AI analytics.",
    slug: "ai-marketing",
  },
  {
    icon: GraduationCap,
    title: "AI Academy",
    description: "Learn to build and sell AI-powered courses with our comprehensive training.",
    slug: "ai-academy",
  },
  {
    icon: Server,
    title: "SaaS Solutions",
    description: "Custom software solutions built with cutting-edge AI technology.",
    slug: "saas-solutions",
  },
  {
    icon: Sparkles,
    title: "Brand Building",
    description: "Transform your brand identity with AI-generated content and strategies.",
    slug: "brand-building",
  },
  {
    icon: Zap,
    title: "AI Systems",
    description: "Enterprise-grade AI infrastructure for scalable business growth.",
    slug: "ai-systems",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="pt-8 pb-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal scrolling cards at top */}
        <nav className="mb-16">
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {services.map((service, index) => (
              <Link
                to={`/service/${service.slug}`}
                key={service.title}
                className="group flex-shrink-0 w-72 snap-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
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
              </Link>
            ))}
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

        {/* ZED CTA */}
        <div className="mt-20 glass-card rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="p-8 lg:p-12 space-y-6">
              <h3 className="text-3xl font-bold">
                Ready to Transform Your Business?
              </h3>
              <p className="text-muted-foreground text-lg">
                Join thousands of businesses that have already leveraged AI to 10x their growth. 
                ZED is here to guide you every step of the way.
              </p>
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105">
                Start Your AI Journey
              </button>
            </div>
            <div className="relative h-80 lg:h-full flex flex-col items-center justify-center py-8">
              <div className="text-center mb-6 z-10 group cursor-pointer">
                <p 
                  className="text-4xl lg:text-6xl font-black text-foreground leading-tight transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                  style={{
                    textShadow: '3px 3px 0px hsl(var(--muted)), 6px 6px 0px hsl(var(--border)), 9px 9px 15px hsl(var(--foreground) / 0.2)',
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                >
                  <span className="block transition-transform duration-300 group-hover:translate-x-1">"JO</span>
                  <span className="block transition-transform duration-300 delay-75 group-hover:-translate-x-1">DIKHTA HAI</span>
                  <span className="block transition-transform duration-300 delay-150 group-hover:translate-x-1">WOH</span>
                  <span className="block transition-transform duration-300 delay-200 group-hover:-translate-x-1">BIKTA HAI"</span>
                </p>
              </div>
              <img 
                src={zedCharacter} 
                alt="ZED" 
                className="h-48 lg:h-64 w-auto object-contain animate-float mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
