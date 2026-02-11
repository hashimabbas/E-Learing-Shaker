// resources/js/pages/Cart/Index.tsx
import AppLayout from '@/layouts/app-layout';
import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
import { type SharedData } from '@/types';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

interface CartItem {
    id: number;
    course_id: number;
    price_at_purchase: number;
    quantity: number;
    course: {
        title: string;
        localized_title?: string;
        slug: string;
        price: number;
        discounted_price: number;
        has_active_discount: boolean;
        discount_percentage: number;
        thumbnail: string;
        thumbnail_url?: string;
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
    const { translations, locale, gateways } = usePage<SharedData & { translations: any, locale: string, gateways: { thawani: boolean, paypal: boolean, bank_transfer: boolean } }>().props;
    const isRtl = locale === 'ar';

    useFlash();
    const [paymentMethod, setPaymentMethod] = React.useState(gateways?.thawani ? 'Thawani' : 'PayPal');
    const { decrement, updateOptimistically } = useCart();

    // Sync global cart count whenever this page loads with fresh server data
    React.useEffect(() => {
        updateOptimistically(cart.items.length);
    }, [cart.items.length]);

    const [processing, setProcessing] = React.useState(false);

    const handleRemove = (slug: string) => {
        if (confirm(translations.cart_remove_confirm || 'Are you sure you want to remove this course from your cart?')) {
            decrement(); // Optimistic update
            router.delete(route('cart.destroy', slug), {
                preserveScroll: true,
            });
        }
    };

    const handleCheckout = () => {
        setProcessing(true);
        router.post(route('payment.initiate'), {
            payment_method: paymentMethod
        }, {
            onFinish: () => setProcessing(false)
        });
    };

    const cartTotal = cart.items.reduce((sum, item) => sum + Number(item.price_at_purchase) * Number(item.quantity), 0);
    const originalTotal = cart.items.reduce((sum, item) => sum + (Number(item.course.price) || Number(item.price_at_purchase)) * Number(item.quantity), 0);
    const totalSavings = originalTotal - cartTotal;

    return (
        <AppLayout title={translations.cart_page_title || "Shopping Cart"}>
            <Head title={translations.cart_meta_title || "My Shopping Cart"} />

            <div className="bg-background min-h-screen pb-20" dir={isRtl ? "rtl" : "ltr"}>
                {/* Header / Breadcrumb */}
                <div className="border-b bg-muted/30 py-6">
                    <div className="container mx-auto px-4">
                        <Link href={route('courses.index')} className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className={cn("h-4 w-4", isRtl ? "ml-2 rotate-180" : "mr-2")} /> {translations.cart_back_to_courses || "Back to Catalog"}
                        </Link>
                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl flex items-center gap-3">
                            <ShoppingCart className="h-8 w-8 text-primary" /> {translations.cart_items_count || "Shopping Cart"}
                            <Badge variant="secondary" className={cn("text-lg px-3 rounded-full", isRtl ? "mr-2" : "ml-2")}>
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
                                                        src={item.course.thumbnail_url || item.course.thumbnail || '/images/default-thumbnail.jpg'}
                                                        alt={item.course.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-video sm:aspect-square"
                                                    />
                                                </Link>
                                                <div className="flex flex-1 flex-col p-6">
                                                    <div className="flex justify-between gap-4">
                                                        <div className="space-y-1">
                                                            <Link href={route('courses.show', item.course.slug)} className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
                                                                {item.course.localized_title || item.course.title}
                                                            </Link>
                                                            <p className="text-sm text-muted-foreground">{translations.cart_by || "By"} {item.course.instructor?.name || 'Expert Instructor'}</p>
                                                            <div className="flex items-center gap-1 mt-1 text-sm font-medium">
                                                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                                                <span>{item.course.average_rating ? Number(item.course.average_rating).toFixed(1) : '4.8'}</span>
                                                                <span className="text-muted-foreground font-normal">(1,234 {translations.cart_ratings || "ratings"})</span>
                                                            </div>
                                                        </div>
                                                        <div className={cn("shrink-0", isRtl ? "text-left" : "text-right")}>
                                                            <div className="text-2xl font-black text-primary">
                                                                {Number(item.price_at_purchase).toFixed(2)} {translations.course_price_currency || 'USD'}
                                                            </div>
                                                            {item.course.has_active_discount && (
                                                                <>
                                                                    <div className="text-sm text-muted-foreground line-through">
                                                                        {Number(item.course.price).toFixed(2)} {translations.course_price_currency || 'USD'}
                                                                    </div>
                                                                    <Badge variant="outline" className="mt-2 text-green-600 border-green-200 bg-green-50">
                                                                        {item.course.discount_percentage}% {translations.cart_off || "Off"}
                                                                    </Badge>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                                                        <div className="flex gap-4">
                                                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive h-9" onClick={() => handleRemove(item.course.slug)}>
                                                                <Trash2 className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} /> {translations.cart_remove || "Remove"}
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-9">
                                                                <Heart className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} /> {translations.cart_save_later || "Save for Later"}
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
                                            <ArrowLeft className={cn("h-4 w-4", isRtl ? "ml-2 rotate-180" : "mr-2")} /> {translations.cart_keep_shopping || "Keep Shopping"}
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Summary Sidebar */}
                            <aside className="lg:col-span-1">
                                <div className="sticky top-24 space-y-6">
                                    <Card className="shadow-xl border-none">
                                        <CardContent className="p-8">
                                            <h2 className="text-2xl font-bold mb-6">{translations.cart_order_summary || "Order Summary"}</h2>

                                            <div className="space-y-4">
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>{translations.cart_original_price || "Original Price"}</span>
                                                    <span className="line-through">{Number(originalTotal).toFixed(2)} {translations.course_price_currency || 'USD'}</span>
                                                </div>
                                                <div className="flex justify-between text-green-600 font-medium">
                                                    <span>{translations.cart_platform_discount || "Platform Discount"}</span>
                                                    <span>-{Number(totalSavings).toFixed(2)} {translations.course_price_currency || 'USD'}</span>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <div className="text-lg font-bold">{translations.cart_total || "Total"}</div>
                                                        <p className="text-xs text-muted-foreground">{translations.cart_including_taxes || "Including all taxes"}</p>
                                                    </div>
                                                    <div className="text-4xl font-black text-primary tracking-tight">
                                                        {Number(cartTotal).toFixed(2)} {translations.course_price_currency || 'USD'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-6 mt-8">
                                                <h3 className="text-lg font-bold">{translations.cart_select_payment || "Select Payment Method"}</h3>
                                                <div className="space-y-3">
                                                    {gateways?.thawani && (
                                                        <div
                                                            className={`flex items-center space-x-3 rtl:space-x-reverse border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'Thawani' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}`}
                                                            onClick={() => setPaymentMethod('Thawani')}
                                                        >
                                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'Thawani' ? 'border-primary' : 'border-muted-foreground'}`}>
                                                                {paymentMethod === 'Thawani' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-semibold">{translations.cart_payment_card || "Credit / Debit Card"}</div>
                                                                <div className="text-xs text-muted-foreground">{translations.cart_payment_card_desc || "Secure payment via Thawani"}</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div
                                                        className={`flex items-center space-x-3 rtl:space-x-reverse border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'Bank Transfer' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}`}
                                                        onClick={() => setPaymentMethod('Bank Transfer')}
                                                    >
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'Bank Transfer' ? 'border-primary' : 'border-muted-foreground'}`}>
                                                            {paymentMethod === 'Bank Transfer' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold">{translations.cart_payment_bank || "Bank Transfer"}</div>
                                                            <div className="text-xs text-muted-foreground">{translations.cart_payment_bank_desc || "Manual verification required"}</div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`flex items-center space-x-3 rtl:space-x-reverse border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'PayPal' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}`}
                                                        onClick={() => setPaymentMethod('PayPal')}
                                                    >
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'PayPal' ? 'border-primary' : 'border-muted-foreground'}`}>
                                                            {paymentMethod === 'PayPal' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold">{translations.cart_payment_paypal || "PayPal"}</div>
                                                            <div className="text-xs text-muted-foreground">{translations.cart_payment_paypal_desc || "Secure online payment"}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                onClick={handleCheckout}
                                                disabled={processing}
                                                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-100"
                                            >
                                                {processing ? (translations.cart_processing || 'Processing...') : (translations.cart_checkout || 'Checkout Now')}
                                            </Button>

                                            <div className="mt-6 space-y-4">
                                                <div className="relative group">
                                                    <Input placeholder={translations.cart_coupon_placeholder || "Enter Coupon Code"} className={cn("h-11", isRtl ? "pl-20" : "pr-20")} />
                                                    <Button variant="ghost" className={cn("absolute top-1 h-9 font-bold text-primary px-4", isRtl ? "left-1" : "right-1")}>{translations.cart_apply_coupon || "Apply"}</Button>
                                                </div>
                                                <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                                                    <ShieldCheck className="h-4 w-4 text-green-600" /> {translations.cart_guarantee || "30-Day Money-Back Guarantee"}
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
                                            {translations.cart_secure_payments || "Secure 256-bit SSL Encrypted Payments"}
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
                            <h2 className="mb-4 text-4xl font-black tracking-tight">{translations.cart_empty_title || "Your cart is feeling lonely."}</h2>
                            <p className="mx-auto mb-10 max-w-lg text-lg text-muted-foreground">
                                {translations.cart_empty_desc || "Your shopping cart is currently empty. Discover our specialized engineering workshops and start your learning journey today!"}
                            </p>
                            <Link href={route('courses.index')}>
                                <Button size="lg" className="h-14 rounded-full px-12 text-lg font-bold shadow-xl shadow-primary/20">
                                    {translations.cart_explore_courses || "Explore Courses"} <Tag className={cn("h-5 w-5", isRtl ? "mr-2" : "ml-2")} />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
