import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebarClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  contentClassName?: string;
  collapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function MainLayout({
  children,
  className,
  sidebarClassName,
  headerClassName,
  footerClassName,
  contentClassName,
  collapsed = false,
  onToggleSidebar,
}: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  const SIDEBAR_W = 272;
  const SIDEBAR_COLLAPSED_W = 72;
  const w = isCollapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W;

  return (
    <div className={cn('min-h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950', className)}>
      <Sidebar 
        collapsed={isCollapsed} 
        onToggle={toggleSidebar}
        className={sidebarClassName}
      />
      
      <div className="flex-1 flex flex-col min-h-screen relative">
        <Header 
          collapsed={isCollapsed}
          onToggleSidebar={toggleSidebar}
          className={headerClassName}
        />
        
        <main className={cn('flex-1 overflow-auto p-6 pt-20', contentClassName)}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
        
        <Footer className={footerClassName} />
      </div>
    </div>
  );
}

