import PublicLayout from '@/layouts/PublicLayout';
import { Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PortfolioImage {
  filename: string;
  path: string;
}

interface PortfolioProps {
  images: PortfolioImage[];
}

export default function Portfolio({ images }: PortfolioProps) {
  const { translations, locale } = usePage<SharedData & { translations: any, locale: string }>().props;
  const isRtl = locale === 'ar';

  // States for optimizations
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, images.length));
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'unset';
  };

  const navigateLightbox = useCallback((direction: 'next' | 'prev') => {
    if (selectedImageIndex === null) return;

    if (direction === 'next') {
      setSelectedImageIndex(prev => (prev! + 1) % images.length);
    } else {
      setSelectedImageIndex(prev => (prev! - 1 + images.length) % images.length);
    }
  }, [selectedImageIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      switch (e.key) {
        case 'Escape': closeLightbox(); break;
        case 'ArrowRight': navigateLightbox(isRtl ? 'prev' : 'next'); break;
        case 'ArrowLeft': navigateLightbox(isRtl ? 'next' : 'prev'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, navigateLightbox, isRtl]);

  const visibleImages = images.slice(0, visibleCount);

  return (
    <PublicLayout title={translations.portfolio_title || "My Portfolio"}>
      <Head title={translations.portfolio_title || "Portfolio"} />

      {/* Hero Section (Restored Original Style) */}
      <section className="relative overflow-hidden bg-primary pt-20 pb-20 lg:pt-32 lg:pb-32" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/5 px-4 py-1.5 text-sm font-bold uppercase tracking-widest mb-4">
              {translations.portfolio_subtitle || "Showcasing Excellence in Execution"}
            </Badge>

            <h1 className="text-5xl font-black tracking-tight text-white lg:text-7xl leading-[1.1]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                {translations.portfolio_title || "My Portfolio"}
              </span>
            </h1>

            <p className="text-lg leading-relaxed text-neutral-400 font-medium max-w-2xl mx-auto">
              {translations.portfolio_description || "Explore a collection of completed projects that demonstrate precision, quality, and attention to detail in modern architecture and finishing works."}
            </p>

            <div className="flex items-center justify-center gap-8 pt-6 opacity-80">
              <div className="text-center">
                <div className="text-3xl font-black text-white">200+</div>
                <div className="text-sm font-medium text-neutral-400">{translations.portfolio_projects || "Projects"}</div>
              </div>
              <div className="h-12 w-px bg-neutral-800" />
              <div className="text-center">
                <div className="text-3xl font-black text-white">14+</div>
                <div className="text-sm font-medium text-neutral-400">{translations.years_experience || "Years"}</div>
              </div>
              <div className="h-12 w-px bg-neutral-800" />
              <div className="text-center">
                <div className="text-3xl font-black text-white">100%</div>
                <div className="text-sm font-medium text-neutral-400">{translations.portfolio_quality || "Quality"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section (Restored Original Style with Optimizations) */}
      <section className="py-20 bg-background relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-900/10 cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                {/* Image Container with Shimmer Optimized */}
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
                  {!loadedImages[index] && (
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 animate-shimmer bg-[length:200%_100%]" />
                  )}
                  <img
                    src={image.path}
                    alt={`Portfolio project ${index + 1}`}
                    onLoad={() => setLoadedImages(prev => ({ ...prev, [index]: true }))}
                    className={cn(
                      "h-full w-full object-cover transition-all duration-700",
                      loadedImages[index] ? "opacity-100 scale-100" : "opacity-0 scale-110",
                      "group-hover:scale-110"
                    )}
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                  {/* Hover Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100 transform scale-75 group-hover:scale-100">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/90 text-white shadow-xl shadow-amber-500/30 backdrop-blur-sm">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Project Number Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md">
                    <span className="text-xs font-bold text-white">#{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button Optimized */}
          {visibleCount < images.length && (
            <div className="mt-16 text-center">
              <Button
                onClick={loadMore}
                variant="outline"
                className="border-neutral-800 text-neutral-800 hover:text-white hover:bg-yellow-500 hover:border-yellow-500 transition-all text-sm font-bold uppercase tracking-widest px-8 py-6 rounded-xl"
              >
                {translations.load_more || "View More Projects"}
                <span className="ml-2 opacity-40 font-medium hover:text-white">({images.length - visibleCount})</span>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal (Optimized Navigation, Original Look) */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110"
            onClick={closeLightbox}
            aria-label={translations.portfolio_close || "Close"}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation - PREV */}
          <button
            className={cn(
              "absolute left-4 lg:left-8 z-10 flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-full bg-white/5 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10 hover:scale-110 active:scale-95",
              isRtl && "left-auto right-4 lg:right-8 rotate-180"
            )}
            onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
          >
            <ChevronLeft className="h-6 w-6 lg:h-10 lg:w-10" />
          </button>

          {/* Navigation - NEXT */}
          <button
            className={cn(
              "absolute right-4 lg:right-8 z-10 flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-full bg-white/5 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10 hover:scale-110 active:scale-95",
              isRtl && "right-auto left-4 lg:left-8 rotate-180"
            )}
            onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
          >
            <ChevronRight className="h-6 w-6 lg:h-10 lg:w-10" />
          </button>

          {/* Image */}
          <div className="relative max-h-[90vh] max-w-[90vw] animate-in zoom-in duration-300">
            <img
              key={selectedImageIndex}
              src={images[selectedImageIndex].path}
              alt="Portfolio project full view"
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Counter */}
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              <span className="text-white/60 text-xs font-bold leading-none">
                {selectedImageIndex + 1} / {images.length}
              </span>
            </div>
          </div>

          {/* Navigation Hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center hidden md:block">
            <p className="text-xs text-white/30 font-bold uppercase tracking-widest">
              {isRtl ? 'استخدم الأسهم للتنقل' : 'Use Arrows to Navigate'}
            </p>
          </div>
        </div>
      )}

      {/* Shimmer Animation styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}} />
    </PublicLayout>
  );
}
