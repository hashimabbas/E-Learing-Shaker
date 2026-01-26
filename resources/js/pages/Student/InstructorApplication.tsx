// resources/js/pages/Student/InstructorApplication.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';

interface InstructorApplicationProps {
    hasApplied: boolean;
    applicationStatus: string | null;
}

export default function InstructorApplication({ hasApplied, applicationStatus }: InstructorApplicationProps) {
    const { data, setData, post, processing, errors } = useForm({
        bio: '',
        specialties: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('applications.store'));
    };

    // Status text map for display
    const statusMap = {
        pending: { text: "Your application is under review.", color: "text-yellow-600" },
        approved: { text: "Your application has been approved! You are now an instructor.", color: "text-green-600" },
        rejected: { text: "Your application was rejected. See admin notes for details.", color: "text-red-600" },
    };
    const currentStatus = statusMap[applicationStatus as keyof typeof statusMap] || statusMap.pending;

    return (
        <AppLayout>
            <Head title="Become an Instructor" />
            <div className="mx-auto max-w-2xl px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Apply to Become an Instructor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {hasApplied ? (
                            <div className={`p-4 rounded-lg border-l-4 ${currentStatus.color === "text-green-600" ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'}`}>
                                <p className={`font-semibold ${currentStatus.color}`}>{currentStatus.text}</p>
                                {applicationStatus === 'approved' && <Link href={route('instructor.dashboard')}><Button className='mt-3'>Go to Dashboard</Button></Link>}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <p className="text-muted-foreground">Fill out the form below to submit your experience and apply for an instructor role.</p>

                                <div className="space-y-2">
                                    <Label htmlFor="specialties">Your Specialties (e.g., Python, UI/UX, Laravel)</Label>
                                    <Input id="specialties" value={data.specialties} onChange={(e) => setData('specialties', e.target.value)} required />
                                    <InputError message={errors.specialties} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Tell Us About Your Experience/Bio</Label>
                                    <Textarea id="bio" value={data.bio} onChange={(e) => setData('bio', e.target.value)} rows={6} required />
                                    <InputError message={errors.bio} />
                                </div>

                                <Button type="submit" disabled={processing}>
                                    Submit Application
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
