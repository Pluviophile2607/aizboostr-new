import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GradientText from "./GradientText";
import { PlanCard } from "./PlanCard";
import { useAuth } from "@/hooks/useAuth";

const plansData = [
  {
    id: "regular",
    name: "Regular Plan",
    price: 14000,
    description: "Perfect for starters",
    color: "green",
    features: [
      { name: "3 Social Media Setup", desc: "Insta, FB, YouTube", value: "₹3,000", color: "green" },
      { name: "GMB Setup", desc: "Normal setup & manage", value: "₹2,500", color: "green" },
      { name: "1 Ad Video (30 sec)", desc: "Full customization", value: "₹3,500", color: "green" },
      { name: "Views", desc: "₹1/view (min 5k)", value: "₹5,000", color: "green", info: "Status Marketing Views", isDynamic: true },
    ],
    discount: "No discount applicable",
    gradient: "from-primary via-purple-500 to-pink-500",
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 25000,
    description: "For growing brands",
    color: "primary",
    badge: "POPULAR",
    features: [
      { name: "Social Media Mgmt", desc: "All platforms - Full Service", value: "₹3,000", color: "primary" },
      { name: "GMB Setup", desc: "Updates, Local SEO, Rating", value: "₹7,000", color: "primary" },
      { name: "Pack of 4 Ad Videos", desc: "Full custom. +₹2k 2nd lang", value: "₹10,000", color: "primary" },
      { name: "Views", desc: "₹1/view (min 5k)", value: "₹5,000", color: "primary", info: "Status Marketing Views", isDynamic: true },
    ],
    discount: "Best Value for Growth",
    gradient: "from-primary via-purple-500 to-pink-500",
  },
  {
    id: "pro-premium",
    name: "Pro Premium Plan",
    price: 37000,
    description: "Ultimate solution",
    color: "purple",
    badge: "BEST VALUE",
    features: [
      { name: "3 Social Media Mgmt", desc: "All major platforms", value: "₹3,000", color: "purple" },
      { name: "GMB Setup", desc: "Full suite management", value: "₹7,000", color: "purple" },
      { name: "WhatsApp Chat Bot", desc: "24/7 automated support", value: "₹7,000", color: "purple" },
      { name: "Pack of 4 Ad Videos", desc: "Full custom. +₹2k 2nd lang", value: "₹10,000", color: "purple" },
      { name: "Meta & Google Boost", desc: "50% charged for maint.", value: "₹5,000", color: "purple" },
      { name: "Views", desc: "₹1/view (min 5k)", value: "₹5,000", color: "purple", info: "Status Marketing Views", isDynamic: true },
    ],
    discount: null,
    gradient: "from-primary via-purple-500 to-pink-500",
  },
];

const contentPlansData = [
  {
    id: "double-discount",
    name: "Double Discount Plan",
    price: 10000,
    originalPrice: 22500,
    description: "Save 55%",
    color: "blue",
    features: [
      { name: "10 Content Videos", desc: "15 sec each", value: "₹7,000", color: "blue" },
      { name: "5 Flyers", desc: "High quality designs", value: "₹3,000", color: "blue" },
    ],
    discount: null,
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
  },
  {
    id: "content-boost",
    name: "Content Boost Plan",
    price: 22500,
    originalPrice: 35000,
    description: "Save 36%",
    color: "pink",
    badge: "TRENDING",
    features: [
      { name: "10 Content Videos", desc: "30 sec each", value: "₹10,000", color: "pink" },
      { name: "5 Flyers", desc: "Professional designs", value: "₹3,000", color: "pink" },
      { name: "Social Media Mgmt", desc: "Posting & engagement", value: "₹5,000", color: "pink" },
    ],
    discount: null,
    gradient: "from-pink-500 via-rose-500 to-red-500",
  },
  {
    id: "30-days-content",
    name: "30 Days 30 Content Plan",
    price: 15000,
    originalPrice: 60000,
    description: "Save 75%",
    color: "orange",
    badge: "PREMIUM",
    features: [
      { name: "30 Content Videos", desc: "15 sec each", value: "₹25,000", color: "orange" },
      { name: "+ Optional: Social Media Mgmt", desc: "Add-on service available", value: "₹5,000", color: "orange" },
    ],
    discount: null,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
  },
  {
    id: "30-days-content-part-2",
    name: "30 Days 30 Content Plan (Part 2)",
    price: 30000,
    originalPrice: 120000,
    description: "Save 75%",
    color: "purple",
    badge: "ELITE",
    features: [
      { name: "30 Content Videos", desc: "30 sec each", value: "₹50,000", color: "purple" },
      { name: "15 Flyers", desc: "High quality designs", value: "₹10,000", color: "purple" },
      { name: "+ Optional: Social Media Mgmt", desc: "Add-on service available", value: "₹10,000", color: "purple" },
    ],
    discount: null,
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
  },
];

