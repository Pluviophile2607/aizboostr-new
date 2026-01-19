import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const supportOptions = [

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



export function SupportSection() {
  return (
    <section id="support" className="py-16 relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            We're Here to
            <span className="text-foreground"> Help</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our dedicated support team is ready to assist you on your AI journey.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-5xl mx-auto">
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


      </div>
    </section>
  );
}