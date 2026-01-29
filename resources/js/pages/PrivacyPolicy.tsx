import PublicLayout from '@/layouts/PublicLayout';
import { Head, usePage } from '@inertiajs/react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import { type SharedData } from '@/types';

export default function PrivacyPolicy() {
  const { translations, locale } = usePage<SharedData & { translations: any, locale: string }>().props;
  const isRtl = locale === 'ar';

  return (
    <PublicLayout title={translations.privacy_policy || "Privacy Policy"}>
      <Head title={translations.privacy_policy || "Privacy Policy"} />

      <section className="relative pt-32 pb-24 overflow-hidden bg-slate-50 dark:bg-slate-950" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                {translations.privacy_policy || "Privacy Policy"}
              </h1>
              <p className="text-xl text-muted-foreground font-medium">
                {translations.privacy_updated || "Last updated: January 2026"}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-12">

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-primary">
                  <Eye className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">{translations.privacy_intro_title || "Introduction"}</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                  <p>{translations.privacy_intro_p1}</p>
                  <p>{translations.privacy_intro_p2}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-primary">
                  <FileText className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">{translations.privacy_info_title || "Information We Collect"}</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                  <p>{translations.privacy_info_intro}</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{translations.privacy_info_personal}</li>
                    <li>{translations.privacy_info_log}</li>
                    <li>{translations.privacy_info_progress}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-primary">
                  <Lock className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">{translations.privacy_security_title || "Security of Data"}</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                  <p>{translations.privacy_security_p1}</p>
                  <p>{translations.privacy_security_p2}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-center text-slate-500 italic">
                  {translations.privacy_contact}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
