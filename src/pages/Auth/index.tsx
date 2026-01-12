import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Award, Users, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTransition } from '@/components/layout/PageTransition';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '' }
  });

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup') {
      setMode('signup');
    } else if (modeParam === 'login') {
      setMode('login');
    }
  }, [searchParams]);

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      navigate('/');
    } catch {
      toast({
        title: 'Sign in failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Account created!',
        description: 'Welcome to Bharat XR. Please check your email to verify your account.',
      });
      navigate('/');
    } catch {
      toast({
        title: 'Sign up failed',
        description: 'An error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const trustSignals = [
    { icon: Calendar, text: 'Workshops & Events' },
    { icon: Award, text: 'Hackathons' },
    { icon: Users, text: 'Community Access' },
    { icon: Sparkles, text: 'XR Resources' }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        {/* Brand Panel - Left Side (Desktop) / Top (Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-10 flex-col justify-between relative overflow-hidden">
          {/* Decorative elements */}
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-2xl"
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 3 }}
          />
          
          <div className="relative z-10">
            {/* Logo */}
            <Link to="/" className="inline-block">
              <motion.h1 
                className="text-2xl font-bold text-foreground"
                whileHover={{ scale: 1.02 }}
              >
                Bharat<span className="text-accent">XR</span>
              </motion.h1>
            </Link>
          </div>

          <motion.div 
            className="relative z-10 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Building India's XR Ecosystem
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Join India's largest community of XR creators, developers, and educators. 
                Access workshops, participate in hackathons, and shape the future of immersive technology.
              </p>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3">
              {trustSignals.map((signal, index) => (
                <motion.div 
                  key={signal.text}
                  className="flex items-center gap-3 text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <signal.icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium">{signal.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="relative z-10">
            <p className="text-sm text-muted-foreground">
              © 2026 Bharat XR. All rights reserved.
            </p>
          </div>
        </div>

        {/* Auth Form Panel - Right Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link to="/" className="inline-block">
                <h1 className="text-2xl font-bold text-foreground">
                  Bharat<span className="text-accent">XR</span>
                </h1>
              </Link>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      Welcome back
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Sign in to continue to Bharat XR
                    </p>
                  </div>

                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Email</FormLabel>
                            <FormControl>
                              <motion.div
                                animate={{ scale: focusedField === 'email' ? 1.01 : 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Input 
                                  type="email" 
                                  placeholder="you@example.com" 
                                  className={`h-11 transition-all duration-200 ${focusedField === 'email' ? 'border-accent ring-1 ring-accent/50' : ''}`}
                                  onFocus={() => setFocusedField('email')}
                                  onBlur={() => setFocusedField(null)}
                                  {...field} 
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel className="text-sm">Password</FormLabel>
                              <button 
                                type="button"
                                className="text-xs text-accent hover:underline"
                              >
                                Forgot password?
                              </button>
                            </div>
                            <FormControl>
                              <motion.div 
                                className="relative"
                                animate={{ scale: focusedField === 'password' ? 1.01 : 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Input 
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="••••••••"
                                  className={`h-11 pr-11 transition-all duration-200 ${focusedField === 'password' ? 'border-accent ring-1 ring-accent/50' : ''}`}
                                  onFocus={() => setFocusedField('password')}
                                  onBlur={() => setFocusedField(null)}
                                  {...field} 
                                />
                                <motion.button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </motion.button>
                              </motion.div>
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
                          className="w-full h-11 text-sm bg-accent hover:bg-accent/90 group"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Signing in...' : (
                            <>
                              Sign In
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>

                  <p className="mt-6 text-center text-muted-foreground text-sm">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setMode('signup')}
                      className="text-accent font-medium hover:underline"
                    >
                      Create one
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      Create your account
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Join the Bharat XR ecosystem
                    </p>
                  </div>

                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your name" 
                                className="h-11"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="you@example.com" 
                                className="h-11"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="Min. 8 characters"
                                  className="h-11 pr-11"
                                  {...field} 
                                />
                                <motion.button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </motion.button>
                              </div>
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
                          className="w-full h-11 text-sm bg-accent hover:bg-accent/90 group"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Creating account...' : (
                            <>
                              Create Account
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>

                  <p className="mt-6 text-center text-muted-foreground text-sm">
                    Already have an account?{' '}
                    <button 
                      onClick={() => setMode('login')}
                      className="text-accent font-medium hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security note */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Your data is secure. We never share your information.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AuthPage;
