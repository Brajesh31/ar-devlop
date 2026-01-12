import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { getHackathonById, Hackathon } from '@/data/hackathons';

const sections = ['about', 'themes', 'mentors', 'jury', 'schedule', 'prizes', 'partners', 'faq'];

const HackathonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeSection, setActiveSection] = useState('about');
  const hackathon = id ? getHackathonById(id) : undefined;

  useEffect(() => {
    const handleScroll = () => {
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!hackathon) {
    return <Navigate to="/hackathons" replace />;
  }

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const daysUntilDeadline = differenceInDays(new Date(hackathon.registrationDeadline), new Date());
  const statusStyles = {
    live: 'bg-success text-success-foreground',
    upcoming: 'bg-accent text-accent-foreground',
    completed: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="container-wide py-8">
          <Link to="/hackathons" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hackathons</span>
          </Link>
          
          <div className="aspect-[21/9] md:aspect-[3/1] bg-gradient-to-br from-accent/20 via-secondary to-success/20 rounded-xl overflow-hidden mb-8">
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl opacity-30">🚀</span>
            </div>
          </div>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            {hackathon.title}
          </motion.h1>
          <p className="text-lg text-muted-foreground mb-6">{hackathon.description}</p>
          
          <div className="flex flex-wrap gap-2">
            <Badge className={cn('font-medium', statusStyles[hackathon.status])}>
              {hackathon.status === 'live' ? 'Live' : hackathon.status === 'upcoming' ? 'Upcoming' : 'Closed'}
            </Badge>
            <Badge variant="outline">{hackathon.mode === 'offline' ? 'In-Person' : hackathon.mode}</Badge>
            <Badge variant="outline">{hackathon.teamSizeRange || hackathon.teamSize}</Badge>
            <Badge variant="outline">{hackathon.fee === 'free' ? 'Free' : `₹${hackathon.feeAmount}`}</Badge>
          </div>
        </section>

        {/* Sticky Nav */}
        <nav className="sticky top-16 z-40 bg-background border-b border-border">
          <div className="container-wide overflow-x-auto">
            <div className="flex gap-1 py-2">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors',
                    activeSection === section ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="container-wide py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <section id="about">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <div className="prose prose-neutral max-w-none">
                  {hackathon.longDescription.split('\n\n').map((p, i) => <p key={i} className="text-muted-foreground mb-4">{p}</p>)}
                </div>
              </section>

              {/* Themes */}
              <section id="themes">
                <h2 className="text-2xl font-bold mb-4">Themes & Focus Areas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hackathon.themes.map((theme) => (
                    <Card key={theme.id}><CardContent className="p-4">
                      <div className="text-3xl mb-2">{theme.icon}</div>
                      <h3 className="font-semibold mb-1">{theme.title}</h3>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                    </CardContent></Card>
                  ))}
                </div>
              </section>

              {/* Mentors */}
              <section id="mentors">
                <h2 className="text-2xl font-bold mb-4">Mentors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hackathon.mentors.map((m) => (
                    <Card key={m.id}><CardContent className="p-4 text-center">
                      <div className="w-16 h-16 bg-secondary rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">👤</div>
                      <h3 className="font-semibold text-sm">{m.name}</h3>
                      <p className="text-xs text-muted-foreground">{m.role}</p>
                      <p className="text-xs text-accent">{m.organization}</p>
                    </CardContent></Card>
                  ))}
                </div>
              </section>

              {/* Jury */}
              <section id="jury">
                <h2 className="text-2xl font-bold mb-4">Jury Panel</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hackathon.jury.map((j) => (
                    <Card key={j.id}><CardContent className="p-4 text-center">
                      <div className="w-16 h-16 bg-secondary rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">👤</div>
                      <h3 className="font-semibold text-sm">{j.name}</h3>
                      <p className="text-xs text-muted-foreground">{j.role}</p>
                      <p className="text-xs text-accent">{j.organization}</p>
                    </CardContent></Card>
                  ))}
                </div>
              </section>

              {/* Schedule */}
              <section id="schedule">
                <h2 className="text-2xl font-bold mb-4">Schedule</h2>
                <div className="space-y-4">
                  {hackathon.timeline.map((item, i) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-accent rounded-full" />
                        {i < hackathon.timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                      </div>
                      <div className="pb-6">
                        <p className="text-sm text-accent font-medium">{format(new Date(item.date), 'MMM d, yyyy')}</p>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Prizes */}
              <section id="prizes">
                <h2 className="text-2xl font-bold mb-4">Rewards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hackathon.prizes.map((p) => (
                    <Card key={p.id}><CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">{p.position}</p>
                      <p className="text-2xl font-bold text-accent">{p.amount}</p>
                      <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                    </CardContent></Card>
                  ))}
                </div>
              </section>

              {/* Partners */}
              <section id="partners">
                <h2 className="text-2xl font-bold mb-4">Partners</h2>
                <div className="flex flex-wrap gap-4">
                  {hackathon.partners.map((p) => (
                    <Badge key={p.id} variant="outline" className="py-2 px-4">{p.name}</Badge>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section id="faq">
                <h2 className="text-2xl font-bold mb-4">FAQs</h2>
                <Accordion type="single" collapsible className="w-full">
                  {hackathon.faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">{hackathon.title}</h3>
                    <div className="space-y-3 text-sm mb-6">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span>Ends {format(new Date(hackathon.endDate), 'MMM d, yyyy')}</span></div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /><span>{hackathon.location}</span></div>
                      <div className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground" /><span>{hackathon.participants?.toLocaleString() || '0'}+ participants</span></div>
                    </div>
                    {hackathon.status !== 'completed' && daysUntilDeadline > 0 && (
                      <div className="bg-secondary rounded-lg p-3 mb-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-accent"><Clock className="w-4 h-4" /><span className="font-bold">{daysUntilDeadline} days left</span></div>
                        <p className="text-xs text-muted-foreground">to register</p>
                      </div>
                    )}
                    <p className="text-lg font-bold text-center mb-4">{hackathon.fee === 'free' ? 'Free Entry' : `₹${hackathon.feeAmount}`}</p>
                    <Button className="w-full" size="lg" disabled={hackathon.status === 'completed'}>
                      {hackathon.status === 'completed' ? 'Registration Closed' : 'Register Now'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HackathonDetailPage;
