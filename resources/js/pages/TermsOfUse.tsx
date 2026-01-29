import PublicLayout from '@/layouts/PublicLayout';
import { Head, usePage } from '@inertiajs/react';
import { FileCheck, Zap, AlertCircle, Scale, Clock } from 'lucide-react';
import { type SharedData } from '@/types';

export default function TermsOfUse() {
  const { translations, locale } = usePage<SharedData & { translations: any, locale: string }>().props;
  const isRtl = locale === 'ar';

  return (
    <PublicLayout title={translations.terms_of_use || "Terms of Use"}>
      <Head title={translations.terms_of_use || "Terms of Use"} />

      <section className="relative pt-32 pb-24 overflow-hidden bg-slate-50 dark:bg-slate-950" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 text-amber-600 mb-6">
                <Scale className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                {translations.terms_of_use || "Terms of Use"}
              </h1>
              <p className="text-xl text-muted-foreground font-medium">
                {translations.terms_subtitle || "Understanding your rights and responsibilities."}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-12">

              {/* Special Condition: 24h delay */}
              <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 space-y-4">
                <div className="flex items-center gap-4 text-primary">
                  <Clock className="w-6 h-6 shrink-0" />
                  <h2 className="text-2xl font-black">{translations.condition_24_hours_title || "24-Hour Access Commitment"}</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  <p>{translations.terms_24h_desc_p1}</p>
                  <p>{translations.terms_24h_desc_p2}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-amber-600">
                  <Scale className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">{translations.terms_obligations_title || "User Obligations"}</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                  <p>{translations.terms_obligations_intro}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{translations.terms_obligations_1}</li>
                    <li>{translations.terms_obligations_2}</li>
                    <li><strong>{translations.terms_obligations_3}</strong></li>
                    <li>{translations.terms_obligations_4}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-amber-600">
                  <Zap className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">{translations.terms_ip_title || "Intellectual Property"}</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                  <p>{translations.terms_ip_p1}</p>
                  <p>{translations.terms_ip_p2}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-amber-600">
                  <AlertCircle className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">{translations.terms_termination_title || "Termination"}</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                  <p>{translations.terms_termination_desc}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm text-slate-500">
                  {translations.terms_acknowledgment}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
