import { Server, Brain, Network, Shield, Cog, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import zedHero from "@/assets/zed-hero-banner.png";
const systems = [{
  icon: Brain,
  title: "Neural Networks",
  description: "Advanced AI models for complex decision making"
}, {
  icon: Network,
  title: "API Integrations",
  description: "Seamless connections with your existing tools"
}, {
  icon: Shield,
  title: "Security Layer",
  description: "Enterprise-grade protection for all operations"
}, {
  icon: Cog,
  title: "Auto-scaling",
  description: "Infrastructure that grows with demand"
}, {
  icon: BarChart3,
  title: "Predictive Analytics",
  description: "AI-powered forecasting and insights"
}, {
  icon: Server,
  title: "Edge Computing",
  description: "Low-latency processing at the edge"
}];
export function SystemsSection() {
  return <section id="systems" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mx-auto">
            <Server className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">AI Systems</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold">
            Next-Generation
            <span className="block text-primary glow-text">AI Infrastructure</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build your business on a foundation of cutting-edge AI systems 
            designed for performance, reliability, and scale.
          </p>
        </div>

        {/* Systems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {systems.map((system, index) => <div key={system.title} className="group glass-card p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <system.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{system.title}</h3>
              <p className="text-sm text-muted-foreground">{system.description}</p>
            </div>)}
        </div>

        {/* ZED Banner */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 items-center">
            <div className="relative h-80 lg:h-full">
              <img alt="ZED with AI Systems" className="absolute inset-0 w-full h-full object-cover" src="/lovable-uploads/4faa0a4b-5f45-44ff-aba5-2d97d0eede2e.jpg" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card lg:from-transparent lg:to-card border" />
            </div>
            <div className="p-8 lg:p-12 space-y-6">
              <h3 className="text-3xl font-bold">
                Ready to Build Your AI Empire?
              </h3>
              <p className="text-muted-foreground text-lg">
                Get access to the same AI infrastructure used by Fortune 500 companies. 
                Let ZED guide you through the implementation process.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg">
                  Get Started
                </Button>
                <Button variant="outline" size="lg">
                  View Architecture
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}