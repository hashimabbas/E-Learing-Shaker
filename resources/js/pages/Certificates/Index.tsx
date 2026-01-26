import AppLayout from '@/layouts/app-layout';
import { Certificate } from '@/types'; // Define this type
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Award, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CertificatesIndexProps {
    certificates: (Certificate & { course: { title: string, slug: string } })[];
}

export default function CertificatesIndex({ certificates }: CertificatesIndexProps) {

    // Helper function to initiate the POST request to generate/download
    const handleDownload = (courseSlug: string) => {
        // This hits the route that checks progress, generates the PDF, and redirects to the signed URL
        router.post(route('student.certificate.generate', courseSlug), {}, {
            onSuccess: () => {
                // Flash message handled by the redirect
            },
            onError: (errors) => {
                // Handle progress not 100% or other errors
                console.error("Download Error:", errors);
            }
        });
    };

    return (
        <AppLayout>
            <Head title="My Certificates" />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8 flex items-center">
                    <Award className="w-7 h-7 mr-3 text-yellow-500" /> Certificates Earned
                </h1>

                {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((cert) => (
                            <Card key={cert.id} className="shadow-lg">
                                <CardHeader className='pb-2'>
                                    <CardTitle className="text-xl line-clamp-2">{cert.course.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Issued: {new Date(cert.issued_at).toLocaleDateString()}</p>
                                    <p className="text-xs text-muted-foreground">Verification Code: {cert.unique_code}</p>

                                    <div className="mt-4 flex flex-col space-y-2">
                                        <Button onClick={() => handleDownload(cert.course.slug)} className="w-full">
                                            <Download className="w-4 h-4 mr-2" /> Download PDF
                                        </Button>
                                        <Link href={route('courses.show', cert.course.slug)} className="w-full">
                                            <Button variant="outline" className="w-full">View Course</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border rounded-lg text-muted-foreground">
                        <p className="text-xl">You have not earned any certificates yet.</p>
                        <Link href={route('student.learning')}>
                            <Button className="mt-4">Go to My Learning</Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
