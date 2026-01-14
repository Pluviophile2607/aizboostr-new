import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SpotlightCard from "./SpotlightCard";
import { Slider } from "@/components/ui/slider";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface PlanFeature {
  name: string;
  desc: string;
  value: string;
  color: string;
  info?: string;
  isDynamic?: boolean;
}

interface DynamicConfig {
  min: number;
  max: number;
  step: number;
  pricePerUnit: number;
  baseUnits: number;
  unitName: string;
}

interface PlanProps {
  id: string;
  name: string;
  price: number;
  description: string;
  color: string;
  features: PlanFeature[];
  discount?: string | null;
  gradient: string;
  badge?: string;
  originalPrice?: number;
  dynamicConfig?: DynamicConfig;
  disabled?: boolean;
}

export const PlanCard = ({ plan, isCompact = false, orientation = "vertical" }: { plan: PlanProps; isCompact?: boolean; orientation?: "vertical" | "horizontal" }) => {
  const [viewCount, setViewCount] = useState(plan.dynamicConfig?.min || 5000);
  const [hasAddOn, setHasAddOn] = useState(false);
  const navigate = useNavigate();
  const { addToCart, removeFromCart, items } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const minViews = plan.dynamicConfig?.min || 5000;
  const maxViews = plan.dynamicConfig?.max || 100000;
  const step = plan.dynamicConfig?.step || 1000;
  const pricePerUnit = plan.dynamicConfig?.pricePerUnit || 1;
  const baseUnits = plan.dynamicConfig?.baseUnits || 5000;

  const additionalCost = Math.max(0, (viewCount - baseUnits) * pricePerUnit);
  const dynamicPrice = plan.price + additionalCost;
  const cartItemId = `${plan.id}-${viewCount}${hasAddOn ? '-addon' : ''}`;
  const isSelected = items.some((item) => item.id === cartItemId);

  const handleToggleSelection = () => {
    if (plan.disabled) return;
    
    if (!user) {
      navigate("/auth");
      return;
    }

    if (isSelected) {
      removeFromCart(cartItemId);
      setHasAddOn(false); // Reset add-on state when removing plan
      toast({
        title: "Plan Removed",
        description: `${plan.name} has been removed from your selections.`,
      });
    } else {
      const updatedFeatures = plan.features.map((f) => {
        if (f.isDynamic) {
          return `${viewCount.toLocaleString()} ${f.name}`;
        }
        return f.name;
      });

      // Special check for 30 Days plan add-on (Part 1 and Part 2)
      if (hasAddOn) {
         updatedFeatures.push("Social Media Management (Add-On)");
      }

      addToCart({
        id: cartItemId,
        type: "fixed",
        name: `${plan.name} (${viewCount.toLocaleString()} Views)${hasAddOn ? ' + Social Media Mgmt' : ''}`,
        price: dynamicPrice + (hasAddOn ? 2500 : 0),
        billingCycle: "month",
        features: updatedFeatures,
      });

      toast({
        title: "Plan Selected",
        description: `${plan.name} has been added to your selections.`,
      });
    }
  };

  const handleAddOnToggle = () => {
     if (!isSelected) return;
     const newAddOnState = !hasAddOn;
     const oldId = `${plan.id}-${viewCount}${hasAddOn ? '-addon' : ''}`;
     const newId = `${plan.id}-${viewCount}${newAddOnState ? '-addon' : ''}`;
     removeFromCart(oldId);
     setHasAddOn(newAddOnState);
     const updatedFeatures = plan.features.map((f) => {
        if (f.isDynamic) {
          return `${viewCount.toLocaleString()} ${f.name}`;
        }
        return f.name;
      });
      if (newAddOnState) {
         updatedFeatures.push("Social Media Management (Add-On)");
      }
     addToCart({
        id: newId,
        type: "fixed",
        name: `${plan.name} (${viewCount.toLocaleString()} Views)${newAddOnState ? ' + Social Media Mgmt' : ''}`,
        price: dynamicPrice + (newAddOnState ? 2500 : 0),
        billingCycle: "month",
        features: updatedFeatures,
      });
      toast({
        title: newAddOnState ? "Add-On Added" : "Add-On Removed",
        description: `Social Media Management has been ${newAddOnState ? "added to" : "removed from"} your plan.`,
      });
  };

  const commonFeatureRenderer = (feature: PlanFeature, idx: number) => {
    const iconBgColor = feature.color === "primary" ? "bg-primary/10" : `bg-${feature.color}-500/10`;
    const iconColor = feature.color === "primary" ? "text-primary" : `text-${feature.color}-500`;

    let displayName = feature.name;
    let displayValue = feature.value;

    if (feature.isDynamic) {
      displayName = `${viewCount.toLocaleString()} ${feature.name}`;
      displayValue = `₹${viewCount.toLocaleString()} value`;
    }

    const isOptional = feature.name.includes("Optional");
    if ((plan.id === "30-days-content" || plan.id === "30-days-content-part-2") && isOptional) {
        displayValue = "+₹2,500"; 
    }

    return (
      <div key={idx} className="flex flex-col gap-3">
        <div className={`flex ${isCompact ? "gap-2" : "gap-3"}`}>
          <div className={`mt-1 ${isCompact ? "w-5 h-5" : "w-6 h-6"} rounded-full ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
            <Check className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} ${iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
                <p className={`font-medium ${isCompact ? "text-sm" : "text-base"} ${isOptional ? "text-primary font-bold bg-primary/10 px-2 py-0.5 rounded" : "text-foreground"}`}>
                {displayName}
              </p>
              {feature.info && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{feature.info}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className={`${isCompact ? "text-xs" : "text-sm"} text-muted-foreground`}>{feature.desc}</p>
            {!isCompact && <p className="text-xs font-medium text-primary mt-0.5">{displayValue}</p>}
          </div>
        </div>
        {feature.isDynamic && (
          <div className="ml-9 mt-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
            <Slider
              value={[viewCount]}
              onValueChange={(val) => setViewCount(val[0])}
              max={maxViews}
              min={minViews}
              step={step}
              className="py-2 [&>span:first-child]:h-4 [&>span:last-child]:h-6 [&>span:last-child]:w-6"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-muted-foreground">{minViews >= 1000 ? `${minViews/1000}k` : minViews}</span>
              <p className="text-[10px] text-muted-foreground text-center">+₹{pricePerUnit}/view</p>
              <span className="text-[10px] text-muted-foreground">{maxViews >= 1000 ? `${maxViews/1000}k` : maxViews}</span>
            </div>
          </div>
        )}
        {(plan.id === "30-days-content" || plan.id === "30-days-content-part-2") && isOptional && isSelected && (
            <div className="ml-9 mt-2 p-3 bg-primary/5 rounded-lg border border-primary/20 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm text-foreground">Social Media Management (Add-On)</span>
                    <span className="font-bold text-sm text-primary">+₹2,500</span>
                </div>
                  <Button 
                    variant={hasAddOn ? "default" : "outline"} 
                    size="sm" 
                    className="w-full text-xs h-8"
                    onClick={handleAddOnToggle}
                >
                    {hasAddOn ? "Remove Add-On" : "Add This Service"}
                </Button>
            </div>
        )}
      </div>
    );
  };

  return (
    <SpotlightCard key={plan.id} className={`bg-card border-border shadow-sm hover:shadow-xl transition-all duration-300 relative group flex lg:hover:scale-[1.02] p-0 ${isSelected ? "ring-2 ring-primary" : ""} ${orientation === "horizontal" ? "md:flex-row" : "flex-col"}`}>
      {plan.badge && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20">
          {plan.badge}
        </div>
      )}
      <div className={`absolute top-0 left-0 ${orientation === "horizontal" ? "w-1 h-full" : "w-full h-1"} bg-gradient-to-${orientation === "horizontal" ? "b" : "r"} ${plan.gradient}`} />

      <div className={`${isCompact ? "p-4" : "px-4 py-6"} flex ${orientation === "horizontal" ? "flex-col md:flex-row gap-6 w-full items-center" : "flex-col h-full"}`}>
        
        {/* Header Section */}
        <div className={`${orientation === "horizontal" ? "w-full md:w-1/4 md:border-r md:border-border/50 md:pr-6" : ""}`}>
            <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className={`${isCompact ? "text-xl" : "text-2xl"} font-bold text-foreground`}>{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
            </div>
            </div>
            <div className={`${isCompact ? "mb-4 pb-4" : "mb-6 pb-6"} ${orientation === "horizontal" ? "border-b border-border/50 md:border-0 md:pb-0 md:mb-0" : "border-b border-border/50"}`}>
            <div className="flex items-baseline gap-1">
                <span className={`${isCompact ? "text-2xl" : "text-4xl"} font-bold text-foreground`}>₹{(dynamicPrice + (hasAddOn ? 2500 : 0)).toLocaleString()}</span>
                <span className="text-muted-foreground text-base">/month</span>
            </div>
            {plan.originalPrice && (
                <p className="text-sm text-muted-foreground mt-1">
                Worth <span className="line-through decoration-red-500/50">₹{plan.originalPrice.toLocaleString()}</span>
                </p>
            )}
            </div>
        </div>

        {/* Features Section */}
        <div className={`${orientation === "horizontal" ? "flex-1 w-full" : "space-y-4 mb-8 flex-grow"}`}>
            <div className={`${orientation === "horizontal" ? `grid gap-4 ${plan.features.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}` : `space-y-${isCompact ? "3" : "4"}`}`}>
                {plan.features.map(commonFeatureRenderer)}
            </div>
        </div>

        {/* Action Section */}
        <div className={`${orientation === "horizontal" ? "w-full md:w-auto md:min-w-[150px] flex flex-col justify-center" : "mt-auto"}`}>
            {plan.discount && (
            <div className="p-3 bg-secondary/50 rounded-lg mb-6 border border-border/50">
                <p className="text-xs text-muted-foreground text-center">{plan.discount}</p>
            </div>
            )}

            <Button 
            className={`w-full ${isSelected ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            size={isCompact ? "sm" : "lg"}
            onClick={handleToggleSelection}
            disabled={plan.disabled}
            >
            {isSelected ? "Selected" : plan.disabled ? "Coming Soon" : "Select"}
            </Button>
        </div>
      </div>
    </SpotlightCard>
  );
};
