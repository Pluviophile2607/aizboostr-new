import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import api from "@/api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Payment {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  amount: number;
  transactionId: string;
  paymentId: string;
  status: string;
  createdAt: string;
  productDetails: any[];
}

export default function AdminDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/payment/history");
        setPayments(response.data);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setError("Failed to load payment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();

    // Poll for new payments every 3 seconds
    const intervalId = setInterval(fetchPayments, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage and view your business insights.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Recent transactions from your customers.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-destructive">{error}</div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No payments found.</div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden md:table-cell">Transaction ID</TableHead>
                                        <TableHead className="hidden md:table-cell">Product Count</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.map((payment) => (
                                        <TableRow key={payment._id}>
                                            <TableCell className="font-medium whitespace-nowrap">
                                                {format(new Date(payment.createdAt), "MMM d, yyyy HH:mm")}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{payment.name}</span>
                                                    <span className="text-xs text-muted-foreground">{payment.email}</span>
                                                    <span className="text-xs text-muted-foreground">{payment.mobileNumber}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>₹{(payment.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                            <TableCell>
                                                <Badge variant={payment.status === 'success' ? 'default' : 'secondary'} className={payment.status === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}>
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                                                {payment.transactionId}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {payment.productDetails?.length || 0}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
