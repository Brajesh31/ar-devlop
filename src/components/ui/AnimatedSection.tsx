import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type AnimationVariant = 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'fadeScale' | 'fade';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: AnimationVariant;
  once?: boolean;
  amount?: number;
}

const animationVariants: Record<AnimationVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeScale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

export const AnimatedSection = ({ 
  children, 
  className, 
  delay = 0,
  variant = 'fadeUp',
  once = true,
  amount = 0.15,
}: AnimatedSectionProps) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={animationVariants[variant]}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn('section-compact', className)}
    >
      {children}
    </motion.section>
  );
};

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
}

export const AnimatedContainer = ({ 
  children, 
  className, 
  staggerChildren = 0.1,
  delayChildren = 0,
  once = true,
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

type ItemDirection = 'up' | 'down' | 'left' | 'right' | 'scale';

interface AnimatedItemProps {
  children: ReactNode;
  className?: string;
  direction?: ItemDirection;
}

const itemDirectionVariants: Record<ItemDirection, Variants> = {
  up: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  },
  down: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  },
  left: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  },
  right: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  },
};

export const AnimatedItem = ({ 
  children, 
  className,
  direction = 'up',
}: AnimatedItemProps) => {
  return (
    <motion.div
      variants={itemDirectionVariants[direction]}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Div version for non-section elements
interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: AnimationVariant;
  once?: boolean;
}

export const AnimatedDiv = ({ 
  children, 
  className, 
  delay = 0,
  variant = 'fadeUp',
  once = true,
}: AnimatedDivProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-30px' }}
      variants={animationVariants[variant]}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
