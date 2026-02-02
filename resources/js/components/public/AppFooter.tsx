import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function AppFooter() {
    return (
        <footer className="border-t py-10 bg-secondary dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center mb-6">
                    {/* <span className="font-semibold text-gray-900 dark:text-white">E-Learning</span> */}
                </div>
                <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-4">
                    <Link href={route('courses.index')} className="hover:text-primary transition-colors">
                        Course Catalog
                    </Link>
                    <Link href={route('about')} className="hover:text-primary transition-colors">
                        About Me
                    </Link>
                    <Link href={route('support.privacy')} className="hover:text-primary transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href={route('support.terms')} className="hover:text-primary transition-colors">
                        Terms of Use
                    </Link>
                    <Link href={route('support.contact')} className="hover:text-primary transition-colors">
                        Contact Us
                    </Link>
                </div>

                &copy; {new Date().getFullYear()} Shaker Shams Engineering Workshop. All rights reserved.

            </div>
        </footer>
    );
}
