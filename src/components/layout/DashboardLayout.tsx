import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebarClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  contentClassName?: string;
  sidebar?: boolean;
  header?: boolean;
  footer?: boolean;
  collapsed?: boolean;
  onToggleSidebar?: () => void;
  activePath?: string;
  onNavigate?: (path: string) => void;
}

export function DashboardLayout({
  children,
  className,
  sidebarClassName,
  headerClassName,
  footerClassName,
  contentClassName,
  sidebar = true,
  header = true,
  footer = true,
  collapsed = false,
  onToggleSidebar,
  activePath = '',
  onNavigate = () => {},
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  return (
    <div className={cn('min-h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950', className)}>
      {sidebar && (
        <Sidebar 
          collapsed={isCollapsed} 
          onToggle={toggleSidebar}
          activePath={activePath}
          onNavigate={onNavigate}
          className={sidebarClassName}
        />
      )}

      <div className={cn('flex-1 flex flex-col min-h-screen relative transition-all duration-300', sidebar && 'ml-0 sm:ml-[272px] lg:ml-[272px]')}>
        {header && (
          <Header 
            collapsed={isCollapsed}
            onToggleSidebar={toggleSidebar}
            className={headerClassName}
          />
        )}

        <main className={cn('flex-1 overflow-auto pt-20 sm:pt-24', contentClassName)}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>

        {footer && <Footer className={footerClassName} />}
      </div>
    </div>
  );
}

// Re-export related components
export { Sidebar, Header, Footer };

// Sub-components for easy composition
export interface DashboardLayoutHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function DashboardLayoutHeader({
  title,
  subtitle,
  actions,
  className,
}: DashboardLayoutHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="space-y-0.5">
          {typeof title === 'string' ? (
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          ) : (
            title
          )}
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export interface DashboardLayoutContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayoutContent({
  children,
  className,
}: DashboardLayoutContentProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {children}
    </div>
  );
}

export interface DashboardLayoutGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function DashboardLayoutGrid({
  children,
  className,
  columns = 3,
}: DashboardLayoutGridProps) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className={cn(`grid ${colsClass} gap-6`, className)}>
      {children}
    </div>
  );
}

export interface DashboardLayoutSectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function DashboardLayoutSection({
  title,
  description,
  children,
  className,
  action,
}: DashboardLayoutSectionProps) {
  return (
    <section className={cn('bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden', className)}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            {typeof title === 'string' ? (
              <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
            ) : (
              title
            )}
            {description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}