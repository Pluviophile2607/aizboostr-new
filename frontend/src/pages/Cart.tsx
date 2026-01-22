import { useState, useEffect } from "react";
import api from "@/api/axios";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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

import { useAuth } from "@/hooks/useAuth";

export default function Cart() {
  const { user } = useAuth();
  const { items, removeFromCart, cartTotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qrcode");
  const [paymentType, setPaymentType] = useState("full"); // 'full' or 'installment'
  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Customer data form fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [formErrors, setFormErrors] = useState<{name?: string; email?: string; contact?: string; receipt?: string}>({});
  
  const { toast } = useToast();

  // Initialize form fields when user data is available or modal opens
  useEffect(() => {
    if (user && showPaymentModal) {
      setCustomerName(user.name || "");
      setCustomerEmail(user.email || "");
      setCustomerContact(user.mobileNumber || "");
    }
  }, [user, showPaymentModal]);

  const hasPendingPayment = user?.pendingPayment?.isPending;
  const pendingAmount = user?.pendingPayment?.amount || 0;

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
    if (hasPendingPayment) {
        toast({
            variant: "destructive",
            title: "Pending Payment",
            description: "Please clear your pending dues first.",
        });
        setShowPaymentModal(true);
        return;
    }

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

  // Calculate totals in integer subunits (paise)
  // If pending, amount is fixed to pending amount
  const cartTotalPaise = Math.round(cartTotal * 100);
  const discountAmountPaise = discountApplied ? Math.round(cartTotalPaise * 0.10) : 0;
  const finalTotalPaise = cartTotalPaise - discountAmountPaise;
  
  // Calculate payable amount logic
  let basePayablePaise = finalTotalPaise;
  
  if (hasPendingPayment) {
      basePayablePaise = Math.round(pendingAmount * 100);
  } else {
      basePayablePaise = paymentType === 'installment' ? Math.round(finalTotalPaise * 0.5) : finalTotalPaise;
  }

  // Add Razorpay platform fee (2.5%) - Use floor
  const platformFeePaise = paymentMethod === 'razorpay' ? Math.floor(basePayablePaise * 0.025) : 0;
  
  const payableAmountPaise = basePayablePaise + platformFeePaise;

  console.log("Payment Calc:", { hasPendingPayment, basePayablePaise, platformFeePaise, payableAmountPaise });

  const discountAmount = discountAmountPaise / 100;
  const finalTotal = finalTotalPaise / 100;
  const platformFee = platformFeePaise / 100;
  const payableAmount = payableAmountPaise / 100;

  // Form validation function
  const validateForm = () => {
    const errors: {name?: string; email?: string; contact?: string; receipt?: string} = {};
    
    // Validate name
    if (!customerName.trim()) {
      errors.name = "Name is required";
    } else if (customerName.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    
    // Validate email
    if (!customerEmail.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Validate contact
    if (!customerContact.trim()) {
      errors.contact = "Contact number is required";
    } else if (!/^[789]\d{9}$/.test(customerContact.trim())) {
      errors.contact = "Please enter a valid 10-digit mobile number starting with 7, 8, or 9";
    }
    
    // Validate receipt - now always required
    if (!selectedReceipt) {
      errors.receipt = "Payment receipt is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handlePayment = async () => {
    console.log("Handle Payment triggered. Amount Paise:", payableAmountPaise);
    
    // Validate form before proceeding
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Form Validation Failed",
        description: "Please fix the errors in the form before proceeding.",
      });
      return;
    }
    
    if (paymentMethod === 'razorpay') {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Authentication Required",
                description: "Please login to make a payment.",
            });
            return;
        }

        if (payableAmountPaise < 100) {
            toast({
                variant: "destructive",
                title: "Minimum Payment Required",
                description: "Razorpay requires a minimum payment of ₹1.00. Please increase your cart value.",
            });
            return;
        }

        setShowPaymentModal(false);
        
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
            amount: payableAmountPaise, 
            currency: "INR",
            name: "AIZboostr",
            description: hasPendingPayment ? "Clearance Payment" : "Growth Plan Subscription",
            image: "https://aizboostr.com/logo.png",
            handler: async function (response: any) {
                console.log("Payment Success:", response);
                
                try {
                    // Determine Payment Type
                    let currentPaymentType = 'full';
                    if (hasPendingPayment) {
                        currentPaymentType = 'clearance';
                    } else if (paymentType === 'installment') {
                        currentPaymentType = 'advance';
                    }

                    await api.post('/payment/save', {
                        name: customerName,
                        mobileNumber: customerContact,
                        email: customerEmail,
                        amount: payableAmount,
                        productDetails: hasPendingPayment ? (user.pendingPayment?.productDetails || []) : items,
                        transactionId: response.razorpay_payment_id,
                        paymentId: response.razorpay_payment_id,
                        paymentType: currentPaymentType
                    });

                    toast({
                        title: "Payment Successful!",
                        description: `Payment ID: ${response.razorpay_payment_id}. Saved successfully.`,
                        variant: "default",
                        className: "bg-green-600 text-white"
                    });
                    
                    // Force page reload to refresh auth state (or call a refresh function if available)
                    setTimeout(() => window.location.reload(), 2000); 
                    
                    clearCart();
                } catch (error) {
                    console.error("Error saving payment details:", error);
                     toast({
                        title: "Payment Successful!",
                        description: `Payment ID: ${response.razorpay_payment_id}. processed but details save failed.`,
                        variant: "default",
                        className: "bg-green-600 text-white"
                    });
                    clearCart();
                }
            },
            prefill: {
                name: customerName || "",
                email: customerEmail || "",
                contact: customerContact || ""
            },
            notes: {
                address: "AIZboostr Corporate Office"
            },
            theme: {
                color: hasPendingPayment ? "#EF4444" : "#FACC15" // Red for pending, Yellow for normal
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
        // ... (Keep existing QR logic but update paymentType/amount if needed - leaving as is for now as User focused on Razorpay)
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
            if (!user) {
                toast({
                    variant: "destructive",
                    title: "Authentication Required",
                    description: "Please login to place an order.",
                });
                return;
            }

            // Determine Payment Type for QR
            let currentPaymentType = 'full';
            if (hasPendingPayment) {
                currentPaymentType = 'clearance';
            } else if (paymentType === 'installment') {
                currentPaymentType = 'advance';
            }

            console.log("Uploading receipt to MongoDB...", {
                name: customerName,
                email: customerEmail,
                amount: payableAmount,
                paymentType: currentPaymentType,
                fileName: selectedReceipt.name
            });

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('receiptImage', selectedReceipt);
            formData.append('name', customerName || '');
            formData.append('mobileNumber', customerContact || '');
            formData.append('email', customerEmail || '');
            formData.append('amount', payableAmount.toString());
            formData.append('productDetails', JSON.stringify(
                hasPendingPayment ? (user.pendingPayment?.productDetails || []) : items
            ));
            formData.append('paymentType', currentPaymentType);

            // Upload to MongoDB backend
            const response = await api.post('/payment/qr-payment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log("MongoDB response:", response.data);
            
            toast({
                title: "Payment Submitted",
                description: "Your receipt has been uploaded and payment is pending verification.",
            });
            setShowPaymentModal(false);
            clearCart();
            setSelectedReceipt(null);
        } catch (error: any) {
            console.error("Order processing error:", error);
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast({
                variant: "destructive",
                title: "Processing Failed",
                description: error.response?.data?.message || error.message || "Failed to process order. Please try again.",
            });
        } finally {
            setIsUploading(false);
        }
    } else {
        toast({
            title: "Error",
            description: "Invalid payment method",
        });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.history.back()}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {hasPendingPayment ? (
            <div className="text-center py-16 bg-card border border-destructive/20 rounded-3xl animate-fade-up">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                 <Wallet className="w-10 h-10 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-destructive">Pending Payment Found</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You have a pending balance of <span className="font-bold text-foreground">₹{(pendingAmount).toLocaleString()}</span> from a previous transaction. 
                Please clear this due to proceed with new orders.
              </p>
              <Button variant="destructive" size="lg" onClick={() => setShowPaymentModal(true)}>
                Pay Pending Balance (₹{(pendingAmount).toLocaleString()})
              </Button>
            </div>
          ) : (
            <>
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

                {/* Coupon Code Section */}
                <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="text-sm font-semibold mb-3">Have a Coupon?</h3>
                    <div className="flex gap-2">
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

                    {platformFee > 0 && (
                        <div className="flex justify-between text-muted-foreground text-sm mt-2">
                           <span>Platform Fee (2.5%)</span>
                           <span>+₹{platformFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                    )}
                    
                    {platformFee > 0 && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/50">
                           <span className="font-bold">Final Payable</span>
                           <span className="font-bold text-xl">₹{payableAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                    )}
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
          </>
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
            {/* Customer Information Form */}
            <div className="mb-6 space-y-4 pb-4 border-b border-border">
              <Label className="text-base font-semibold block mb-3">Customer Information</Label>
              
              <div className="space-y-2">
                <Label htmlFor="customer-name" className="text-sm">Name *</Label>
                <Input
                  id="customer-name"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setFormErrors({...formErrors, name: undefined});
                  }}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-email" className="text-sm">Email *</Label>
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="Enter your email"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    setFormErrors({...formErrors, email: undefined});
                  }}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-contact" className="text-sm">Contact Number *</Label>
                <Input
                  id="customer-contact"
                  placeholder="10-digit mobile number"
                  value={customerContact}
                  onChange={(e) => {
                    setCustomerContact(e.target.value);
                    setFormErrors({...formErrors, contact: undefined});
                  }}
                  className={formErrors.contact ? "border-red-500" : ""}
                  maxLength={10}
                />
                {formErrors.contact && (
                  <p className="text-xs text-red-500">{formErrors.contact}</p>
                )}
              </div>

              <div className="space-y-2 bg-secondary/30 p-3 rounded-lg">
                <Label className="text-sm font-semibold">Product Details</Label>
                <p className="text-xs text-muted-foreground">
                  {hasPendingPayment 
                    ? "Clearing pending payment"
                    : items.map(item => item.name).join(", ")}
                </p>
              </div>

              <div className="space-y-2 bg-secondary/30 p-3 rounded-lg">
                <Label className="text-sm font-semibold">Payment Amount</Label>
                <p className="text-lg font-bold">₹{payableAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Payment Type Selection */}
            <div className="mb-6 space-y-3">
                <Label className="text-base font-semibold">2. Choose Payment Schedule</Label>
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

            <Label className="text-base font-semibold mb-3 block">3. Select Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="gap-4">
              {/* Razorpay option temporarily removed */}

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
                        <p className="text-sm text-center font-medium">
                            Scan & Pay <strong>₹{payableAmount.toLocaleString()}</strong>
                        </p>
                    </div>
                )}
              </div>
            </RadioGroup>
            
            {/* Receipt Upload Section */}
            <div className="mt-6 space-y-3 border-t border-border pt-6">
              <Label className="text-base font-semibold block">4. Upload Payment Receipt *</Label>
              <p className="text-xs text-muted-foreground">
                Screenshot of payment confirmation is required for verification.
              </p>
              <Input 
                id="receipt-upload" 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedReceipt(e.target.files[0]);
                    setFormErrors({...formErrors, receipt: undefined});
                  }
                }}
                className={`cursor-pointer ${formErrors.receipt ? "border-red-500" : ""}`}
              />
              {selectedReceipt && (
                <p className="text-xs text-green-600">✓ {selectedReceipt.name} selected</p>
              )}
              {formErrors.receipt && (
                <p className="text-xs text-red-500">{formErrors.receipt}</p>
              )}
            </div>
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
