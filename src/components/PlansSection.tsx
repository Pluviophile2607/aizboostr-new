import { Check, Zap, Crown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "999",
    description: "Perfect for small businesses starting their AI journey",
    features: [
      "AI Content Generation",
      "Basic Automation",
      "Email Marketing AI",
      "5 Social Media Posts/Week",
      "Basic Analytics",
      "Email Support",
    ],
  },
  {
    name: "Professional",
    icon: Crown,
    price: "2,499",
    description: "For growing businesses ready to scale with AI",
    popular: true,
    features: [
      "Everything in Starter",
      "Advanced AI Automation",
      "Custom AI Chatbots",
      "Unlimited Social Posts",
      "Advanced Analytics & Reports",
      "Priority Support",
      "1 Custom AI Integration",
    ],
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    description: "Full AI transformation for large organizations",
    features: [
      "Everything in Professional",
      "Unlimited AI Integrations",
      "Dedicated AI Engineer",
      "Custom SaaS Development",
      "AI Systems Infrastructure",
      "24/7 Premium Support",
      "White-label Solutions",
    ],
  },
];

const addons = [
  { name: "AI Academy Access", price: "$499/month" },
  { name: "Custom Chatbot", price: "$1,999 one-time" },
  { name: "AI Video Generation", price: "$299/month" },
  { name: "Lead Generation AI", price: "$599/month" },
];

export function PlansSection() {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const toggleAddon = (addon: string) => {
    setSelectedAddons(prev => 
      prev.includes(addon) 
        ? prev.filter(a => a !== addon)
        : [...prev, addon]
    );
  };

  return (
    <section id="plans" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Choose Your
            <span className="text-primary glow-text"> AI Power Level</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Flexible plans designed to match your business needs. Customize your package with add-ons.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative glass-card rounded-3xl p-8 ${
                plan.popular 
                  ? "border-primary/50 scale-105 lg:scale-110 z-10" 
                  : "border-border/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  plan.popular ? "bg-primary" : "bg-primary/10"
                }`}>
                  <plan.icon className={`h-6 w-6 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  {plan.price !== "Custom" && <span className="text-2xl text-muted-foreground">$</span>}
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? "hero" : "outline"} 
                className="w-full"
                size="lg"
              >
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>

        {/* Custom Add-ons */}
        <div className="glass-card rounded-3xl p-8 lg:p-12">
          <h3 className="text-2xl font-bold mb-6">Customize Your Package</h3>
          <p className="text-muted-foreground mb-8">Add these powerful AI features to any plan:</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {addons.map((addon) => (
              <button
                key={addon.name}
                onClick={() => toggleAddon(addon.name)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedAddons.includes(addon.name)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-semibold">{addon.name}</div>
                <div className="text-sm text-primary mt-1">{addon.price}</div>
              </button>
            ))}
          </div>

          {selectedAddons.length > 0 && (
            <div className="mt-8 flex items-center justify-between p-4 bg-primary/10 rounded-xl">
              <span>Selected add-ons: {selectedAddons.join(", ")}</span>
              <Button variant="hero" size="sm">Build Custom Package</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
