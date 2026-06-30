import { cn } from '../utils/utils';

export function FilterBar({ children, className }) {
  return (
    <div className={cn('flex flex-wrap items-end gap-3 px-6 pb-4', className)}>
      {children}
    </div>
  );
}

export function FilterGroup({ label, children, className }) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  );
}
