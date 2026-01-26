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
