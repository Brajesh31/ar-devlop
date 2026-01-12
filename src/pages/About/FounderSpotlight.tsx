import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react';

export const FounderSpotlight = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState('');
  const quote = "I believe every Indian student deserves access to cutting-edge XR technology. Our mission is to democratize immersive tech education and create the next generation of XR innovators.";
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const contentY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= quote.length) {
        setDisplayedText(quote.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/in/chhavigarg', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/chhavigarg', label: 'Twitter' },
    { icon: Mail, href: 'mailto:chhavi@bharatxr.co', label: 'Email' },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background elements - using accent/success colors */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container-narrow relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Founder Image */}
          <motion.div 
            style={{ y: imageY }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Decorative frame - accent/success gradient */}
              <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 via-success/10 to-accent/20 rounded-3xl blur-xl" />
              
              {/* Image container with clip-path */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-accent/10 to-success/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Placeholder with gradient - replace with actual image */}
                  <div className="w-full h-full bg-gradient-to-br from-accent/10 via-background to-success/10 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-accent to-success flex items-center justify-center mb-4">
                        <span className="text-4xl font-bold text-white">CG</span>
                      </div>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-sm text-muted-foreground"
                      >
                        Founder & CEO
                      </motion.p>
                    </div>
                  </div>
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -right-4 top-8 bg-card border border-border rounded-xl px-4 py-2 shadow-lg"
              >
                <div className="text-xs text-muted-foreground">Founded</div>
                <div className="text-lg font-bold text-accent">2022</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div style={{ y: contentY }} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Meet the Founder
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">
                Chhavi Garg
              </h2>
              <p className="text-lg text-accent font-medium">Founder & CEO, Bharat XR</p>
            </motion.div>

            {/* Quote with typewriter effect */}
            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative pl-6 border-l-2 border-accent"
            >
              <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed min-h-[120px]">
                "{displayedText}"
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-5 bg-accent ml-1"
                />
              </p>
            </motion.blockquote>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground"
            >
              A passionate advocate for immersive technology education, Chhavi founded Bharat XR 
              to bridge the gap between XR innovation and Indian students. Under her leadership, 
              the community has grown to 90,000+ members across 500+ colleges.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4"
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </motion.a>
              ))}
              
              <motion.a
                href="mailto:chhavi@bharatxr.co"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="ml-2 inline-flex items-center gap-2 text-accent hover:underline"
              >
                <span>chhavi@bharatxr.co</span>
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};