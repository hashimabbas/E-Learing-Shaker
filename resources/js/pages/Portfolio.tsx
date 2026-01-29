import PublicLayout from '@/layouts/PublicLayout';
import { Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <PublicLayout title={translations.portfolio_title || "My Portfolio"}>
      <Head title={translations.portfolio_title || "Portfolio"} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-950 pt-20 pb-20 lg:pt-32 lg:pb-32" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Background Effects */}
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
                <div className="text-3xl font-black text-white">{images.length}</div>
                <div className="text-sm font-medium text-neutral-400">{translations.portfolio_projects || "Projects"}</div>
              </div>
              <div className="h-12 w-px bg-neutral-800" />
              <div className="text-center">
                <div className="text-3xl font-black text-white">15+</div>
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

        {/* Bottom Wave Shape Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg className="relative block h-[80px] w-full min-w-[1000px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,432.84,26.42V0h767.16v120C1153.29,86.28,1065.34,113.84,985.66,92.83Z" className="fill-background opacity-[0.03]"></path>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.29C57.54,26.58,113.41,13.63,166.39,13.63,219.05,13.63,270,29.93,321.39,56.44Z" className="fill-background"></path>
          </svg>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-background relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-900/10 cursor-pointer"
                onClick={() => setSelectedImage(image.path)}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={image.path}
                    alt={`Portfolio project ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
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
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110"
            onClick={() => setSelectedImage(null)}
            aria-label={translations.portfolio_close || "Close"}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image */}
          <div className="relative max-h-[90vh] max-w-[90vw] animate-in zoom-in duration-300">
            <img
              src={selectedImage}
              alt="Portfolio project full view"
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Navigation Hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="text-sm text-white/60 font-medium">
              {translations.portfolio_click_to_close || "Click anywhere to close"}
            </p>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
