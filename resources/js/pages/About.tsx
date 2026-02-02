import PublicLayout from '@/layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2, Building2, Briefcase, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';

export default function About() {
  const { translations, locale } = usePage<SharedData & { translations: any, locale: string }>().props;
  const isRtl = locale === 'ar';

  return (
    <PublicLayout title={translations.about_page_title || "About Eng. Shaker Shams"}>
      <Head title={translations.about_meta_title || "About Me"} />

      {/* Hero / Intro Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48 bg-primary" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px] opacity-50" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px] opacity-50" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Right Content (Text) - Placed first for mobile flow or traditional layout usage */}
            <div className={`order-2 ${isRtl ? 'lg:order-2' : 'lg:order-1'} space-y-8`}>
              <div>
                <h2 className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4">
                  {translations.about_badge || "About Me"}
                </h2>
                <h1 className="text-4xl font-black tracking-tight text-white lg:text-6xl leading-[1.1] mb-6">
                  {translations.about_hero_title_prefix || "I Turn Small Details Into "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                    {translations.about_hero_title_highlight || "Exceptional Results"}
                  </span>.
                </h1>
                <p className="text-xl text-neutral-400 leading-relaxed font-light">
                  {translations.about_hero_quote || '"I believe that precision makes the difference."'}
                </p>
              </div>

              <div className="space-y-6 text-lg text-neutral-300">
                <p>
                  {translations.about_intro_p1 || "I am an engineer specialized in the field of Modern Decoration, Home Facades, and execution."}
                </p>
                <p>
                  {translations.about_intro_p2 || "My goal is to offer content that reflects real-world execution details from my work and field experience, supported by scientific knowledge. I help you learn, avoid common mistakes, and reach the best possible result for your projects."}
                </p>
              </div>

              <div className="pt-4">
                <Link href={route('courses.index')}>
                  <Button size="lg" className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-black font-bold border-none shadow-lg shadow-amber-900/20">
                    {translations.about_view_courses || "View My Courses"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Left Content (Image/Card) */}
            <div className={`order-1 ${isRtl ? 'lg:order-1' : 'lg:order-2'} flex justify-center ${isRtl ? 'lg:justify-start' : 'lg:justify-end'}`}>
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-purple-500 rounded-[2rem] blur-2xl opacity-20 transform rotate-6"></div>
                <div className="relative rounded-[2rem] shadow-2xl overflow-hidden bg-secondary p-3">
                  <img
                    src="/images/about_trans.png"
                    alt={translations.about_eng_name || "Eng. Shaker Shams"}
                    className="rounded-[1.5rem] w-full h-auto object-cover transition-all duration-700"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="text-white font-bold text-xl">
                      {translations.about_eng_name || "Eng. Shaker Shams"}
                    </div>
                    <div className="text-amber-400 text-sm">
                      {translations.about_specialist_title || "Specialist in Details"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles / Companies Section */}
      <section className="py-20 bg-secondary" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">
              {translations.about_roles_title || "Professional Roles"}
            </h2>
            <div className="h-1 w-20 bg-amber-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Role 1 */}
            <div className="group relative overflow-hidden rounded-3xl bg-black backdrop-blur-sm border border-black/5 p-8 transition-all hover:border-amber-600/30 hover:shadow-2xl hover:shadow-black/10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-white transition-colors">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {translations.about_role_wajihat_title || "Wajihat"}
              </h3>
              <p className="text-amber-400 font-bold mb-4">
                {translations.about_role_wajihat_position || "Co-founder & CEO"}
              </p>
              <p className="text-white text-sm leading-relaxed font-medium">
                {translations.about_role_wajihat_desc || "Leading the way in modern facades and architectural aesthetics alongside a talented team."}
              </p>
            </div>

            {/* Role 2 */}
            <div className="group relative overflow-hidden rounded-3xl bg-black backdrop-blur-sm border border-black/5 p-8 transition-all hover:border-amber-600/30 hover:shadow-2xl hover:shadow-black/10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-white transition-colors">
                <Briefcase className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {translations.about_role_verdan_title || "Verdan Doors"}
              </h3>
              <p className="text-amber-400 font-bold mb-4">
                {translations.about_role_verdan_position || "Co-founder & CEO"}
              </p>
              <p className="text-white text-sm leading-relaxed font-medium">
                {translations.about_role_verdan_desc || "Specializing in high-quality door solutions that combine security with elegant design."}
              </p>
            </div>

            {/* Role 3 */}
            <div className="group relative overflow-hidden rounded-3xl bg-black backdrop-blur-sm border border-black/5 p-8 transition-all hover:border-amber-600/30 hover:shadow-2xl hover:shadow-black/10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-white transition-colors">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {translations.about_role_100creators_title || "100Creators"}
              </h3>
              <p className="text-amber-400 font-bold mb-4">
                {translations.about_role_100creators_position || "Head of Fit-out Department"}
              </p>
              <p className="text-white text-sm leading-relaxed font-medium">
                {translations.about_role_100creators_desc || "Overseeing complex fit-out projects and ensuring every interior detail is executed to perfection."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-primary" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-16">
            {translations.about_principles_title || "Principles I Work By"}
          </h2>
          <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto">
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 border border-white/10 shadow-inner">
                <span className="text-2xl font-bold text-amber-500">1</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {translations.about_principle_1_title || "Scientific Knowledge"}
              </h3>
              <p className="text-neutral-400 text-sm">
                {translations.about_principle_1_desc || "Every decision is backed by engineering principles, not just aesthetics."}
              </p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 border border-white/10 shadow-inner">
                <span className="text-2xl font-bold text-amber-500">2</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {translations.about_principle_2_title || "Field Experience"}
              </h3>
              <p className="text-neutral-400 text-sm">
                {translations.about_principle_2_desc || "Real-world insights gained from years of executing complex projects."}
              </p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 border border-white/10 shadow-inner">
                <span className="text-2xl font-bold text-amber-500">3</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {translations.about_principle_3_title || "Continuous Learning"}
              </h3>
              <p className="text-neutral-400 text-sm">
                {translations.about_principle_3_desc || "Avoiding mistakes by learning from every project to reach the best results."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
