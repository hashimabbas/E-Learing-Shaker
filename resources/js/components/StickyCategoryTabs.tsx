import { cn } from '@/lib/utils';

export function StickyCategoryTabs({
    categories,
    active,
    onChange,
}: {
    categories: any[];
    active: string;
    onChange: (slug: string) => void;
}) {
    return (
        <div className="sticky top-16 z-40 bg-background border-b">
            <div className="flex overflow-x-auto whitespace-nowrap px-4">
                {categories.map(cat => (
                    <button
                        key={cat.slug}
                        onClick={() => onChange(cat.slug)}
                        className={cn(
                            "py-3 px-4 font-medium transition-colors",
                            active === cat.slug
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
