import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function AppFooter() {
    return (
        <footer className="border-t py-10 bg-gray-100 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center mb-6">
                    <img src="/images/logo.svg" alt="مهندس شاكر" className="h-12 w-auto mb-2" />
                    {/* <span className="font-semibold text-gray-900 dark:text-white">E-Learning</span> */}
                </div>
                <div className="flex justify-center space-x-6 mb-4">
                    <Link href={route('courses.index')} className="hover:text-primary">
                        Course Catalog
                    </Link>
                    <a href="/about" className="hover:text-primary">
                        About Us
                    </a>
                    <a href="/contact" className="hover:text-primary">
                        Contact Us
                    </a>
                </div>

                &copy; {new Date().getFullYear()} E-Learning Platform. All rights reserved.
            </div>
        </footer>
    );
}
