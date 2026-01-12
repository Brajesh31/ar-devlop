import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supportCategories, supportInfo, addSupportTicket } from '@/data/support';
import { User, Calendar, Award, Handshake, Clock, AlertCircle, ArrowRight, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GradientOrb } from '@/components/ui/DecorativeElements';

const ticketSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address').max(255),
  category: z.string().min(1, 'Please select a category'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(1000)
});

type TicketFormData = z.infer<typeof ticketSchema>;

const categoryIcons: Record<string, React.ElementType> = {
  account: User,
  events: Calendar,
  hackathons: Award,
  partnerships: Handshake
};

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

const HelpPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: '',
      email: '',
      category: '',
      message: ''
    }
  });

  const onSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addSupportTicket({
        name: data.name,
        email: data.email,
        category: data.category,
        message: data.message
      });
      toast({
        title: 'Ticket submitted!',
        description: 'We\'ll get back to you within 24-48 hours.',
      });
      form.reset();
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'Please try again or email us directly.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-x-clip">
        <SEOHead {...seoConfig.help} />
        {/* Decorative Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb 
            className="absolute -top-40 -left-40 w-80 h-80 bg-accent/5 blur-3xl" 
          />
          <GradientOrb 
            className="absolute bottom-1/3 -right-20 w-60 h-60 bg-primary/5 blur-3xl" 
          />
        </div>

        <Header />
        <main className="py-10 md:py-12 relative z-10">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <motion.div 
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Help & Support
                </h1>
                <p className="text-muted-foreground text-sm">
                  We're here to help. Choose a category below or submit a support ticket.
                </p>
              </motion.div>

              {/* Support Categories */}
              <motion.div 
                className="mb-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <h2 className="text-base font-semibold text-foreground mb-4 text-center">
                  What do you need help with?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {supportCategories.map((category, index) => {
                    const Icon = categoryIcons[category.id] || User;
                    return (
                      <motion.button
                        key={category.id}
                        onClick={() => {
                          form.setValue('category', category.id);
                          const formElement = document.getElementById('support-form');
                          formElement?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="p-4 bg-card border border-border rounded-xl transition-all duration-300 text-left group hover:border-accent/50 hover:shadow-md"
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                      >
                        <motion.div 
                          className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon className="w-4 h-4 text-accent" />
                        </motion.div>
                        <h3 className="font-medium text-foreground text-sm mb-1 group-hover:text-accent transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Support Ticket Form */}
              <motion.div 
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div id="support-form" className="max-w-xl mx-auto">
                  <h2 className="text-base font-semibold text-foreground mb-4 text-center">
                    Submit a Support Ticket
                  </h2>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Your Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Full name" className="h-10" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Email Address</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="you@example.com" className="h-10" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Category</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select issue type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {supportCategories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Describe your issue</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please provide as much detail as possible..." 
                                  className="min-h-[100px] resize-none"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Button 
                            type="submit" 
                            className="w-full h-10 bg-accent hover:bg-accent/90 group" 
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Submitting...' : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Submit Ticket
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </form>
                    </Form>
                  </div>
                </div>
              </motion.div>

              {/* Response Timeline */}
              <motion.div 
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-secondary/50 rounded-xl p-5">
                  <h2 className="text-base font-semibold text-foreground mb-4 text-center">
                    What to Expect
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground text-sm mb-0.5">Response Time</h3>
                        <p className="text-xs text-muted-foreground">
                          We typically respond within {supportInfo.responseTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground text-sm mb-0.5">Working Hours</h3>
                        <p className="text-xs text-muted-foreground">
                          {supportInfo.workingHours}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Urgent Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-foreground text-sm mb-1">Urgent Matters</h3>
                      <p className="text-xs text-muted-foreground">
                        {supportInfo.urgentNote} You can also reach us directly at{' '}
                        <a href="mailto:support@bharatxr.co" className="text-accent hover:underline">
                          support@bharatxr.co
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Link to FAQs */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-muted-foreground text-sm">
                  Looking for quick answers?{' '}
                  <Link to="/faqs" className="text-accent hover:underline inline-flex items-center gap-1">
                    Check our FAQs
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default HelpPage;
