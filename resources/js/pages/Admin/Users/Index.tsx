import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PaginatedData } from '@/types';
import { Trash2, UserCog, Check, X, Search, MoreHorizontal, Shield, User, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react'; // Added useEffect
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LaravelPagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import InputError from '@/components/input-error';


interface AdminUsersIndexProps {
    users: PaginatedData<any>;
    filters: { role: string | null; search: string | null };
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export default function AdminUsersIndex({ users, filters }: AdminUsersIndexProps) {
    const [selectedRole, setSelectedRole] = useState(filters.role || 'all');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'student',
    });

    const submitCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    // Simple debounce implementation if hook doesn't exist
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                router.get(route('admin.users.index'), {
                    role: selectedRole === 'all' ? undefined : selectedRole,
                    search: searchQuery || undefined
                }, { preserveState: true, replace: true });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle Role Change instantly
    const handleRoleFilterChange = (role: string) => {
        setSelectedRole(role);
        router.get(route('admin.users.index'), {
            role: role === 'all' ? undefined : role,
            search: searchQuery || undefined
        }, { preserveState: true });
    };


    const handleRoleUpdate = (user: any, newRole: string) => {
        if (confirm(`Are you sure you want to change ${user.name}'s role to ${newRole}?`)) {
            router.patch(route('admin.users.update', user.id), {
                name: user.name,
                email: user.email,
                role: newRole
            }, { preserveScroll: true });
        }
    };

    const handleDelete = (user: any) => {
        if (confirm(`WARNING: This will permanently delete ${user.name}. Are you sure?`)) {
            router.delete(route('admin.users.destroy', user.id), { preserveScroll: true }); // preserverScroll for smoother UX
        }
    };

    return (
        <AppLayout>
            <Head title="User Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                        <p className="text-muted-foreground">
                            Manage users, roles, and permissions.
                        </p>
                    </div>

                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="font-bold">
                                <Plus className="mr-2 h-4 w-4" /> Create User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={submitCreateUser}>
                                <DialogHeader>
                                    <DialogTitle>Create New User</DialogTitle>
                                    <DialogDescription>
                                        Add a new user to the platform. They will be auto-verified.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-name">Full Name</Label>
                                        <Input
                                            id="create-name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="John Doe"
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-email">Email Address</Label>
                                        <Input
                                            id="create-email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="john@example.com"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-password">Initial Password</Label>
                                        <Input
                                            id="create-password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-role">Role</Label>
                                        <Select
                                            onValueChange={(value) => setData('role', value)}
                                            defaultValue={data.role}
                                        >
                                            <SelectTrigger id="create-role">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="student">Student</SelectItem>
                                                <SelectItem value="instructor">Instructor</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing} className="w-full">
                                        {processing ? 'Creating...' : 'Create User'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div>
                                <CardTitle>Users Directory</CardTitle>
                                <CardDescription>
                                    A list of all registered users in the platform.
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search by name or email..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select onValueChange={handleRoleFilterChange} value={selectedRole}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="instructor">Instructor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="hidden md:table-cell">Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={user.profile_photo_url} alt={user.name} />
                                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                user.role === 'admin' ? 'destructive' :
                                                    user.role === 'instructor' ? 'default' : 'secondary'
                                            } className={
                                                user.role === 'instructor' ? 'bg-indigo-500 hover:bg-indigo-600' : ''
                                            }>
                                                {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                                                {user.role === 'instructor' && <GraduationCap className="w-3 h-3 mr-1" />}
                                                {user.role === 'student' && <User className="w-3 h-3 mr-1" />}
                                                <span className="capitalize">{user.role}</span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {user.role === 'student' ? (
                                                        <DropdownMenuItem onClick={() => handleRoleUpdate(user, 'instructor')}>
                                                            <Check className="mr-2 h-4 w-4" /> Promote to Instructor
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleRoleUpdate(user, 'student')}>
                                                            <X className="mr-2 h-4 w-4" /> Demote to Student
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDelete(user)} className="text-red-600 focus:text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-4">
                            <LaravelPagination links={users.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
