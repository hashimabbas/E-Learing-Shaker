// resources/js/components/language-switcher.tsx
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react'; // Import Globe Icon

export function LanguageSwitcher() {
    const { locale } = usePage().props as any; // Access the current locale from shared props
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const buttonText = locale === 'ar' ? 'English (EN)' : 'العربية (AR)';

    return (
        <Link href={route('language.switch', { locale: newLocale })} replace>
            <Button variant="ghost" size="sm" className='flex items-center space-x-1'>
                <Globe className='w-4 h-4' />
                <span>{buttonText}</span>
            </Button>
            {/* DEBUG LINE: Temporarily display the received locale */}
            {/* <span className='ml-2 text-xs text-red-500'>Prop: {locale || 'undefined'}</span> */}
        </Link>
    );
}
