import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const SectionBadge = ({ children, icon, className }: SectionBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground',
        className
      )}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.div>
  );
};
