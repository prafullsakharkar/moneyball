import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface FooterProps {
  className?: string;
  showVersion?: boolean;
  version?: string;
}

export function Footer({ className, showVersion = true, version = '1.0.0' }: FooterProps) {
  const [year] = React.useState(new Date().getFullYear());

  return (
    <motion.footer
      initial={false}
      animate={{ 
        width: showVersion ? 'calc(100% - 272px)' : 'calc(100% - 272px)',
        marginLeft: '272px',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed bottom-0 left-0 right-0 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 flex items-center px-6 z-40',
        className
      )}
    >
      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span>© {year} CricketIQ. All rights reserved.</span>
        
        <div className="hidden sm:flex items-center gap-4 ml-4">
          <a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary-500 transition-colors">Support</a>
        </div>
        
        {showVersion && (
          <span className="hidden sm:inline ml-auto text-xs text-slate-400">
            v{version}
          </span>
        )}
      </div>
    </motion.footer>
  );
}

export interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function FooterLink({ href, children, className }: FooterLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors',
        className
      )}
    >
      {children}
    </a>
  );
}