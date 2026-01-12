import { motion } from 'framer-motion';
import { xrTools } from '@/data/resources';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { ExternalLink } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const ToolsSection = () => {
  // Group tools by category
  const groupedTools = xrTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof xrTools>);

  return (
    <section className="py-8 md:py-10 bg-background">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionBadge>XR Tools & Platforms</SectionBadge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 mb-6">
            Build with the Right Tools
          </h2>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {Object.entries(groupedTools).map(([category, tools], categoryIndex) => (
            <motion.div 
              key={category}
              variants={itemVariants}
            >
              <h3 className="text-base font-semibold text-foreground mb-3 pb-2 border-b border-border">
                {category}
              </h3>
              <div className="space-y-3">
                {tools.map((tool, toolIndex) => (
                  <motion.a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + toolIndex * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <h4 className="font-medium text-foreground text-sm group-hover:text-accent transition-colors flex items-center gap-2">
                      {tool.name}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {tool.description}
                    </p>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
