// resources/js/components/user-info.tsx (FINAL FIX)
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

// Update interface to allow null user (conceptually correct for component contract)
interface UserInfoProps {
    user: User | null; // <-- FIX: Explicitly allow null
    showEmail?: boolean;
}

export function UserInfo({
    user,
    showEmail = false,
}: UserInfoProps) {
    const getInitials = useInitials();

    // --- FIX: Add the conditional check at the top ---
    if (!user) {
        // Return null or a safe fallback when no user is available
        return null;
    }
    // ----------------------------------------------------

    // The user object is guaranteed to be non-null after the check

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                {/* Use fallback logic for avatar source */}
                <AvatarImage src={user.avatar || '/images/default-avatar.png'} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
