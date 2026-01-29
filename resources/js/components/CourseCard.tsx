import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { route } from 'ziggy-js';
import { useState } from 'react';

export function CourseCard({ course }: { course: any }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Link href={route('courses.show', course.slug)}>
            <Card
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="h-full transition-all hover:-translate-y-1 hover:shadow-xl"
            >
                <CardContent className="p-3">
                    <div className="relative h-28 rounded-md overflow-hidden bg-muted mb-3">
                        {!hovered ? (
                            <img
                                src={course.thumbnail_url || course.thumbnail}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <video
                                src={course.preview_video}
                                autoPlay
                                muted
                                loop
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    <p className="font-semibold text-sm line-clamp-2">
                        {course.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        {course.instructor.name}
                    </p>

                    <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="flex items-center">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 mr-1" />
                            {course.average_rating.toFixed(1)}
                        </span>

                        <span className="font-bold text-primary">
                            {course.price > 0 ? `OMR ${course.price}` : 'Free'}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
