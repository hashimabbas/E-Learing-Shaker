// resources/js/pages/Cart/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Trash2,
    ShoppingCart,
    ArrowLeft,
    ShieldCheck,
    Tag,
    Lock,
    Heart,
    Star
} from 'lucide-react';
import { useFlash } from '@/hooks/use-flash';
import { route } from 'ziggy-js';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface CartItem {
    id: number;
    course_id: number;
    price_at_purchase: number;
    quantity: number;
    course: {
        title: string;
        slug: string;
        price: number;
        thumbnail: string;
        instructor?: { name: string };
        average_rating?: number;
    };
}

interface CartIndexProps {
    cart: {
        items: CartItem[];
    };
}

export default function CartIndex({ cart }: CartIndexProps) {
    useFlash();

    const handleRemove = (slug: string) => {
        if (confirm('Are you sure you want to remove this course from your cart?')) {
            router.delete(route('cart.destroy', slug), {
                preserveScroll: true,
            });
        }
    };

    const handleCheckout = () => {
        router.post(route('payment.initiate')); // Placeholder route
    };

    const cartTotal = cart.items.reduce((sum, item) => sum + item.price_at_purchase * item.quantity, 0);
    const originalTotal = cartTotal * 1.2; // Symbolic discount placeholder
    const totalSavings = originalTotal - cartTotal;

    return (
        <AppLayout title="Shopping Cart">
            <Head title="My Shopping Cart" />

            <div className="bg-background min-h-screen pb-20">
                {/* Header / Breadcrumb */}
                <div className="border-b bg-muted/30 py-6">
                    <div className="container mx-auto px-4">
                        <Link href={route('courses.index')} className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
                        </Link>
                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl flex items-center gap-3">
                            <ShoppingCart className="h-8 w-8 text-primary" /> Shopping Cart
                            <Badge variant="secondary" className="ml-2 text-lg px-3 rounded-full">
                                {cart.items.length}
                            </Badge>
                        </h1>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-10">
                    {cart.items.length > 0 ? (
                        <div className="grid gap-10 lg:grid-cols-3">
                            {/* List of Items */}
                            <div className="lg:col-span-2 space-y-6">
                                {cart.items.map((item) => (
                                    <Card key={item.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col sm:flex-row">
                                                <Link href={route('courses.show', item.course.slug)} className="w-full sm:w-48 shrink-0 overflow-hidden bg-muted group">
                                                    <img
                                                        src={item.course.thumbnail || '/images/default-thumbnail.jpg'}
                                                        alt={item.course.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-video sm:aspect-square"
                                                    />
                                                </Link>
                                                <div className="flex flex-1 flex-col p-6">
                                                    <div className="flex justify-between gap-4">
                                                        <div className="space-y-1">
                                                            <Link href={route('courses.show', item.course.slug)} className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
                                                                {item.course.title}
                                                            </Link>
                                                            <p className="text-sm text-muted-foreground">By {item.course.instructor?.name || 'Expert Instructor'}</p>
                                                            <div className="flex items-center gap-1 mt-1 text-sm font-medium">
                                                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                                                <span>{item.course.average_rating ? item.course.average_rating.toFixed(1) : '4.8'}</span>
                                                                <span className="text-muted-foreground font-normal">(1,234 ratings)</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <div className="text-2xl font-black text-primary">
                                                                OMR {item.price_at_purchase.toFixed(2)}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground line-through">
                                                                OMR {(item.price_at_purchase * 1.2).toFixed(2)}
                                                            </div>
                                                            <Badge variant="outline" className="mt-2 text-green-600 border-green-200 bg-green-50">20% Off</Badge>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                                                        <div className="flex gap-4">
                                                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive h-9" onClick={() => handleRemove(item.course.slug)}>
                                                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-9">
                                                                <Heart className="mr-2 h-4 w-4" /> Save for Later
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                <div className="pt-4">
                                    <Link href={route('courses.index')}>
                                        <Button variant="ghost" className="font-bold">
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Keep Shopping
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Summary Sidebar */}
                            <aside className="lg:col-span-1">
                                <div className="sticky top-24 space-y-6">
                                    <Card className="shadow-xl border-none">
                                        <CardContent className="p-8">
                                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                                            <div className="space-y-4">
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Original Price</span>
                                                    <span className="line-through">OMR {originalTotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-green-600 font-medium">
                                                    <span>Platform Discount</span>
                                                    <span>-OMR {totalSavings.toFixed(2)}</span>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <div className="text-lg font-bold">Total</div>
                                                        <p className="text-xs text-muted-foreground">Including all taxes</p>
                                                    </div>
                                                    <div className="text-4xl font-black text-primary tracking-tight">
                                                        OMR {cartTotal.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={handleCheckout}
                                                className="w-full h-14 mt-8 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-100"
                                            >
                                                Checkout Now
                                            </Button>

                                            <div className="mt-6 space-y-4">
                                                <div className="relative group">
                                                    <Input placeholder="Enter Coupon Code" className="h-11 pr-20" />
                                                    <Button variant="ghost" className="absolute right-1 top-1 h-9 font-bold text-primary px-4">Apply</Button>
                                                </div>
                                                <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                                                    <ShieldCheck className="h-4 w-4 text-green-600" /> 30-Day Money-Back Guarantee
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Trust Badges */}
                                    <div className="px-4 py-6 bg-muted/40 rounded-xl border border-dashed text-center">
                                        <div className="flex justify-center gap-6 mb-4 opacity-50">
                                            <Lock className="h-6 w-6" />
                                            <ShieldCheck className="h-6 w-6" />
                                            <Tag className="h-6 w-6" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Secure 256-bit SSL Encrypted Payments
                                        </p>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="py-20 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
                            <div className="mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-muted shadow-inner">
                                <ShoppingCart className="h-20 w-20 text-muted-foreground/40" />
                            </div>
                            <h2 className="mb-4 text-4xl font-black tracking-tight">Your cart is feeling lonely.</h2>
                            <p className="mx-auto mb-10 max-w-lg text-lg text-muted-foreground">
                                Your shopping cart is currently empty. Discover thousand of courses and start your learning journey today!
                            </p>
                            <Link href={route('courses.index')}>
                                <Button size="lg" className="h-14 rounded-full px-12 text-lg font-bold shadow-xl shadow-primary/20">
                                    Explore Courses <Tag className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
