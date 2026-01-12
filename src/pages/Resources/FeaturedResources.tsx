import { motion } from 'framer-motion';
import { featuredResources } from '@/data/resources';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { ExternalLink, ArrowRight } from 'lucide-react';

const typeLabels: Record<string, { label: string; color: string }> = {
  guide: { label: 'Guide', color: 'bg-success/10 text-success' },
  tool: { label: 'Tool', color: 'bg-accent/10 text-accent' },
  video: { label: 'Video', color: 'bg-purple-500/10 text-purple-600' },
  doc: { label: 'Documentation', color: 'bg-blue-500/10 text-blue-600' },
  course: { label: 'Course', color: 'bg-amber-500/10 text-amber-600' },
};

export const FeaturedResources = () => {
  return (
    <section className="py-8 md:py-10 bg-secondary/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionBadge>Featured Resources</SectionBadge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 mb-6">
            Recommended by the Community
          </h2>
        </motion.div>
        
        <div className="space-y-3">
          {featuredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -2 }}
            >
              <Card className="bg-card border border-border transition-all duration-300 hover:border-accent/50 hover:shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${typeLabels[resource.type].color} border-0 text-xs`}>
                        {typeLabels[resource.type].label}
                      </Badge>
                      {resource.source === 'external' && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" /> External
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground text-base mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {resource.description}
                    </p>
                  </div>
                  <motion.a 
                    href={resource.url}
                    target={resource.source === 'external' ? '_blank' : undefined}
                    rel={resource.source === 'external' ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center text-accent font-medium text-sm hover:underline whitespace-nowrap group"
                    whileHover={{ x: 4 }}
                  >
                    Access Resource
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
