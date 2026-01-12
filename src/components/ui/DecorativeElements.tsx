import { motion } from 'framer-motion';

// Floating circles with gradient
export const FloatingCircle = ({ 
  className = '', 
  size = 100, 
  color = 'accent',
  delay = 0 
}: { 
  className?: string; 
  size?: number; 
  color?: 'accent' | 'success' | 'muted';
  delay?: number;
}) => {
  const colorMap = {
    accent: 'bg-accent/10',
    success: 'bg-success/10',
    muted: 'bg-muted-foreground/5'
  };

  return (
    <motion.div
      className={`absolute rounded-full blur-2xl ${colorMap[color]} ${className}`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -10, 0],
      }}
      transition={{ 
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
      }}
    />
  );
};

// Dot grid pattern
export const DotPattern = ({ className = '' }: { className?: string }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    <svg className="absolute w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dotPattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-foreground" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotPattern)" />
    </svg>
  </div>
);

// Grid pattern
export const GridPattern = ({ className = '' }: { className?: string }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    <svg className="absolute w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="gridPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gridPattern)" />
    </svg>
  </div>
);

// Animated gradient orb
export const GradientOrb = ({ 
  className = '', 
  size = 300,
  colors = ['accent', 'success'] 
}: { 
  className?: string; 
  size?: number;
  colors?: string[];
}) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
    style={{ 
      width: size, 
      height: size,
      background: `radial-gradient(circle, hsl(var(--${colors[0]})) 0%, hsl(var(--${colors[1]})) 100%)`
    }}
    animate={{ 
      scale: [1, 1.1, 1],
      rotate: [0, 180, 360]
    }}
    transition={{ 
      duration: 20, 
      repeat: Infinity, 
      ease: "linear" 
    }}
  />
);

// Decorative line
export const DecorativeLine = ({ 
  className = '', 
  direction = 'horizontal' 
}: { 
  className?: string; 
  direction?: 'horizontal' | 'vertical';
}) => (
  <motion.div
    className={`bg-gradient-to-r from-transparent via-accent/30 to-transparent ${
      direction === 'horizontal' ? 'h-px w-full' : 'w-px h-full'
    } ${className}`}
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  />
);

// Floating geometric shapes
export const FloatingShapes = ({ className = '' }: { className?: string }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    {/* Triangle */}
    <motion.div
      className="absolute top-1/4 right-[15%] w-6 h-6 border-2 border-accent/20 rotate-45"
      animate={{ y: [0, -15, 0], rotate: [45, 90, 45] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Circle outline */}
    <motion.div
      className="absolute bottom-1/3 left-[10%] w-8 h-8 border-2 border-success/20 rounded-full"
      animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
    {/* Small dot */}
    <motion.div
      className="absolute top-1/2 right-[8%] w-3 h-3 bg-accent/30 rounded-full"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />
    {/* Plus sign */}
    <motion.div
      className="absolute bottom-1/4 right-[20%] text-success/20 text-2xl font-light"
      animate={{ rotate: [0, 90, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    >
      +
    </motion.div>
  </div>
);

// Section divider with curve
export const CurvedDivider = ({ 
  className = '', 
  flip = false 
}: { 
  className?: string; 
  flip?: boolean;
}) => (
  <div className={`absolute left-0 right-0 h-16 overflow-hidden pointer-events-none ${flip ? 'rotate-180' : ''} ${className}`}>
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="absolute w-full h-full"
    >
      <path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        className="fill-background"
        opacity=".25"
      />
      <path
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
        className="fill-background"
        opacity=".5"
      />
      <path
        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,googletag172.46-45.71,248.8-84.81V0Z"
        className="fill-background"
      />
    </svg>
  </div>
);

// Connecting dots animation (for between sections)
export const ConnectingDots = ({ className = '' }: { className?: string }) => (
  <div className={`flex justify-center items-center gap-2 py-4 ${className}`}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-1.5 h-1.5 bg-accent/40 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </div>
);
