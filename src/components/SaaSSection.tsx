import { Cpu, Workflow, Database, Cloud, Lock, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Automate repetitive tasks and streamline your operations with AI."
  },
  {
    icon: Database,
    title: "Smart Data Processing",
    description: "Process and analyze large datasets with intelligent AI algorithms."
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description: "Scalable cloud solutions that grow with your business needs."
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-grade security to protect your data and operations."
  },
  {
    icon: Gauge,
    title: "Real-time Analytics",
    description: "Live dashboards and insights to make data-driven decisions."
  },
  {
    icon: Cpu,
    title: "Custom AI Models",
    description: "Tailored AI solutions built specifically for your business."
  }
];

export function SaaSSection() {
  return (
    <section id="saas" className="py-32 relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <img 
              alt="ZED with SaaS dashboard" 
              className="relative rounded-3xl shadow-lg" 
              src="/lovable-uploads/b4c69e80-8647-43ef-9a8e-180c38553d13.jpg" 
            />
            
            {/* Floating stats */}
            <div className="absolute -right-4 top-1/4 bg-card border border-border p-4 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            
            <div className="absolute -left-4 bottom-1/4 bg-card border border-border p-4 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-foreground">10ms</div>
              <div className="text-sm text-muted-foreground">Response</div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
              <Cpu className="h-4 w-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">SaaS & AI Automation</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Enterprise-Grade
              <span className="block text-foreground">AI Software Solutions</span>
            </h2>
            
            <p className="text-xl text-muted-foreground">
              Our custom SaaS platforms and automation tools are designed to 
              revolutionize how your business operates, scales, and succeeds.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map(feature => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="hero" size="lg">
                Explore Solutions
              </Button>
              <Button variant="outline" size="lg">
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}