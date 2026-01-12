import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Calendar } from 'lucide-react';

export const ShowcaseCTA = () => {
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
            className="absolute -top-10 left-1/4 w-16 h-16 bg-accent/5 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 relative">
            Build with Bharat XR
          </h2>
          <p className="text-muted-foreground mb-6 relative">
            Ready to create something amazing? Join our next hackathon or event and 
            get your project featured here.
          </p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/hackathons">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6 group">
                  <Rocket className="w-4 h-4 mr-2" />
                  Join a Hackathon
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/events">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" className="rounded-full px-6 hover:border-accent/50 group">
                  <Calendar className="w-4 h-4 mr-2" />
                  Explore Events
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
