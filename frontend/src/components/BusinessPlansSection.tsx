import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Info, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GradientText from "./GradientText";
import { PlanCard } from "./PlanCard";
import { useAuth } from "@/hooks/useAuth";

const validTabs = ["business", "content", "custom"] as const;
type TabType = typeof validTabs[number];

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
      { name: "+ Optional: Social Media Mgmt", desc: "Add-on service available", value: "₹2,500", color: "orange" },
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
      { name: "+ Optional: Social Media Mgmt", desc: "Add-on service available", value: "₹2,500", color: "purple" },
    ],
    discount: null,
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
  },
];

const digitalFootprintPlansData = [
  {
    id: "razorpay-demo",
    name: "Demo for Razorpay",
    price: 5,
    description: "Test payment gateway integration with minimal amount",
    color: "cyan",
    features: [],
    discount: null,
    gradient: "from-cyan-500 via-blue-400 to-indigo-400",
  },
  {
    id: "insta-setup-mgmt",
    name: "Instagram Setup & Management (Monthly)",
    price: 1000,
    description: "Profile optimization, bio setup, highlights, content strategy, and monthly management",
    color: "pink",
    features: [],
    discount: null,
    gradient: "from-pink-500 via-rose-500 to-red-500",
  },
  {
    id: "fb-setup-mgmt",
    name: "Facebook Setup & Management (Monthly)",
    price: 1000,
    description: "Page creation, cover design, about section, business info setup, and monthly management",
    color: "blue",
    features: [],
    discount: null,
    gradient: "from-blue-600 via-blue-500 to-cyan-500",
  },
  {
    id: "linkedin-setup-mgmt",
    name: "LinkedIn Setup & Management (Monthly)",
    price: 1000,
    description: "Company page creation, banner design, professional profile optimization, and monthly management",
    color: "indigo",
    features: [],
    discount: null,
    gradient: "from-indigo-600 via-blue-600 to-sky-500",
  },
  {
    id: "twitter-setup-mgmt",
    name: "Twitter/X Setup & Management (Monthly)",
    price: 1000,
    description: "Profile setup, header design, bio optimization, pinned tweet strategy, and monthly management",
    color: "sky",
    features: [],
    discount: null,
    gradient: "from-sky-500 via-blue-400 to-indigo-400",
  },
  {
    id: "youtube-setup-mgmt",
    name: "YouTube Setup & Management (Monthly)",
    price: 1000,
    description: "Channel creation, banner design, about section, video optimization, and monthly management",
    color: "red",
    features: [],
    discount: null,
    gradient: "from-red-600 via-red-500 to-orange-500",
  },
  {
    id: "gmb-setup",
    name: "Google My Business Setup",
    price: 2500,
    description: "Complete GMB profile setup, photos, categories, and local SEO optimization",
    color: "green",
    features: [],
    discount: null,
    gradient: "from-green-600 via-emerald-500 to-teal-500",
  },
  {
    id: "gmb-management",
    name: "Google My Business Management",
    price: 7000,
    description: "Monthly GMB management with updates, local SEO, rating management, and review responses",
    color: "green",
    features: [],
    discount: null,
    gradient: "from-green-500 via-teal-500 to-emerald-500",
  },
  {
    id: "whatsapp-chatbot",
    name: "WhatsApp Chat Bot for Your Brand",
    price: 7000,
    description: "Automated chatbot for WhatsApp to handle customer queries 24/7",
    color: "green",
    features: [],
    discount: null,
    gradient: "from-green-400 via-emerald-400 to-teal-400",
  },
  {
    id: "basic-landing-page",
    name: "Basic Landing Page",
    price: 5000,
    description: "Single page website with contact form, responsive design, and basic SEO",
    color: "purple",
    features: [],
    discount: null,
    gradient: "from-purple-600 via-violet-500 to-indigo-500",
  },
  {
    id: "landing-page-domain",
    name: "Landing Page + Domain",
    price: 7500,
    description: "Landing page with custom domain registration and 1-year hosting",
    color: "purple",
    features: [],
    discount: null,
    gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
  },
  {
    id: "advanced-website",
    name: "Advanced Website",
    price: 18000,
    description: "Multi-page website with CMS, blog, SEO optimization, and analytics integration",
    color: "orange",
    features: [],
    discount: null,
    gradient: "from-orange-600 via-amber-500 to-yellow-500",
  },

];

