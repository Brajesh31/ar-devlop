import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Rocket } from 'lucide-react';

export const ResourcesCTA = () => {
  return (
    <section className="py-10 md:py-12 bg-background">
      <div className="container-wide">
        <motion.div 
          className="text-center max-w-xl mx-auto relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative elements */}
          <motion.div 
            className="absolute -top-10 right-1/4 w-16 h-16 bg-primary/5 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 relative">
            Start Learning with Bharat XR
          </h2>
          <p className="text-muted-foreground mb-6 relative">
            Put your learning into practice. Join our events and hackathons 
            to build real XR projects with community support.
          </p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/events">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6 group">
                  <Calendar className="w-4 h-4 mr-2" />
                  Explore Events
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/hackathons">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" className="rounded-full px-6 hover:border-accent/50 group">
                  <Rocket className="w-4 h-4 mr-2" />
                  Join a Hackathon
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
