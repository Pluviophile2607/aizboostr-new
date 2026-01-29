import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/api/axios";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Invoice } from "@/components/Invoice";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, FileWarning } from "lucide-react";

interface InvoiceData {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productDetails: {
    name: string;
    price: number;
    billingCycle?: string;
  }[];
  totalAmount: number;
  amountPaid: number;
  paymentStatus: string;
  paymentMode: string;
  createdAt: string;
}

export default function InvoicePage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) {
        setError("Invoice ID not provided");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/payment/invoice/${invoiceId}`);
        setInvoice(response.data);
      } catch (err: any) {
        console.error("Error fetching invoice:", err);
        setError(err.response?.data?.message || "Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 text-muted-foreground hover:text-foreground print:hidden"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading invoice...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                <FileWarning className="w-10 h-10 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Invoice Not Found</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                {error}
              </p>
              <Link to="/">
                <Button variant="hero">Go to Home</Button>
              </Link>
            </div>
          )}

          {/* Invoice Content */}
          {!loading && !error && invoice && (
            <div id="invoice-content">
              <Invoice invoice={invoice} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
