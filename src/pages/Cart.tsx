import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import GradientText from "@/components/GradientText";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScratchCard } from "@/components/ScratchCard";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, QrCode, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Cart() {
  const { items, removeFromCart, cartTotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [paymentType, setPaymentType] = useState("full"); // 'full' or 'installment'
  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "ZED10") {
      setDiscountApplied(true);
      toast({
        title: "Coupon Applied!",
        description: "10% discount applied.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code.",
      });
    }
  };
  
  const handleRemoveCoupon = () => {
    setDiscountApplied(false);
    setCouponCode("");
    toast({
      title: "Coupon Removed",
      description: "Discount has been removed.",
    });
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Please add items to cart first.",
      });
      return;
    }
    setShowPaymentModal(true);
  };

  // Calculate totals
  const discountAmount = discountApplied ? cartTotal * 0.10 : 0;
  const finalTotal = cartTotal - discountAmount;
  
  // Calculate payable amount based on payment type
  const payableAmount = paymentType === 'installment' ? finalTotal * 0.5 : finalTotal;

  const handlePayment = async () => {
    if (paymentMethod === 'razorpay') {
        setShowPaymentModal(false);
        
        const options = {
            key: "rzp_test_S3k05yVpTFOSID", // Enter the Key ID generated from the Dashboard
            amount: payableAmount * 100, // Amount is in currency subunits. Default currency is INR.
            currency: "INR",
            name: "AIZboostr",
            description: "Growth Plan Subscription",
            image: "https://aizboostr.com/logo.png", // You can replace this with your logo URL
            handler: function (response: any) {
                // Determine if this is a dummy success (if key is invalid/test) or real
                console.log("Payment Success:", response);
                toast({
                    title: "Payment Successful!",
                    description: `Payment ID: ${response.razorpay_payment_id}`,
                    variant: "default",
                    className: "bg-green-600 text-white"
                });
                clearCart();
            },
            prefill: {
                name: "User Name",
                email: "user@example.com",
                contact: "9999999999"
            },
            notes: {
                address: "AIZboostr Corporate Office"
            },
            theme: {
                color: "#FACC15"
            }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.on('payment.failed', function (response: any){
                toast({
                    title: "Payment Failed",
                    description: response.error.description,
                    variant: "destructive"
                });
        });
        rzp1.open();
    } else if (paymentMethod === 'qrcode') {
        if (!selectedReceipt) {
            toast({
                variant: "destructive",
                title: "Receipt Required",
                description: "Please upload the payment receipt to proceed.",
            });
            return;
        }
        
        setIsUploading(true);
        try {
            // Create a unique file name
            const fileName = `receipts/${Date.now()}_${selectedReceipt.name}`;
            
            // Upload the file to Supabase Storage
            const { data, error } = await supabase.storage
                .from('receipts')
                .upload(fileName, selectedReceipt);
            
            if (error) throw error;
            
            // Get the public URL
            const { data: urlData } = supabase.storage
                .from('receipts')
                .getPublicUrl(fileName);
            
            console.log("Receipt uploaded:", urlData.publicUrl);
            
            toast({
                title: "Payment Submitted",
                description: "Once we verify your payment we'll send you the invoice.",
            });
            setShowPaymentModal(false);
            clearCart();
            setSelectedReceipt(null);
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: "Failed to upload receipt. Please try again.",
            });
        } finally {
            setIsUploading(false);
        }
    } else {
        toast({
            title: "Processing Payment",
            description: "Redirecting to Payment Gateway...",
        });
        setTimeout(() => {
            setShowPaymentModal(false);
            clearCart();
            toast({
                 title: "Order Placed",
                 description: "Payment successful (Simulated).",
            });
        }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Your <span className="text-primary">Cart</span>
            </h1>
            <p className="text-muted-foreground">
              Review your selected plans before proceeding to checkout.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-3xl animate-fade-up">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any plans yet.
              </p>
              <Link to="/business-plans">
                <Button variant="hero" size="lg">
                  Browse Business Plans
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:border-primary/50"
                    >
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold">{item.name}</h3>
                          {item.type === 'fixed' && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                              Fixed Plan
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          Billing: <span className="capitalize">{item.billingCycle}ly</span>
                        </p>
                        {item.features && (
                          <div className="flex flex-wrap gap-2">
                            {item.features.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md">
                                {feature}
                              </span>
                            ))}
                            {item.features.length > 3 && (
                              <span className="text-[10px] text-muted-foreground px-1 py-1">
                                +{item.features.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-xl font-bold">₹{item.price.toLocaleString()}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scratch Card Section */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2">Scratch & Win a Discount!</h3>
                        <p className="text-sm text-muted-foreground mb-4">Reveal the secret code below to unlock savings.</p>
                        
                        <ScratchCard 
                            width={280} 
                            height={80} 
                            className="bg-card shadow-inner border border-dashed border-border mb-4"
                            coverColor="#9CA3AF"
                        />
                        
                        <div className="flex gap-2 max-w-sm mx-auto">
                            <Input 
                                placeholder="Enter Coupon Code" 
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                disabled={discountApplied}
                                className="bg-background"
                            />
                            {discountApplied ? (
                                <Button variant="destructive" onClick={handleRemoveCoupon}>Remove</Button>
                            ) : (
                                <Button onClick={handleApplyCoupon}>Apply</Button>
                            )}
                        </div>
                    </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                  <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({items.length} items)</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                    
                    {discountApplied && (
                         <div className="flex justify-between text-green-500 font-medium animate-in fade-in slide-in-from-right-4">
                            <span>Discount (10%)</span>
                            <span>-₹{discountAmount.toLocaleString()}</span>
                         </div>
                    )}
                    
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl text-primary">
                        ₹{finalTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full text-lg py-6 group" variant="hero" onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Secure checkout powered by Razorpay
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose how you want to pay for your plan.
            </DialogDescription>
          </DialogHeader>

          
          <div className="py-6 max-h-[60vh] overflow-y-auto px-1">
            {/* Payment Type Selection */}
            <div className="mb-6 space-y-3">
                <Label className="text-base font-semibold">1. Choose Payment Schedule</Label>
                <RadioGroup value={paymentType} onValueChange={setPaymentType} className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 border border-border p-3 rounded-lg bg-card hover:bg-secondary/50 cursor-pointer [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="full" id="pay-full" />
                        <Label htmlFor="pay-full" className="cursor-pointer flex-grow font-medium">
                            Pay Full <br/>
                            <span className="text-sm text-muted-foreground">₹{finalTotal.toLocaleString()}</span>
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2 border border-border p-3 rounded-lg bg-card hover:bg-secondary/50 cursor-pointer [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="installment" id="pay-installment" />
                        <Label htmlFor="pay-installment" className="cursor-pointer flex-grow font-medium">
                            50% Advance <br/>
                            <span className="text-sm text-muted-foreground">₹{(finalTotal * 0.5).toLocaleString()}</span>
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <Label className="text-base font-semibold mb-3 block">2. Select Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="gap-4">
              <div className="flex items-center space-x-2 border border-border p-4 rounded-lg bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
                <RadioGroupItem value="razorpay" id="razorpay" />
                <Label htmlFor="razorpay" className="flex-grow cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <span className="font-semibold block">Pay via Razorpay</span>
                        <span className="text-xs text-muted-foreground">UPI, Cards, NetBanking</span>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex flex-col border border-border p-4 rounded-lg bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="qrcode" id="qrcode" />
                    <Label htmlFor="qrcode" className="flex-grow cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                            <QrCode className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <span className="font-semibold block">Pay via QR Code</span>
                            <span className="text-xs text-muted-foreground">Scan & Pay Manually</span>
                        </div>
                    </div>
                    </Label>
                </div>
                {paymentMethod === 'qrcode' && (
                    <div className="mt-4 flex flex-col items-center justify-center animate-in slide-in-from-top-2 w-full">
                        <img 
                            src="/images/Qr-code.jpeg" 
                            alt="Payment QR Code" 
                            className="w-full max-w-sm h-auto object-contain rounded-lg border-2 border-primary/20 shadow-md mb-4"
                        />
                        <div className="w-full space-y-3">
                            <p className="text-sm text-center font-medium">
                                1. Scan & Pay <strong>₹{payableAmount.toLocaleString()}</strong>
                            </p>
                            <div className="space-y-2">
                                <Label htmlFor="receipt" className="text-xs text-muted-foreground">2. Upload Payment Receipt</Label>
                                <Input 
                                    id="receipt" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setSelectedReceipt(e.target.files[0]);
                                        }
                                    }}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full" onClick={handlePayment} disabled={isUploading}>
              {isUploading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
              ) : (
                <>Pay ₹{payableAmount.toLocaleString()}</>
              )}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
