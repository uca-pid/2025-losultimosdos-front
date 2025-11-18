const Loading = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6 space-y-2">
        <div className="h-9 w-64 bg-muted animate-pulse rounded" />
        <div className="h-5 w-96 bg-muted animate-pulse rounded" />
      </div>
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-32 w-full bg-muted animate-pulse rounded" />
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
};

export default Loading;

