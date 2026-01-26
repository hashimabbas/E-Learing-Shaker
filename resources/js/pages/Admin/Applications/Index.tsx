import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, X, UserCheck, Eye, FileText } from 'lucide-react';
import { PaginatedData } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { LaravelPagination } from '@/components/ui/pagination';
import { useState } from 'react';

interface Application {
    id: number;
    bio: string;
    specialties: string;
    status: 'pending' | 'approved' | 'rejected';
    user: { id: number, name: string, email: string, profile_photo_url?: string };
    created_at: string;
    admin_notes?: string;
}

interface AdminApplicationsIndexProps {
    applications: PaginatedData<Application>;
    filters: { status: string | null };
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export default function AdminApplicationsIndex({ applications, filters }: AdminApplicationsIndexProps) {
    const { data: formData, setData: setFormData, patch, processing, reset, errors } = useForm({
        status: '' as 'approved' | 'rejected' | '',
        admin_notes: '',
    });

    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const handleFilterChange = (status: string) => {
        router.get(route('admin.applications.index'), {
            status: status === 'all' ? undefined : status
        }, { preserveState: true });
    };

    const openReview = (app: Application) => {
        setSelectedApp(app);
        setFormData('admin_notes', app.admin_notes || '');
        setIsReviewOpen(true);
    };

    const submitDecision = (decision: 'approved' | 'rejected') => {
        if (!selectedApp) return;

        // confirmation handled by the explicit action of clicking the specific button in dialog
        if (confirm(`Are you sure you want to mark this application as ${decision}?`)) {
            router.patch(route('admin.applications.update', selectedApp.id), {
                status: decision,
                admin_notes: formData.admin_notes
            }, {
                onSuccess: () => {
                    setIsReviewOpen(false);
                    reset();
                    setSelectedApp(null);
                },
                preserveScroll: true
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Instructor Applications" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Instructor Applications</h2>
                        <p className="text-muted-foreground">
                            Review and manage requests to become an instructor.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Applications</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select onValueChange={handleFilterChange} defaultValue={filters.status || 'all'}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Specialties</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.data.length > 0 ? (
                                    applications.data.map((app) => (
                                        <TableRow key={app.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={app.user.profile_photo_url} alt={app.user.name} />
                                                        <AvatarFallback>{getInitials(app.user.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{app.user.name}</span>
                                                        <span className="text-xs text-muted-foreground">{app.user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                                                {app.specialties}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    app.status === 'approved' ? 'default' :
                                                        app.status === 'rejected' ? 'destructive' : 'secondary'
                                                } className={
                                                    app.status === 'approved' ? 'bg-green-600 hover:bg-green-700' :
                                                        app.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''
                                                }>
                                                    {app.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" onClick={() => openReview(app)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Review
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No applications found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <div className="mt-4">
                            <LaravelPagination links={applications.links} />
                        </div>
                    </CardContent>
                </Card>

                {/* Review Dialog */}
                <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Review Application</DialogTitle>
                            <DialogDescription>
                                Review the details submitted by {selectedApp?.user.name}.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedApp && (
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Applicant</Label>
                                    <div className="flex items-center gap-2 p-2 border rounded-md">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={selectedApp.user.profile_photo_url} />
                                            <AvatarFallback>{getInitials(selectedApp.user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{selectedApp.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{selectedApp.user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Specialties</Label>
                                    <div className="p-3 bg-muted rounded-md text-sm">
                                        {selectedApp.specialties}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Bio / Experience</Label>
                                    <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                                        {selectedApp.bio}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Admin Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Add notes about this decision..."
                                        value={formData.admin_notes}
                                        onChange={(e) => setFormData('admin_notes', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter className="gap-2 sm:justify-between">
                            <div className="flex gap-2 w-full sm:w-auto">
                                {selectedApp?.status !== 'rejected' && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => submitDecision('rejected')}
                                        disabled={processing}
                                        className="w-full sm:w-auto"
                                    >
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsReviewOpen(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                {selectedApp?.status !== 'approved' && (
                                    <Button
                                        onClick={() => submitDecision('approved')}
                                        disabled={processing}
                                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                                    >
                                        <Check className="mr-2 h-4 w-4" /> Approve Application
                                    </Button>
                                )}
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
