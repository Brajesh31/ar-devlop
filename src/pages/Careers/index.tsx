import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import { Button } from '@/components/ui/button';
import { jobListings, whyWorkWithUs, hiringProcess } from '@/data/careers';
import { Briefcase, MapPin, ArrowRight, GraduationCap, Heart, Rocket, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GradientOrb } from '@/components/ui/DecorativeElements';

const typeColors: Record<string, string> = {
  'full-time': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'part-time': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'internship': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'volunteer': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
};

const whyIcons = [GraduationCap, Rocket, Heart];

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

const CareersPage = () => {
  const activeJobs = jobListings.filter(job => job.isActive);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-x-clip">
        <SEOHead {...seoConfig.careers} />
        {/* Decorative Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb 
            className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 blur-3xl" 
          />
          <GradientOrb 
            className="absolute bottom-1/4 -left-20 w-60 h-60 bg-primary/5 blur-3xl" 
          />
        </div>

        <Header />
        <main className="relative z-10">
          {/* Hero */}
          <motion.section 
            className="py-10 md:py-12 bg-background"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="container-wide">
              <motion.div 
                className="max-w-3xl mx-auto text-center"
                variants={itemVariants}
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Careers at <span className="text-accent">Bharat XR</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Join us in building India's XR ecosystem. Work with passionate people, 
                  make a real impact, and shape the future of immersive technology.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Why Work With Us */}
          <section className="py-10 bg-secondary/30">
            <div className="container-wide">
              <motion.h2 
                className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Why Work With Us
              </motion.h2>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {whyWorkWithUs.map((item, index) => {
                  const Icon = whyIcons[index] || GraduationCap;
                  return (
                    <motion.div 
                      key={item.title}
                      className="text-center group"
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                    >
                      <motion.div 
                        className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="w-6 h-6 text-accent" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* Open Roles */}
          <section className="py-10 bg-background">
            <div className="container-wide">
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Open Roles
                </h2>
                <p className="text-muted-foreground text-sm">
                  {activeJobs.length} {activeJobs.length === 1 ? 'position' : 'positions'} available
                </p>
              </motion.div>

              <div className="max-w-3xl mx-auto space-y-3">
                {activeJobs.map((job, index) => (
                  <motion.div 
                    key={job.id}
                    className="p-5 bg-card border border-border rounded-xl transition-all duration-300 hover:border-accent/50 hover:shadow-md group"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                            {job.title}
                          </h3>
                          <Badge className={`${typeColors[job.type]} text-xs`}>
                            {job.type.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </div>
                        <p className="text-muted-foreground text-sm">{job.description}</p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="shrink-0 hover:border-accent/50 group/btn"
                          onClick={() => window.open(`mailto:careers@bharatxr.co?subject=Application for ${job.title}`, '_blank')}
                        >
                          Apply 
                          <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Internships & Volunteering */}
          <section className="py-10 bg-secondary/30">
            <div className="container-wide">
              <div className="max-w-3xl mx-auto">
                <motion.div 
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Students & Volunteers
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Looking to get started in XR? We have opportunities for students and community members.
                  </p>
                </motion.div>

                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="p-5 bg-card border border-border rounded-xl transition-all duration-300 hover:border-accent/50 hover:shadow-md group"
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Briefcase className="w-7 h-7 text-accent mb-3" />
                    </motion.div>
                    <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      Internships
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Gain hands-on experience working on real XR projects. Learn from industry experts 
                      and build your portfolio while contributing to India's XR ecosystem.
                    </p>
                    <Button variant="outline" size="sm" asChild className="hover:border-accent/50">
                      <a href="mailto:careers@bharatxr.co?subject=Internship Inquiry">
                        Inquire About Internships
                      </a>
                    </Button>
                  </motion.div>

                  <motion.div 
                    className="p-5 bg-card border border-border rounded-xl transition-all duration-300 hover:border-accent/50 hover:shadow-md group"
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Heart className="w-7 h-7 text-accent mb-3" />
                    </motion.div>
                    <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      Campus Ambassadors
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Represent Bharat XR at your college. Organize workshops, build local communities, 
                      and help students discover the world of XR.
                    </p>
                    <Button variant="outline" size="sm" asChild className="hover:border-accent/50">
                      <a href="mailto:campus@bharatxr.co?subject=Campus Ambassador Application">
                        Become an Ambassador
                      </a>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Hiring Process */}
          <section className="py-10 bg-background">
            <div className="container-wide">
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Our Hiring Process
                </h2>
                <p className="text-muted-foreground text-sm">
                  Simple, transparent, and respectful of your time.
                </p>
              </motion.div>

              <div className="max-w-3xl mx-auto">
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {hiringProcess.map((step, index) => (
                    <motion.div 
                      key={step.step}
                      className="text-center"
                      variants={itemVariants}
                    >
                      <motion.div 
                        className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-3 text-base font-bold"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15, type: "spring", stiffness: 300 }}
                      >
                        {step.step}
                      </motion.div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">{step.title}</h3>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-10 bg-secondary/30">
            <div className="container-wide">
              <motion.div 
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-3">
                  Don't see the right role?
                </h2>
                <p className="text-muted-foreground text-sm mb-5">
                  We're always looking for talented people. Send us your resume and let us know how 
                  you'd like to contribute to Bharat XR.
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button asChild className="bg-accent hover:bg-accent/90 rounded-full px-6 group">
                    <a href="mailto:careers@bharatxr.co?subject=General Application">
                      Send Your Resume
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CareersPage;
