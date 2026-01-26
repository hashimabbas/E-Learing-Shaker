export function RiskResetBadge({ time }: { time: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            <span className="text-lg">🔄</span>
            <span>
                Risk reset by admin at{' '}
                <span className="font-mono">
                    {new Date(time).toLocaleString()}
                </span>
            </span>
        </div>
    )
}
