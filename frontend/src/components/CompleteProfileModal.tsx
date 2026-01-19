import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CompleteProfileModal() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Open modal if user is logged in AND missing mobile number
    if (user && !user.mobileNumber) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate Mobile Number
    // Must be 10 digits and start with 7, 8, or 9
    const mobileRegex = /^[789]\d{9}$/;
    if (!mobileRegex.test(mobileNumber)) {
        toast({
            title: "Invalid Mobile Number",
            description: "Please enter a valid 10-digit number starting with 7, 8, or 9.",
            variant: "destructive",
        });
        setLoading(false);
        return;
    }

    try {
      await updateProfile({ mobileNumber });
      setIsOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your mobile number has been saved.",
      });
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to update profile",
            variant: "destructive",
        });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      {/* prevent closing by clicking outside: onOpenChange with empty function usually still allows esc/outside unless we specifically block pointer events or use modal=true (default) and control state. 
          Actually best way is to set open={true} and NOT provide a way to close it in UI. 
          Radix UI Dialog (which shadcn uses) allows onOnInteractOutside={(e) => e.preventDefault()}
      */}
      <DialogContent 
        className="sm:max-w-md" 
        onInteractOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
        // hideCloseButton // Shadcn dialog doesn't have this prop by default, we just won't render one if we could, but Close is inside Content usually.
        // We can simulate blocking by not handling close.
      >
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your mobile number to complete the registration.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <Button 
            type="submit" 
            variant="hero" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
