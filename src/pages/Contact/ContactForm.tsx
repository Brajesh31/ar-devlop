import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addContactSubmission } from '@/data/contact';
import { SOCIAL_LINKS } from '@/config/api';
import { Instagram, Linkedin, ArrowUpRight, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { FloatingCircle, GridPattern } from '@/components/ui/DecorativeElements';

const contactSchema = z.object({
  fullName: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  message: z.string().trim().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters'),
});

// X (Twitter) icon
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// WhatsApp icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const socialLinks = [
  { name: 'Instagram', handle: '@Bharat_XR', icon: Instagram, url: SOCIAL_LINKS.instagram, color: 'hover:bg-pink-500/10 hover:border-pink-500/30', iconColor: 'text-pink-500' },
  { name: 'X', handle: '@Bharat_XR', icon: XIcon, url: SOCIAL_LINKS.twitter, color: 'hover:bg-foreground/10 hover:border-foreground/30', iconColor: 'text-foreground' },
  { name: 'LinkedIn', handle: '@Bharat XR', icon: Linkedin, url: SOCIAL_LINKS.linkedin, color: 'hover:bg-blue-500/10 hover:border-blue-500/30', iconColor: 'text-blue-600' },
  { name: 'WhatsApp', handle: 'Bharat XR', icon: WhatsAppIcon, url: SOCIAL_LINKS.whatsapp, color: 'hover:bg-green-500/10 hover:border-green-500/30', iconColor: 'text-green-500' },
];

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = contactSchema.parse(formData);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addContactSubmission({
        fullName: validatedData.fullName,
        email: validatedData.email,
        inquiryType: 'general',
        message: validatedData.message,
      });

      setIsSuccess(true);
      toast({
        title: 'Message sent successfully!',
        description: "We'll get back to you within 24-48 hours.",
      });

      setTimeout(() => {
        setFormData({ fullName: '', email: '', message: '' });
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: 'Something went wrong',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="relative py-12 md:py-16 bg-gradient-to-b from-background via-muted/20 to-muted/40 overflow-hidden">
      {/* Background decorations */}
      <GridPattern className="opacity-30" />
      <FloatingCircle className="top-10 right-10" size={200} color="accent" delay={0} />
      <FloatingCircle className="bottom-20 left-10" size={150} color="success" delay={0.5} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl shadow-accent/5 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Content */}
              <div className="p-6 md:p-10 lg:p-12 bg-gradient-to-br from-accent/5 via-transparent to-success/5 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-success to-accent" />
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-5">
                    <Sparkles className="w-3 h-3" />
                    Let's Connect
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
                    Build Something{' '}
                    <span className="text-accent">Extraordinary</span>{' '}
                    <span className="text-success">Together</span>
                  </h2>
                  
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8">
                    Whether you're hosting an XR event, planning a workshop, or exploring ideas—drop us a message. We're always up for meaningful conversations.
                  </p>

                  {/* Social Links */}
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center gap-3 px-4 py-3 bg-background/50 border border-border/50 rounded-xl transition-all duration-300 ${social.color}`}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <social.icon className={`w-5 h-5 ${social.iconColor}`} />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-muted-foreground block">{social.name}</span>
                          <span className="text-sm font-medium text-foreground truncate block">{social.handle}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Form */}
              <div className="p-6 md:p-10 lg:p-12 relative">
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {/* Name Field */}
                  <div className="relative">
                    <motion.div
                      animate={{ scale: focusedField === 'fullName' ? 1.02 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Your Name
                      </label>
                      <Input
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => setFocusedField(null)}
                        className={`bg-background border-border rounded-lg h-12 transition-all duration-200 ${
                          errors.fullName ? 'border-destructive ring-1 ring-destructive' : ''
                        } ${focusedField === 'fullName' ? 'border-accent ring-1 ring-accent/50' : ''}`}
                      />
                    </motion.div>
                    {errors.fullName && (
                      <motion.p 
                        className="text-xs text-destructive mt-1"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.fullName}
                      </motion.p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <motion.div
                      animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Email Address
                      </label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={`bg-background border-border rounded-lg h-12 transition-all duration-200 ${
                          errors.email ? 'border-destructive ring-1 ring-destructive' : ''
                        } ${focusedField === 'email' ? 'border-accent ring-1 ring-accent/50' : ''}`}
                      />
                    </motion.div>
                    {errors.email && (
                      <motion.p 
                        className="text-xs text-destructive mt-1"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className="relative">
                    <motion.div
                      animate={{ scale: focusedField === 'message' ? 1.02 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Your Message
                      </label>
                      <Textarea
                        name="message"
                        placeholder="Tell us about your project or inquiry..."
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        className={`bg-background border-border rounded-lg resize-none transition-all duration-200 ${
                          errors.message ? 'border-destructive ring-1 ring-destructive' : ''
                        } ${focusedField === 'message' ? 'border-accent ring-1 ring-accent/50' : ''}`}
                      />
                    </motion.div>
                    {errors.message && (
                      <motion.p 
                        className="text-xs text-destructive mt-1"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className={`w-full h-12 rounded-xl font-medium text-base transition-all duration-300 ${
                        isSuccess 
                          ? 'bg-success hover:bg-success text-success-foreground' 
                          : 'bg-accent hover:bg-accent/90 text-accent-foreground'
                      }`}
                    >
                      {isSuccess ? (
                        <motion.span 
                          className="flex items-center gap-2"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Sent Successfully!
                        </motion.span>
                      ) : isSubmitting ? (
                        <motion.span 
                          className="flex items-center gap-2"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                          Sending...
                        </motion.span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                        </span>
                      )}
                    </Button>
                  </motion.div>

                  <p className="text-xs text-center text-muted-foreground">
                    We typically respond within 24-48 hours
                  </p>
                </motion.form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
