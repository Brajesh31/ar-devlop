import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/PageTransition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
        {/* Decorative background elements */}
        <motion.div 
          className="absolute top-1/4 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 3 }}
        />
        
        <motion.div 
          className="text-center px-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated 404 */}
          <motion.div
            className="mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.h1 
              className="text-8xl md:text-9xl font-bold text-foreground/10"
              animate={{ 
                textShadow: [
                  "0 0 0px hsl(var(--accent))",
                  "0 0 20px hsl(var(--accent) / 0.3)",
                  "0 0 0px hsl(var(--accent))"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              404
            </motion.h1>
          </motion.div>
          
          <motion.h2 
            className="text-xl md:text-2xl font-semibold text-foreground mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Oops! Page not found
          </motion.h2>
          
          <motion.p 
            className="text-muted-foreground mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button asChild className="bg-accent hover:bg-accent/90 rounded-full px-6 group">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                className="rounded-full px-6 hover:border-accent/50 group"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Go Back
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
