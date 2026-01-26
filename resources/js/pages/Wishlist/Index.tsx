// resources/js/pages/Wishlist/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { WishlistItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Trash2,
    ShoppingCart,
    Star,
    ArrowLeft,
    Heart,
    BookOpen,
    Clock
} from 'lucide-react';
import { route } from 'ziggy-js';
import { useFlash } from '@/hooks/use-flash';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WishlistIndexProps {
    wishlistItems: WishlistItem[];
}

export default function WishlistIndex({ wishlistItems }: WishlistIndexProps) {
    useFlash();

    const handleRemove = (slug: string) => {
        if (confirm('Are you sure you want to remove this course from your wishlist?')) {
            router.delete(route('wishlist.destroy', slug), {
                preserveScroll: true,
            });
        }
    };

    const handleAddToCart = (slug: string) => {
        router.post(route('cart.store', slug), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // The backend handles the removal from wishlist if implemented, 
                // but let's assume we want to call destroy after success or trust backend.
                // In the previous code it explicitly called handleRemove(slug).
            }
        });
    };

    return (
        <AppLayout title="My Wishlist">
            <Head title="My Wishlist" />

            <div className="bg-background min-h-screen pb-20">
                {/* Modern Header */}
                <div className="border-b bg-muted/30 py-8">
                    <div className="container mx-auto px-4">
                        <Link href={route('courses.index')} className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
                        </Link>
                        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl flex items-center gap-3">
                                <Heart className="h-8 w-8 text-rose-500 fill-rose-500" /> My Wishlist
                                <Badge variant="secondary" className="ml-2 text-lg px-3 rounded-full">
                                    {wishlistItems.length}
                                </Badge>
                            </h1>
                            <p className="text-muted-foreground font-medium">
                                Save your favorite courses and learn them later.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {wishlistItems.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {wishlistItems.map((item) => (
                                <Card key={item.id} className="group relative flex flex-col overflow-hidden border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                                    {/* Thumbnail */}
                                    <div className="aspect-video w-full overflow-hidden bg-muted relative">
                                        <img
                                            src={item.course.thumbnail || '/images/default-thumbnail.jpg'}
                                            alt={item.course.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8 rounded-full shadow-lg"
                                                onClick={() => handleRemove(item.course.slug)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {Number(item.course.price) === 0 && (
                                            <div className="absolute top-2 left-2">
                                                <Badge className="bg-green-600 text-white border-none">Free</Badge>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <CardContent className="flex flex-1 flex-col p-5">
                                        <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                                            <Clock className="h-3 w-3" /> Updated Recently
                                        </div>
                                        <Link href={route('courses.show', item.course.slug)} className="mb-2 block">
                                            <h3 className="line-clamp-2 text-lg font-bold group-hover:text-primary transition-colors leading-tight">
                                                {item.course.title}
                                            </h3>
                                        </Link>
                                        <p className="mb-3 text-sm text-muted-foreground">{item.course.instructor?.name || 'Expert Instructor'}</p>

                                        <div className="flex items-center gap-1 mb-4">
                                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                            <span className="text-sm font-bold">{item.course.average_rating ? item.course.average_rating.toFixed(1) : '4.8'}</span>
                                            <span className="text-xs text-muted-foreground font-normal">({item.course.reviews_count || '1.2k'})</span>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t">
                                            <div className="text-xl font-black text-primary">
                                                {Number(item.course.price) > 0 ? `OMR ${Number(item.course.price).toFixed(2)}` : 'FREE'}
                                            </div>
                                            <Button
                                                onClick={() => handleAddToCart(item.course.slug)}
                                                size="sm"
                                                className="bg-primary hover:bg-primary/90 rounded-full px-5"
                                            >
                                                <ShoppingCart className="mr-2 h-4 w-4" /> Add
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="py-24 text-center animate-in fade-in slide-in-from-bottom-5 duration-1000">
                            <div className="mx-auto mb-8 flex h-48 w-48 items-center justify-center rounded-full bg-muted/50 shadow-inner">
                                <Heart className="h-24 w-24 text-muted-foreground/20" />
                            </div>
                            <h2 className="mb-4 text-4xl font-black tracking-tight">Your wishlist is empty</h2>
                            <p className="mx-auto mb-12 max-w-lg text-lg text-muted-foreground">
                                Look for courses you're interested in and tap the heart icon to save them here for later.
                            </p>
                            <Link href={route('courses.index')}>
                                <Button size="lg" className="h-14 rounded-full px-12 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                                    Browse Courses <BookOpen className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
