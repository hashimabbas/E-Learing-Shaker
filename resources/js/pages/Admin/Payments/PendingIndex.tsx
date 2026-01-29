import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface PendingIndexProps {
  pendingOrders: {
    data: Order[];
    links: any[];
  };
}

export default function PendingIndex({ pendingOrders }: PendingIndexProps) {
  // Ensure pendingOrders has a default structure if undefined (though it should be passed from controller)
  const orders = pendingOrders || { data: [], links: [] };

  const handleApprove = (orderId: number) => {
    if (confirm('Are you sure you want to approve this payment? The user will be enrolled immediately.')) {
      router.post(route('admin.payments.approve', orderId), {}, {
        onSuccess: () => toast.success('Payment approved successfully'),
      });
    }
  };

  const handleReject = (orderId: number) => {
    if (confirm('Are you sure you want to REJECT this payment?')) {
      router.post(route('admin.payments.reject', orderId), {}, {
        onSuccess: () => toast.success('Payment rejected'),
      });
    }
  };

  return (
    <AppLayout title="Pending Payments">
      <Head title="Pending Payments" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pending Payments</h1>
            <p className="text-muted-foreground">Review and approve Bank Transfer requests.</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.data.length > 0 ? (
                orders.data.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.order_number}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.user.name}</span>
                        <span className="text-xs text-muted-foreground">{order.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-bold">OMR {Number(order.total_amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                          onClick={() => handleApprove(order.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                          onClick={() => handleReject(order.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No pending payments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
