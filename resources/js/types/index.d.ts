import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Instructor extends User {
    bio?: string;
    headline?: string;
    courses_count?: number;
    students_count?: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    localized_name?: string;
}

export interface Course {
    id: number;
    title: string;
    title_ar?: string;
    localized_title?: string;
    slug: string;
    description: string;
    description_ar?: string;
    localized_description?: string;
    thumbnail?: string;
    thumbnail_url?: string;
    price: string | number;
    average_rating: number;
    reviews_count: number;
    instructor: Instructor;
    category?: Category;
    learning_outcomes?: string[];
    learning_outcomes_ar?: string[];
    localized_learning_outcomes?: string[];
}

export interface Lesson {
    id: number;
    slug: string;
    title: string;
    type: 'video' | 'quiz' | 'text' | 'downloadable';
    secure_video_url?: string | null;
    quiz?: { id: number };
    is_completed?: boolean;
    is_free_preview?: boolean;
    description?: string;
    text_lesson?: {
        id: number;
        content: string;
    };
}

export interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    payment_method: string;
    created_at: string;
    items: OrderItem[];
    [key: string]: unknown;
}

export interface OrderItem {
    id: number;
    order_id: number;
    course_id: number;
    name: string;
    price: number;
    quantity: number;
    course: {
        title: string;
        slug: string;
        thumbnail?: string;
    };
}

export interface WishlistItem {
    id: number;
    course_id: number;
    course: Course;
}
