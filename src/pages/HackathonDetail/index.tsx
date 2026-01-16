import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Users, Clock,
  Trophy, Lightbulb, Shield, HelpCircle
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { getHackathonById } from '@/data/hackathons';

const sections = [
  { id: 'about', label: 'About', icon: HelpCircle },
  { id: 'themes', label: 'Themes', icon: Lightbulb },
  { id: 'mentors', label: 'Mentors', icon: Users },
  { id: 'schedule', label: 'Schedule', icon: Clock },
  { id: 'prizes', label: 'Prizes', icon: Trophy },
  { id: 'faq', label: 'FAQs', icon: Shield }
];

const HackathonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeSection, setActiveSection] = useState('about');
  const hackathon = id ? getHackathonById(id) : undefined;

  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 100, damping: 30 });
  const yHero = useTransform(smoothY, [0, 500], [0, 200]);

  useEffect(() => {
    const handleScroll = () => {
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!hackathon) return <Navigate to="/hackathons" replace />;

  const daysUntilDeadline = differenceInDays(new Date(hackathon.registrationDeadline), new Date());

  const statusStyles = {
    live: 'bg-emerald-500 text-white animate-pulse',
    upcoming: 'bg-blue-600 text-white',
    completed: 'bg-slate-200 text-slate-500',
  };

  return (
      <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-600">
        <Header />

        {/* PT-32: Ensures Safe Zone from Navbar */}
        <main className="pt-32 pb-0">

          {/* --- LAYER 0: THE SPATIAL HERO --- */}
          <section className="container-wide pb-8 relative z-10">
            <Link to="/hackathons" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#FF6B35] mb-6 transition-colors group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Matrix</span>
            </Link>

            {/* Chromatic Parallax Banner */}
            <div className="relative aspect-[21/9] md:aspect-[3/1] bg-gradient-to-br from-[#3B82F6]/10 via-[#FBBF24]/10 to-[#10B981]/10 rounded-[32px] overflow-hidden mb-8 border border-slate-100">
              <motion.div style={{ y: yHero }} className="absolute inset-0 flex items-center justify-center">
                <span className="text-9xl filter saturate-50 opacity-20 transform scale-150">🚀</span>
              </motion.div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.05),transparent)] mix-blend-overlay" />
            </div>

            <div className="max-w-4xl">
              <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6"
              >
                {hackathon.title}
              </motion.h1>

              <p className="text-lg md:text-2xl text-slate-500 font-bold tracking-tight mb-8 max-w-3xl leading-relaxed">
                {hackathon.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge className={cn('px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest', statusStyles[hackathon.status])}>
                  {hackathon.status}
                </Badge>
                <Badge variant="outline" className="px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border-slate-200 text-slate-500">
                  {hackathon.mode}
                </Badge>
                <Badge variant="outline" className="px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border-slate-200 text-slate-500">
                  {hackathon.teamSizeRange || hackathon.teamSize}
                </Badge>
              </div>
            </div>
          </section>

          {/* --- LAYER 1: STICKY GLASS NAV --- */}
          <nav className="sticky top-[70px] z-[50] bg-white/60 backdrop-blur-2xl border-b border-slate-100 transition-all duration-300">
            <div className="container-wide px-4 md:px-8">
              <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className={cn(
                            'flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-500 whitespace-nowrap',
                            activeSection === section.id
                                ? 'bg-slate-900 text-white shadow-lg scale-105'
                                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                        )}
                    >
                      <section.icon size={12} />
                      {section.label}
                    </button>
                ))}
              </div>
            </div>
          </nav>

          {/* --- LAYER 2: BENTO CONTENT MATRIX --- */}
          <div className="container-wide px-4 md:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

              {/* MAIN CONTENT ASSEMBLY */}
              <div className="lg:col-span-8 space-y-24">

                {/* About: Deep Layering */}
                <section id="about" className="scroll-mt-32">
                  <h2 className="text-[12px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6">Introduction</h2>
                  <div className="space-y-6">
                    {hackathon.longDescription.split('\n\n').map((p, i) => (
                        <p key={i} className="text-xl text-slate-600 font-bold leading-relaxed tracking-tight border-l-2 border-slate-100 pl-6">
                          {p}
                        </p>
                    ))}
                  </div>
                </section>

                {/* Themes: Refractive Bento Cards */}
                <section id="themes" className="scroll-mt-32">
                  <h2 className="text-[12px] font-black text-[#FF6B35] uppercase tracking-[0.3em] mb-8">Focus Areas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hackathon.themes.map((theme) => (
                        <div key={theme.id} className="group p-8 rounded-[40px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-orange-100 transition-all duration-700">
                          <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{theme.icon}</div>
                          <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">{theme.title}</h3>
                          <p className="text-slate-500 font-bold leading-snug text-sm">{theme.description}</p>
                        </div>
                    ))}
                  </div>
                </section>

                {/* Mentors: Circular Profiles */}
                <section id="mentors" className="scroll-mt-32">
                  <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Mentors</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {hackathon.mentors.map((m) => (
                        <div key={m.id} className="text-center group cursor-pointer">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-500">
                            👤
                          </div>
                          <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight">{m.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{m.role}</p>
                          <p className="text-[10px] font-bold text-[#3B82F6]">{m.organization}</p>
                        </div>
                    ))}
                  </div>
                </section>

                {/* Schedule: Dynamic Vertical Flow */}
                <section id="schedule" className="scroll-mt-32">
                  <h2 className="text-[12px] font-black text-[#10B981] uppercase tracking-[0.3em] mb-12">The Timeline</h2>
                  <div className="space-y-0 relative border-l-2 border-slate-100 ml-4">
                    {hackathon.timeline.map((item) => (
                        <div key={item.id} className="relative pl-12 pb-12 group">
                          <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-slate-200 group-hover:border-[#10B981] transition-colors duration-500 scale-100 group-hover:scale-125" />
                          <p className="text-[10px] font-black text-[#10B981] uppercase tracking-widest mb-2">{format(new Date(item.date), 'MMMM dd, yyyy')}</p>
                          <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{item.title}</h3>
                          <p className="text-slate-500 font-bold text-sm">{item.description}</p>
                        </div>
                    ))}
                  </div>
                </section>

                {/* Prizes: High-Contrast Bento */}
                <section id="prizes" className="scroll-mt-32">
                  <h2 className="text-[12px] font-black text-[#FBBF24] uppercase tracking-[0.3em] mb-8">Prize Pool</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hackathon.prizes.map((p) => (
                        <div key={p.id} className="p-8 rounded-[40px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000 rotate-12">
                            <Trophy size={100} />
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{p.position}</p>
                          <p className="text-4xl font-black bg-gradient-to-r from-[#FF6B35] to-[#FBBF24] bg-clip-text text-transparent">{p.amount}</p>
                          <p className="text-slate-400 font-bold mt-4 text-sm leading-relaxed">{p.description}</p>
                        </div>
                    ))}
                  </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="scroll-mt-32">
                  <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">FAQs</h2>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {hackathon.faqs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border-none">
                          <AccordionTrigger className="px-6 py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 font-bold text-slate-900 text-left [&[data-state=open]]:bg-slate-200 no-underline transition-all">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-6 py-4 text-slate-500 font-medium">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              </div>

              {/* --- SIDEBAR: REGISTRATION BENTO (Layered Z-100) --- */}
              <div className="lg:col-span-4">
                <div className="sticky top-40 space-y-6">
                  <div className="p-8 rounded-[48px] bg-white border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-6">Secure Your Spot</h3>

                    <div className="space-y-6 mb-10">
                      <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><Calendar size={20} /></div>
                        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Starts On</p><p className="font-black text-slate-900">{format(new Date(hackathon.startDate), 'MMM dd, yyyy')}</p></div>
                      </div>
                      <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6B35] group-hover:scale-110 transition-transform"><MapPin size={20} /></div>
                        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Venue</p><p className="font-black text-slate-900 truncate max-w-[150px]">{hackathon.location}</p></div>
                      </div>
                    </div>

                    {hackathon.status !== 'completed' && daysUntilDeadline > 0 && (
                        <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 flex items-center justify-between mb-8">
                          <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Closing In</p><p className="text-3xl font-black text-slate-900 tracking-tighter">{daysUntilDeadline} Days</p></div>
                          <div className="relative w-10 h-10">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-[#FF6B35] border-r-[#FF6B35] border-b-transparent border-l-transparent animate-spin" />
                          </div>
                        </div>
                    )}

                    <Button className="w-full h-16 rounded-[28px] bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-blue-600 transition-all duration-500 shadow-2xl hover:shadow-blue-500/20" disabled={hackathon.status === 'completed'}>
                      {hackathon.status === 'completed' ? 'Registration Closed' : 'Register Now'}
                    </Button>

                    <p className="text-[10px] text-center font-bold text-slate-400 uppercase mt-4 tracking-[0.2em]">
                      {hackathon.fee === 'free' ? 'Zero Entry Fee' : `Entry Fee: ₹${hackathon.feeAmount}`}
                    </p>
                  </div>
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