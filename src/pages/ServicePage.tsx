import { useParams, Link, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Bot, Megaphone, GraduationCap, Server, Sparkles, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const servicesData = {
  "ai-automation": {
    icon: Bot,
    title: "AI Automation",
    description: "Automate your business processes with intelligent AI systems that work 24/7.",
    details: "Transform your workflow with cutting-edge AI automation solutions. Our systems learn from your processes and continuously optimize for maximum efficiency.",
    features: ["24/7 Automated Operations", "Smart Process Optimization", "Real-time Analytics", "Custom AI Models"]
  },
  "ai-marketing": {
    icon: Megaphone,
    title: "AI Marketing",
    description: "Data-driven marketing campaigns powered by advanced AI analytics.",
    details: "Leverage the power of AI to create personalized marketing campaigns that convert. Our AI analyzes customer behavior and optimizes your marketing strategy in real-time.",
    features: ["Predictive Analytics", "Personalized Campaigns", "A/B Testing AI", "ROI Optimization"]
  },
  "ai-academy": {
    icon: GraduationCap,
    title: "AI Academy",
    description: "Learn to build and sell AI-powered courses with our comprehensive training.",
    details: "Master AI skills with our expert-led courses. From beginners to advanced practitioners, we have programs tailored to your learning journey.",
    features: ["Expert Instructors", "Hands-on Projects", "Certification Programs", "Career Support"]
  },
  "saas-solutions": {
    icon: Server,
    title: "SaaS Solutions",
    description: "Custom software solutions built with cutting-edge AI technology.",
    details: "Build scalable SaaS products with AI at the core. Our team helps you design, develop, and deploy software that grows with your business.",
    features: ["Custom Development", "Cloud Infrastructure", "API Integrations", "Scalable Architecture"]
  },
  "brand-building": {
    icon: Sparkles,
    title: "Brand Building",
    description: "Transform your brand identity with AI-generated content and strategies.",
    details: "Create a memorable brand presence with AI-powered creative solutions. From logo design to content strategy, we help you stand out in the market.",
    features: ["AI Content Creation", "Brand Strategy", "Visual Identity", "Social Media Management"]
  },
  "ai-systems": {
    icon: Zap,
    title: "AI Systems",
    description: "Enterprise-grade AI infrastructure for scalable business growth.",
    details: "Deploy robust AI infrastructure that powers your entire organization. Our systems are designed for reliability, security, and performance at scale.",
    features: ["Enterprise Security", "High Availability", "Custom Integrations", "24/7 Support"]
  }
};

export default function ServicePage() {
  const { slug } = useParams();
  const service = servicesData[slug as keyof typeof servicesData];

  if (slug === "video-ads") {
    return <Navigate to="/video-ads" replace />;
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-4xl font-bold">Service Not Found</h1>
          <Link to="/">
            <Button className="mt-8">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/#services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
          
          <div className="glass-card rounded-3xl p-8 lg:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold">{service.title}</h1>
            </div>
            
            <p className="text-xl text-muted-foreground mb-8">{service.description}</p>
            <p className="text-lg text-foreground/80 mb-12">{service.details}</p>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {service.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-border">
                  <Zap className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button size="lg" className="w-full sm:w-auto">
              Get Started with {service.title}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
