import { motion, HTMLMotionProps, useMotionValue, useTransform } from 'framer-motion';
import { ReactNode, useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

// Hover lift effect with shadow
interface HoverLiftProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  liftAmount?: number;
}

export const HoverLift = ({ 
  children, 
  className = '', 
  liftAmount = 5,
  ...props 
}: HoverLiftProps) => {
  return (
    <motion.div
      whileHover={{ 
        y: -liftAmount, 
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)' 
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Hover scale effect
export const HoverScale = ({ 
  children, 
  className = '', 
  scale = 1.03,
  ...props 
}: HoverLiftProps & { scale?: number }) => {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Hover glow border effect
export const HoverGlow = ({ 
  children, 
  className = '',
  glowColor = 'hsl(var(--accent) / 0.3)',
  ...props 
}: HoverLiftProps & { glowColor?: string }) => {
  return (
    <motion.div
      whileHover={{ 
        boxShadow: `0 0 20px ${glowColor}`,
        borderColor: 'hsl(var(--accent))'
      }}
      transition={{ duration: 0.3 }}
      className={cn('border transition-colors', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Tap scale effect
export const TapScale = ({ 
  children, 
  className = '',
  ...props 
}: HoverLiftProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Icon spin on hover
export const IconSpin = ({ 
  children, 
  className = '',
  degrees = 15,
  ...props 
}: HoverLiftProps & { degrees?: number }) => {
  return (
    <motion.span
      whileHover={{ rotate: degrees, scale: 1.1 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      className={cn('inline-block', className)}
      {...props}
    >
      {children}
    </motion.span>
  );
};

// Button pulse animation
export const ButtonPulse = ({ 
  children, 
  className = '',
  ...props 
}: HoverLiftProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn('relative', className)}
      {...props}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-accent/20"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {children}
    </motion.div>
  );
};

// Count up animation
interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const CountUp = ({ 
  end, 
  duration = 2, 
  suffix = '', 
  prefix = '',
  className = '' 
}: CountUpProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// 3D tilt effect (CSS-based, lightweight)
export const Tilt3D = ({ 
  children, 
  className = '',
  intensity = 10,
  ...props 
}: HoverLiftProps & { intensity?: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity]);

  const handleMouse = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const xPos = (event.clientX - rect.left) / rect.width - 0.5;
    const yPos = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ 
        rotateX, 
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      transition={{ duration: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Floating animation (for decorative elements)
export const FloatingElement = ({ 
  children, 
  className = '',
  duration = 6,
  yOffset = 10,
  ...props 
}: HoverLiftProps & { duration?: number; yOffset?: number }) => {
  return (
    <motion.div
      animate={{
        y: [-yOffset, yOffset, -yOffset],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Reveal on scroll
interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export const Reveal = ({ 
  children, 
  className = '',
  direction = 'up',
  delay = 0
}: RevealProps) => {
  const directionOffset = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directionOffset[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Text reveal word by word
interface TextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}

export const TextReveal = ({ 
  text, 
  className = '', 
  wordClassName = '',
  delay = 0 
}: TextRevealProps) => {
  const words = text.split(' ');

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.4, 
                delay: delay + i * 0.08 
              }
            },
          }}
          className={cn('inline-block mr-[0.25em]', wordClassName)}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};