interface BusinessPlansSectionProps {
  previewMode?: boolean;
}

const digitalContentPlansData = [
  {
    id: "pack-4-ads",
    name: "Pack of 4 Ads (Up to 30 sec each)",
    price: 10000,
    description: "1 language included free. Additional language: ₹500 per ad (₹2000 total for pack)",
    color: "orange",
    features: [
      { name: "4 Ad Videos", desc: "Up to 30 sec each", value: "Included", color: "orange" },
      { name: "1 Language Free", desc: "Primary language included", value: "Included", color: "orange" },
      { name: "Add'l Language", desc: "+₹500/ad (₹2k total)", value: "Optional", color: "orange" },
    ],
    discount: null,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
  },
  {
    id: "single-ad-15s",
    name: "Single Ad Video (15 sec)",
    price: 3000,
    description: "1 language included free. Additional language: ₹500",
    color: "pink",
    features: [
      { name: "1 Ad Video", desc: "15 sec duration", value: "Included", color: "pink" },
      { name: "1 Language Free", desc: "Primary language included", value: "Included", color: "pink" },
      { name: "Add'l Language", desc: "+₹500 for extra lang", value: "Optional", color: "pink" },
    ],
    discount: null,
    gradient: "from-pink-500 via-rose-500 to-red-500",
  },
  {
    id: "single-ad-30s",
    name: "Single Ad Video (30 sec)",
    price: 3500,
    description: "1 language included free. Additional language: ₹500",
    color: "purple",
    features: [
      { name: "1 Ad Video", desc: "30 sec duration", value: "Included", color: "purple" },
      { name: "1 Language Free", desc: "Primary language included", value: "Included", color: "purple" },
      { name: "Add'l Language", desc: "+₹500 for extra lang", value: "Optional", color: "purple" },
    ],
    discount: null,
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
  },
  {
    id: "single-ad-above-30s",
    name: "Single Ad Video (Above 30 sec)",
    price: 5000,
    description: "1 language included free. Additional language: ₹500",
    color: "blue",
    features: [
      { name: "1 Ad Video", desc: "Above 30 sec duration", value: "Included", color: "blue" },
      { name: "1 Language Free", desc: "Primary language included", value: "Included", color: "blue" },
      { name: "Add'l Language", desc: "+₹500 for extra lang", value: "Optional", color: "blue" },
    ],
    discount: null,
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
  },
  {
    id: "short-movie",
    name: "Short Movie (Up to 5 minutes)",
    price: 25000,
    description: "Professional short movie with script, shooting, editing, and color grading",
    color: "red",
    features: [
      { name: "5 min duration", desc: "Professional short film", value: "Included", color: "red" },
      { name: "Script & Shooting", desc: "Full production support", value: "Included", color: "red" },
      { name: "Editing & Color", desc: "Cinematic grading", value: "Included", color: "red" },
    ],
    discount: null,
    gradient: "from-red-600 via-rose-600 to-pink-600",
  },
];

