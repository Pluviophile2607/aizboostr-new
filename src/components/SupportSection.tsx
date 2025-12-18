import { MessageCircle, Mail, Phone, HelpCircle, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const supportOptions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Get instant help from our AI-powered support bot or connect with a human agent.",
    action: "Start Chat",
    available: "24/7",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us a detailed message and we'll respond within 24 hours.",
    action: "Send Email",
    available: "Response in 24h",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Schedule a call with our support team for complex issues.",
    action: "Schedule Call",
    available: "Business Hours",
  },
];

const resources = [
  {
    icon: FileText,
    title: "Documentation",
    description: "Comprehensive guides and tutorials",
  },
  {
    icon: HelpCircle,
    title: "FAQ",
    description: "Answers to common questions",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join our Discord community",
  },
];

export function SupportSection() {
  return (
    <section id="support" className="py-32 relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            We're Here to
            <span className="text-foreground"> Help</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our dedicated support team is ready to assist you on your AI journey.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {supportOptions.map((option) => (
            <div
              key={option.title}
              className="bg-card border border-border p-8 rounded-2xl text-center hover:border-foreground/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
                <option.icon className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{option.title}</h3>
              <p className="text-muted-foreground mb-4">{option.description}</p>
              <div className="text-sm text-foreground font-medium mb-6">{option.available}</div>
              <Button variant="outline" className="w-full">
                {option.action}
              </Button>
            </div>
          ))}
        </div>

        {/* Resources */}
        <div className="bg-card border border-border p-8 lg:p-12 rounded-3xl">
          <h3 className="text-2xl font-bold mb-8 text-center text-foreground">Self-Help Resources</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <button
                key={resource.title}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left w-full"
              >
                <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0">
                  <resource.icon className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{resource.title}</h4>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Form CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for?
          </p>
          <Button variant="hero" size="lg">
            Contact Our Team
          </Button>
        </div>
      </div>
    </section>
  );
}