import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addPartnershipSubmission } from '@/data/partners';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, Clock, CheckCircle } from 'lucide-react';

const whatHappensNext = [
  {
    icon: Mail,
    title: 'We review your request',
    description: 'Our partnerships team carefully reviews your submission.',
  },
  {
    icon: Clock,
    title: 'Response in 3-5 days',
    description: 'Expect to hear from us within 3-5 business days.',
  },
  {
    icon: CheckCircle,
    title: 'Kickoff call',
    description: 'If there\'s a fit, we schedule a call to discuss next steps.',
    success: true,
  },
];

export const PartnershipForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    role: '',
    email: '',
    partnershipType: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.organization || !formData.email || !formData.partnershipType) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }

      addPartnershipSubmission(formData);

      toast({
        title: 'Partnership Request Submitted!',
        description: 'Thank you for your interest. We will get back to you within 3-5 business days.',
      });

      setFormData({
        name: '',
        organization: '',
        role: '',
        email: '',
        partnershipType: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="partnership-form" className="py-12 md:py-16 bg-gradient-to-br from-secondary/40 via-background to-accent/5 relative overflow-hidden">
      {/* Subtle pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 right-[10%] w-48 h-48 rounded-full bg-accent/10 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-[5%] w-40 h-40 rounded-full bg-success/10 blur-[80px]"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      
      {/* Floating dots */}
      <motion.div
        className="absolute top-32 left-[20%] w-2 h-2 rounded-full bg-accent/40"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-24 right-[25%] w-3 h-3 rounded-full bg-success/30"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Form Column - 60% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-accent"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                Start a Partnership
              </span>
            </motion.div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 tracking-tight">
              Let's Build Something Together
            </h2>
            
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4 bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 md:p-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    required
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:ring-accent/20 transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-foreground">Organization *</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Company or institution"
                    required
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:ring-accent/20 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-foreground">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Your role or title"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:ring-accent/20 transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:ring-accent/20 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="partnershipType" className="text-foreground">Partnership Type *</Label>
                <Select
                  value={formData.partnershipType}
                  onValueChange={(value) => setFormData({ ...formData, partnershipType: value })}
                >
                  <SelectTrigger className="bg-background border-border text-foreground focus:ring-accent/20">
                    <SelectValue placeholder="Select partnership type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="brand">Brand Partnership</SelectItem>
                    <SelectItem value="college">College & University</SelectItem>
                    <SelectItem value="industry">Industry Collaboration</SelectItem>
                    <SelectItem value="government">Government & Institution</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your partnership goals..."
                  rows={3}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:ring-accent/20 resize-none transition-all duration-200"
                />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-8 py-2.5 font-medium transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Partnership Request'}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.form>
          </motion.div>
          
          {/* What Happens Next Column - 40% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              What Happens Next
            </h3>
            
            <div className="space-y-4">
              {whatHappensNext.map((item, index) => (
                <motion.div 
                  key={item.title} 
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {/* Connector line */}
                  <div className="relative flex flex-col items-center">
                    <motion.div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        item.success 
                          ? 'bg-success/10' 
                          : 'bg-secondary'
                      }`}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <item.icon className={`w-5 h-5 ${
                        item.success ? 'text-success' : 'text-accent'
                      }`} strokeWidth={1.5} />
                    </motion.div>
                    {index < whatHappensNext.length - 1 && (
                      <div className="w-0.5 h-6 bg-border mt-2" />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <h4 className="font-medium text-foreground text-sm">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Email note */}
            <motion.div 
              className="mt-6 p-4 bg-card border border-border rounded-xl"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-muted-foreground">
                For urgent inquiries, reach out at{' '}
                <a 
                  href="mailto:partnerships@bharatxr.com" 
                  className="text-accent hover:underline font-medium"
                >
                  partnerships@bharatxr.com
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
