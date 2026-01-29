import { useRef } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, Download, CreditCard, QrCode, CheckCircle2, Clock } from "lucide-react";

interface ProductDetail {
  name: string;
  price: number;
  billingCycle?: string;
}

interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productDetails: ProductDetail[];
  totalAmount: number;
  amountPaid: number;
  paymentStatus: string;
  paymentMode: string;
  createdAt: string;
}

interface InvoiceProps {
  invoice: InvoiceData;
}

export function Invoice({ invoice }: InvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const getPaymentModeIcon = () => {
    return invoice.paymentMode === 'razorpay' 
      ? <CreditCard className="w-5 h-5" />
      : <QrCode className="w-5 h-5" />;
  };

  const getPaymentStatusIcon = () => {
    return invoice.paymentStatus === 'Full Payment'
      ? <CheckCircle2 className="w-5 h-5 text-green-500" />
      : <Clock className="w-5 h-5 text-amber-500" />;
  };

  const getPaymentStatusColor = () => {
    switch (invoice.paymentStatus) {
      case 'Full Payment':
        return 'bg-green-100 text-green-700 border-green-200';
      case '50% Advance':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Clearance Payment':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Print/Download Actions - Hidden when printing */}
      <div className="flex justify-end gap-3 mb-6 print:hidden">
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Print Invoice
        </Button>
      </div>

      {/* Invoice Content */}
      <div 
        ref={invoiceRef}
        className="bg-white text-gray-900 rounded-2xl border border-gray-200 shadow-lg overflow-hidden print:shadow-none print:border-none"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AIZboostr</h1>
              <p className="text-yellow-100 mt-1">Digital Growth Solutions</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-yellow-100">Invoice Number</p>
              <p className="text-xl font-bold">{invoice.invoiceNumber}</p>
              <p className="text-sm text-yellow-100 mt-2">
                {format(new Date(invoice.createdAt), 'dd MMM yyyy, hh:mm a')}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Customer & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Customer Details */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Bill To</h3>
              <p className="text-lg font-semibold text-gray-900">{invoice.customerName}</p>
              <p className="text-gray-600">{invoice.customerEmail}</p>
              <p className="text-gray-600">{invoice.customerPhone}</p>
            </div>

            {/* Payment Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Payment Details</h3>
              <div className="flex items-center gap-2">
                {getPaymentModeIcon()}
                <span className="text-gray-700 capitalize">
                  {invoice.paymentMode === 'razorpay' ? 'Razorpay' : 'QR Code Payment'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getPaymentStatusIcon()}
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor()}`}>
                  {invoice.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Products Table */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Products / Services</h3>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Item</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Billing</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.productDetails.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600 capitalize">{product.billingCycle || 'One-time'}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-semibold text-gray-900">₹{product.price.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-lg font-medium text-gray-900">₹{invoice.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Amount Paid</span>
              <span className="text-lg font-medium text-green-600">₹{invoice.amountPaid.toLocaleString()}</span>
            </div>
            {invoice.totalAmount !== invoice.amountPaid && (
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-600">Balance Due</span>
                <span className="text-lg font-bold text-red-600">
                  ₹{(invoice.totalAmount - invoice.amountPaid).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm mb-2">Thank you for your business!</p>
            <p className="text-gray-400 text-xs">
              For any queries, contact us at support@aizboostr.com
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
