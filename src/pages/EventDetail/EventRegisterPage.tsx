import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { publicService } from '@/services/api';

const EventRegisterPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State - ADDED 'dob'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    gender: '',
    dob: '', // <--- Added this field
    city: '',
    organization: '',
    role: ''
  });

  // 1. Fetch Event Info
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const res = await publicService.events.getById(id);
        if (res.status === 'success') {
          setEvent(res.data);
        } else {
          navigate('/events');
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setIsSubmitting(true);

    try {
      // Map form state to API payload keys - ADDED 'dob'
      const payload = {
        event_id: event.event_id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        contact_no: formData.contactNo,
        gender: formData.gender,
        dob: formData.dob, // <--- Added this to payload
        city: formData.city,
        organization: formData.organization,
        role: formData.role
      };

      const res = await publicService.events.register(payload);

      if (res.status === 'success') {
        toast({
          title: 'Registration Successful!',
          description: `You have successfully registered for ${event.title}.`,
          className: "bg-green-50 text-green-900 border-green-200"
        });
        // Redirect to Event Detail page after success
        setTimeout(() => navigate(`/events/${event.event_id}`), 1500);
      } else {
        throw new Error(res.message);
      }

    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || error.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35]" />
        </div>
    );
  }

  if (!event) return null;

  return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container-wide max-w-2xl">
            {/* Back Link */}
            <Link
                to={`/events/${event.event_id}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Event</span>
            </Link>

            <Card className="border-border shadow-lg">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-2xl">Register for {event.title}</CardTitle>
                <p className="text-muted-foreground">Please fill in your details accurately. This data will be used for certification.</p>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactNo">Phone Number *</Label>
                      <Input
                          id="contactNo"
                          name="contactNo"
                          type="tel"
                          value={formData.contactNo}
                          onChange={handleChange}
                          required
                          placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select onValueChange={(val) => handleSelectChange('gender', val)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* NEW DOB FIELD ADDED HERE */}
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth *</Label>
                      <Input
                          id="dob"
                          name="dob"
                          type="date"
                          value={formData.dob}
                          onChange={handleChange}
                          required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="city">Current City *</Label>
                      <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          placeholder="e.g. New Delhi"
                      />
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization / College *</Label>
                      <Input
                          id="organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          required
                          placeholder="University or Company Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Job Title / Role *</Label>
                      <Input
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Student, Developer, Designer"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-semibold"
                        disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                          </>
                      ) : (
                          'Complete Registration'
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      By registering, you agree to receive updates about this event.
                    </p>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default EventRegisterPage;