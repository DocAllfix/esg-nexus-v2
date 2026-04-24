import { Skeleton } from '@/components/ui/skeleton';

export default function DataGuard({ data, isLoading, error, fallback, children }) {
  if (isLoading) return <Skeleton className="w-full h-32" />;
  if (error) return <div className="p-4 text-red-500">Errore: {error.message}</div>;
  if (!data) return fallback || <div className="p-4 text-muted-foreground">Nessun dato disponibile</div>;
  return typeof children === 'function' ? children(data) : children;
}
