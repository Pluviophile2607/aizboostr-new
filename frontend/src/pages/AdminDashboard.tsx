import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, DollarSign, Users, CreditCard, TrendingUp, Loader2, ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import api from "@/api/axios";

interface Stats {
  totalEarnings: number;
  totalUsers: number;
  totalPayments: number;
  qrPayments: number;
  razorpayPayments: number;
  paymentBreakdown: {
    full: number;
    advance: number;
    clearance: number;
  };
  statusBreakdown: {
    pending: number;
    verified: number;
    rejected: number;
  };
  recentPayments: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [isReceiptLoading, setIsReceiptLoading] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      navigate("/admin/login");
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load statistics.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewReceipt = async (paymentId: string) => {
    setIsReceiptLoading(true);
    try {
      const response = await api.get(`/admin/payment/${paymentId}/receipt`);
      if (response.data.success && response.data.receipt) {
        setSelectedReceipt(`data:${response.data.contentType};base64,${response.data.receipt}`);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Receipt not found or invalid.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load receipt image.",
      });
    } finally {
      setIsReceiptLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground shrink-0 h-9 w-9 sm:w-auto sm:h-10 sm:px-4 p-0"
              >
                <ArrowLeft className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
              <div className="border-l border-border h-6 hidden sm:block" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold truncate">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">AIZboostr Payment Overview</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="shrink-0 h-9 w-9 sm:w-auto sm:h-10 sm:px-4 p-0"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Earnings */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Earnings</h3>
            <p className="text-3xl font-bold text-foreground">₹{stats?.totalEarnings.toLocaleString()}</p>
          </div>

          {/* Total Users */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-foreground">{stats?.totalUsers}</p>
            <p className="text-xs text-muted-foreground mt-1">Unique customers</p>
          </div>

          {/* Total Payments */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Payments</h3>
            <p className="text-3xl font-bold text-foreground">{stats?.totalPayments}</p>
            <p className="text-xs text-muted-foreground mt-1">
              QR: {stats?.qrPayments} | Razorpay: {stats?.razorpayPayments}
            </p>
          </div>

          {/* Pending Verifications */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Loader2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Pending Verification</h3>
            <p className="text-3xl font-bold text-foreground">{stats?.statusBreakdown.pending}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Payment Type Breakdown */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Payment Type Breakdown</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Full Payments</span>
                <span className="font-semibold">{stats?.paymentBreakdown.full}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">50% Advance Payments</span>
                <span className="font-semibold">{stats?.paymentBreakdown.advance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Clearance Payments</span>
                <span className="font-semibold">{stats?.paymentBreakdown.clearance}</span>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Verification Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">✓ Verified</span>
                <span className="font-semibold text-green-600">{stats?.statusBreakdown.verified}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">⏳ Pending</span>
                <span className="font-semibold text-orange-600">{stats?.statusBreakdown.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">✗ Rejected</span>
                <span className="font-semibold text-red-600">{stats?.statusBreakdown.rejected}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount Paid</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4 text-sm">{payment.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{payment.email}</td>
                    <td className="py-3 px-4 text-sm font-semibold">₹{payment.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'verified' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        payment.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewReceipt(payment.id)}
                        disabled={isReceiptLoading}
                      >
                         View Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Receipt Viewer Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedReceipt(null)}>
          <div className="relative bg-card p-2 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full bg-background/50 hover:bg-background z-10"
              onClick={() => setSelectedReceipt(null)}
            >
              <LogOut className="h-4 w-4 rotate-45" />
            </Button>
            <img 
              src={selectedReceipt} 
              alt="Payment Receipt" 
              className="w-full h-auto rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}