const digitalReachPlansData = [
  {
    id: "one-week-boost",
    name: "One-week Boost (1,000 reach)",
    price: 1000,
    description: "7-day paid promotion. 50% will be charged for maintenance of the boost campaign.",
    color: "orange",
    features: [
      { name: "7-day paid promotion", desc: "Active for one week", value: "Included", color: "orange" },
      { name: "1,000 reach", desc: "Estimated audience reach", value: "Included", color: "orange" },
      { name: "Maintenance", desc: "50% charged for upkeep", value: "Included", color: "orange" },
    ],
    discount: null,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
  },
  {
    id: "package-4-boosts",
    name: "Package of 4 Boosts",
    price: 4000,
    description: "4 weekly boosts - reach 4,000+ people. 50% will be charged for maintenance of the boost campaign.",
    color: "orange",
    features: [
      { name: "4 weekly boosts", desc: "Consistent visibility", value: "Included", color: "orange" },
      { name: "4,000+ reach", desc: "Estimated audience reach", value: "Included", color: "orange" },
      { name: "Maintenance", desc: "50% charged for upkeep", value: "Included", color: "orange" },
    ],
    discount: null,
    gradient: "from-orange-600 via-red-500 to-pink-500",
  },
  {
    id: "whatsapp-broadcast",
    name: "WhatsApp Broadcast",
    price: 5000,
    description: "Monthly WhatsApp broadcast campaigns to your customer list",
    color: "green",
    features: [
      { name: "Monthly campaigns", desc: "Regular customer outreach", value: "Included", color: "green" },
      { name: "Customer list", desc: "Targeted broadcasting", value: "Included", color: "green" },
      { name: "Broadcast setup", desc: "Message formatting & sending", value: "Included", color: "green" },
    ],
    discount: null,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
  },
  {
    id: "whatsapp-status-marketing",
    name: "WhatsApp Status Marketing Software (U.S.P)",
    price: 1000,
    description: "₹1 per view (minimum 1000 views) - Automated WhatsApp status marketing. No discount applicable.",
    color: "green",
    features: [
      { name: "Views", desc: "₹1/view (min 1k)", value: "₹1,000", color: "green", info: "Automated Status Views", isDynamic: true },
    ],
    discount: null,
    gradient: "from-green-600 via-emerald-600 to-teal-600",
    dynamicConfig: {
      min: 1000,
      max: 10000,
      step: 100,
      pricePerUnit: 1,
      baseUnits: 1000,
      unitName: "views"
    }
  },
  {
    id: "meta-google-boosting",
    name: "Meta & Google Boosting",
    price: 5000,
    description: "Paid advertising on Meta & Google. 50% will be charged for maintenance of the campaign.",
    color: "blue",
    features: [
      { name: "Paid advertising", desc: "Meta & Google Ads", value: "Included", color: "blue" },
      { name: "Campaign management", desc: "Professional setup & optimization", value: "Included", color: "blue" },
      { name: "Maintenance", desc: "50% charged for upkeep", value: "Included", color: "blue" },
    ],
    discount: null,
    gradient: "from-blue-600 via-indigo-500 to-purple-500",
  },
];

const aiAutomationPlansData = [
  {
    id: "lead-automation",
    name: "Lead Automation",
    price: 0,
    description: "Automated lead nurturing with multi-channel follow-ups (WhatsApp Flow, Email)",
    color: "purple",
    badge: "Coming Soon",
    features: [
      { name: "Auto follow-up", desc: "Instant lead engagement", value: "Custom", color: "purple" },
      { name: "WhatsApp Flow", desc: "Interactive chat flows", value: "Custom", color: "purple" },
      { name: "Email sequences", desc: "Drip nurture campaigns", value: "Custom", color: "purple" },
    ],
    discount: "Custom Pricing",
    gradient: "from-purple-600 via-violet-600 to-indigo-600",
    disabled: true,
  },
  {
    id: "crm-setup",
    name: "CRM Setup",
    price: 0,
    description: "Complete CRM setup with sales pipeline, tagging, and automation",
    color: "blue",
    badge: "Coming Soon",
    features: [
      { name: "Pipeline setup", desc: "Visual sales stages", value: "Custom", color: "blue" },
      { name: "Tagging system", desc: "Organized contact segmentation", value: "Custom", color: "blue" },
      { name: "Automation rules", desc: "Workflow triggers", value: "Custom", color: "blue" },
    ],
    discount: "Custom Pricing",
    gradient: "from-blue-600 via-cyan-600 to-teal-600",
    disabled: true,
  },
  {
    id: "workflow-automation",
    name: "Workflow Automation",
    price: 0,
    description: "End-to-end workflow automation (Chatbot, Appointments, Payments)",
    color: "orange",
    badge: "Coming Soon",
    features: [
      { name: "Chatbot integration", desc: "24/7 automated support", value: "Custom", color: "orange" },
      { name: "Appointment booking", desc: "Auto-scheduling system", value: "Custom", color: "orange" },
      { name: "Payment automation", desc: "Seamless invoicing", value: "Custom", color: "orange" },
    ],
    discount: "Custom Pricing",
    gradient: "from-orange-600 via-amber-600 to-yellow-600",
    disabled: true,
  },
  {
    id: "monthly-automation-maintenance",
    name: "Monthly Automation Maintenance",
    price: 0,
    description: "Ongoing support and optimization of automation systems",
    color: "green",
    badge: "Coming Soon",
    features: [
      { name: "System health check", desc: "Regular performance monitoring", value: "Custom", color: "green" },
      { name: "Optimization", desc: "Process improvements", value: "Custom", color: "green" },
      { name: "Support", desc: "Priority troubleshooting", value: "Custom", color: "green" },
    ],
    discount: "Custom Pricing",
    gradient: "from-green-600 via-emerald-600 to-teal-600",
    disabled: true,
  },
];

