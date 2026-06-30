import { cn } from '../utils/utils';

export function PageHeader({ title, subtitle, children, className }) {
  return (
    <div className={cn('flex items-start justify-between px-6 pt-6 pb-4', className)}>
      <div>
        <h1 className="text-xl font-bold text-gray-900 font-orbitron">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