interface BusinessPlansSectionProps {
  previewMode?: boolean;
}

export const BusinessPlansSection = ({ previewMode = false }: BusinessPlansSectionProps) => {
  const [activeTab, setActiveTab] = useState<"business" | "content" | "custom">("business");
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            Choose Your <span className="text-primary">Growth Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect package to accelerate your business with AI-powered solutions.
          </p>
        </div>

        {/* Toggle Tabs - Access Control: Only show if NOT in preview mode */}
        {!previewMode && (
          <div className="flex justify-center mb-12 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <div className="bg-secondary p-1 rounded-full inline-flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveTab("business")}
                className={`px-6 sm:px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "business"
                    ? "bg-foreground text-background shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Business Plans
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`px-6 sm:px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "content"
                    ? "bg-foreground text-background shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Content Only Plans
              </button>
              <button
                onClick={() => setActiveTab("custom")}
                className={`px-6 sm:px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "custom"
                    ? "bg-foreground text-background shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Custom Packages
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
          {(activeTab === "business" || previewMode) && (
            <div className="max-w-[1400px] mx-auto space-y-6">
              <div className="flex justify-center px-2">
                <GradientText
                  colors={["#5227FF", "#FF9FFC", "#B19EEF", "#ff00d0", "#5227FF"]}
                  animationSpeed={3}
                  className="text-3xl font-bold m-5"
                >
                  Business Plans
                </GradientText>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-8 items-stretch place-content-center">
                {plansData.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
              
              {previewMode && (
                  <div className="flex justify-center mt-12">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="rounded-full px-8 border-primary/20 hover:bg-primary/5 hover:border-primary/50 transition-all font-semibold"
                        onClick={() => navigate("/business-plans")}
                      >
                          More Plans
                      </Button>
                  </div>
              )}
            </div>
          )}

          {!previewMode && activeTab === "content" && (
            <div className="max-w-[1400px] mx-auto space-y-6">
              <div className="flex justify-center px-2">
                <GradientText
                  colors={["#5227FF", "#FF9FFC", "#B19EEF", "#ff00d0", "#5227FF"]}
                  animationSpeed={3}
                  className="text-3xl font-bold m-5"
                >
                  Content Only Plans
                </GradientText>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch place-content-center">
                {contentPlansData.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          )}

          {!previewMode && activeTab === "custom" && (
            <div className="text-center py-12 bg-card border border-border rounded-3xl">
              <div className="mb-6">
                 <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                   <Info className="w-8 h-8 text-foreground" />
                 </div>
                 <h3 className="text-2xl font-bold text-foreground mb-2">Build Your Own Package</h3>
                 <p className="text-muted-foreground max-w-md mx-auto">
                   Need something more specific? Connect with our team to create a custom plan tailored to your business goals.
                 </p>
              </div>
              <Button variant="outline" size="lg" onClick={() => navigate("/custom-packages")}>
                Configure Custom Package
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
