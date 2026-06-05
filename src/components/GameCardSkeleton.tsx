export default function GameCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-white/5">
      <div className="aspect-[4/3] animate-shimmer" />
      <div className="p-3.5 space-y-2">
        <div className="h-4 w-3/4 rounded-md animate-shimmer" />
        <div className="h-3 w-full rounded-md animate-shimmer" />
      </div>
    </div>
  );
}
