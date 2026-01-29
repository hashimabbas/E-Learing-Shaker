// resources/js/pages/Orders/Show.tsx
import AppLayout from '@/layouts/app-layout';
import { Order, OrderItem } from '@/types'; // Define these types
import { Head, Link } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrdersShowProps {
    order: Order & {
        items: (OrderItem & { course: { slug: string } })[];
    };
    success?: string; // Flash success message
    error?: string; // Flash error message
}

const statusMap = {
    pending: { color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900', icon: XCircle },
    paid: { color: 'text-green-600 bg-green-100 dark:bg-green-900', icon: CheckCircle },
    failed: { color: 'text-red-600 bg-red-100 dark:bg-red-900', icon: XCircle },
    refunded: { color: 'text-blue-600 bg-blue-100 dark:bg-blue-900', icon: XCircle },
};

export default function OrdersShow({ order, success, error }: OrdersShowProps) {
    const statusData = statusMap[order.status as keyof typeof statusMap] || statusMap.pending;
    const IconComponent = statusData.icon;

    return (
        <AppLayout>
            <Head title={`Order #${order.order_number}`} />
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Status Alert */}
                {(success || error) && (
                    <div className={cn("p-4 mb-6 rounded-lg font-medium", success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                        {success || error}
                    </div>
                )}

                <div className="bg-white dark:bg-neutral-800 border rounded-xl p-8 shadow-2xl">

                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h1 className="text-2xl font-bold">Order Details</h1>
                        <span className={cn("px-3 py-1 text-sm font-semibold rounded-full uppercase flex items-center", statusData.color)}>
                            <IconComponent className="w-4 h-4 mr-1" />
                            {order.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                        <p><strong>Order Number:</strong> {order.order_number}</p>
                        <p><strong>Date Placed:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                        <p><strong>Payment Method:</strong> {order.payment_method}</p>
                        <p><strong>Total Paid:</strong> OMR {order.total_amount.toFixed(2)}</p>
                    </div>

                    {order.payment_method === 'Bank Transfer' && order.status === 'pending' && (
                        <div className="mb-8 p-6 bg-muted/30 rounded-xl border border-dashed border-primary/50">
                            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-primary rounded-full"></span>
                                Bank Transfer Instructions
                            </h3>
                            <div className="bg-white dark:bg-black p-4 rounded-lg border shadow-sm mb-6">
                                <h4 className="font-semibold text-muted-foreground mb-3 text-sm uppercase tracking-wider">Account Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                    <div className="space-y-1">
                                        <div className="text-muted-foreground text-xs">Account Name</div>
                                        <div className="font-mono font-bold text-lg select-all">SHAKER SHAMS</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-muted-foreground text-xs">Account Number</div>
                                        <div className="font-mono font-bold text-lg select-all">0313048132360034</div>
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <div className="text-muted-foreground text-xs">IBAN</div>
                                        <div className="font-mono font-bold text-lg select-all break-all">OM970270313048132360034</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-muted-foreground text-xs">Branch</div>
                                        <div className="font-medium">City Centre Branch</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-muted-foreground text-xs">Bank</div>
                                        <div className="font-medium">Bank Muscat</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <p className="text-sm font-medium">
                                    After transferring the amount, please send the payment receipt via WhatsApp to complete your order.
                                </p>
                                <a
                                    href={`https://api.whatsapp.com/send?phone=96896657363&text=${encodeURIComponent(`Hello, I have made a bank transfer for Order #${order.order_number}. Here is the receipt.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button size="lg" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-8 shadow-lg shadow-green-500/20">
                                        Send Proof on WhatsApp
                                    </Button>
                                </a>
                                <p className="text-xs text-muted-foreground">Admin will approve your order after verification.</p>
                            </div>
                        </div>
                    )}

                    <Separator className="my-6" />

                    <h2 className="text-xl font-semibold mb-4">Items Purchased</h2>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                <div className="flex-grow">
                                    <Link href={route('courses.show', item.course.slug)} className="font-medium hover:text-primary transition-colors">
                                        {item.name}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                <span className="font-semibold">OMR {item.price.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="flex justify-end">
                        <div className="text-right">
                            <h3 className="text-xl font-bold">Grand Total: OMR {order.total_amount.toFixed(2)}</h3>
                            {order.isPaid && (
                                <Link href="/my-learning">
                                    <Button className="mt-4">Go to My Learning</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