export const BusinessPlansSection = ({ previewMode = false }: BusinessPlansSectionProps) => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: TabType = tabParam && validTabs.includes(tabParam as TabType) ? (tabParam as TabType) : "business";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const navigate = useNavigate();

  // Sync activeTab with URL parameter when it changes
  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam as TabType)) {
      setActiveTab(tabParam as TabType);
    }
  }, [tabParam]);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {!previewMode && (
          <div className="absolute top-20 left-4 sm:left-8 z-40">
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-2 group bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm sm:bg-transparent sm:border-0 sm:shadow-none rounded-full hover:bg-secondary/80 transition-all duration-300"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
        )}
        <div className={`text-center mb-12 animate-fade-up ${!previewMode ? "mt-12 sm:mt-0" : ""}`}>
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
            <div className="bg-secondary p-1.5 rounded-2xl sm:rounded-full flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-0">
              <button
                onClick={() => setActiveTab("business")}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-xl sm:rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "business"
                    ? "bg-foreground text-background shadow-md transform sm:scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                Business Plans
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-xl sm:rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "content"
                    ? "bg-foreground text-background shadow-md transform sm:scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                Content Only Plans
              </button>
              <button
                onClick={() => setActiveTab("custom")}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 rounded-xl sm:rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "custom"
                    ? "bg-foreground text-background shadow-md transform sm:scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
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
            <div className="max-w-[1400px] mx-auto space-y-12">
               
               <div className="space-y-6">
                  <div className="flex justify-center px-2">
                    <GradientText
                      colors={["#5227FF", "#FF9FFC", "#B19EEF", "#ff00d0", "#5227FF"]}
                      animationSpeed={3}
                      className="text-3xl font-bold m-5"
                    >
                      Digital Footprint Setup
                    </GradientText>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {digitalFootprintPlansData.map((plan) => (
                      <PlanCard key={plan.id} plan={plan} isCompact={true} noBorderRadius={false} />
                    ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex justify-center px-2">
                    <GradientText
                      colors={["#5227FF", "#FF9FFC", "#B19EEF", "#ff00d0", "#5227FF"]}
                      animationSpeed={3}
                      className="text-3xl font-bold m-5"
                    >
                      Digital Content Creation
                    </GradientText>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {digitalContentPlansData.map((plan) => (
                      <PlanCard key={plan.id} plan={plan} isCompact={true} enableExpand={true} />
                    ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex justify-center px-2">
                    <GradientText
                      colors={["#5227FF", "#FF9FFC", "#B19EEF", "#ff00d0", "#5227FF"]}
                      animationSpeed={3}
                      className="text-3xl font-bold m-5"
                    >
                      Digital Reach
                    </GradientText>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {digitalReachPlansData.map((plan) => (
                      <PlanCard key={plan.id} plan={plan} isCompact={true} noBorderRadius={false} />
                    ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex justify-center px-2">
                    <GradientText
                      colors={["#5227FF", "#FF9FFC", "#B19EEF", "#ff00d0", "#5227FF"]}
                      animationSpeed={3}
                      className="text-3xl font-bold m-5"
                    >
                      AI Automation Services
                    </GradientText>
                  </div>
                  <div className="grid grid-cols-1 gap-8 items-stretch place-content-center">
                    {aiAutomationPlansData.map((plan) => (
                      <PlanCard key={plan.id} plan={plan} isCompact={true} orientation="horizontal" />
                    ))}
                  </div>
               </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
};
