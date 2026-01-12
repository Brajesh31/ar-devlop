import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Youtube, MessageCircle, ChevronDown, Mail, MapPin } from 'lucide-react';
import { SOCIAL_LINKS, CONTACT_INFO } from '@/config/api';

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const footerColumns = {
  exploreXR: {
    title: 'Explore XR',
    links: [
      { label: 'Hackathons', href: '/hackathons' },
      { label: 'Events', href: '/events' },
      { label: 'Workshops & Bootcamps', href: '/events' },
      { label: 'XR Showcase', href: '/showcase' },
      { label: 'Resources & Guides', href: '/resources' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Bharat XR', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Partner With Us', href: '/partner' },
      { label: 'Become Academic Partner', href: '/partner#academic' },
    ],
    legalLinks: [
      { label: 'Terms & Conditions', href: '/terms', external: true },
      { label: 'Privacy Policy', href: '/privacy', external: true },
      { label: 'Cookie Policy', href: '/cookie-policy', external: true },
      { label: 'Code of Conduct', href: '/code-of-conduct', external: true },
    ],
  },
  initiatives: {
    title: 'Our Initiatives',
    links: [
      { label: 'XR Creator Hackathons', href: '/hackathons' },
      { label: 'National XR Programs', href: '/events' },
      { label: 'SnapAR Collaborations', href: '/showcase' },
      { label: 'Campus XR Tours', href: '/events' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'FAQs', href: '/faqs' },
      { label: 'Help Center', href: '/help' },
      { label: 'Organize a Hackathon', href: '/partner#hackathon' },
      { label: 'Hackathon Guide', href: '/resources#hackathon-guide' },
    ],
  },
};

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, url: SOCIAL_LINKS.linkedin },
  { name: 'Instagram', icon: Instagram, url: SOCIAL_LINKS.instagram },
  { name: 'X', icon: Twitter, url: SOCIAL_LINKS.twitter },
  { name: 'YouTube', icon: Youtube, url: SOCIAL_LINKS.youtube },
  { name: 'Discord', icon: DiscordIcon, url: SOCIAL_LINKS.discord },
  { name: 'WhatsApp', icon: MessageCircle, url: SOCIAL_LINKS.whatsapp },
];

export const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const renderLinks = (links: { label: string; href: string; external?: boolean }[]) => (
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.href + link.label}>
          {link.external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ) : (
            <Link
              to={link.href}
              className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  const renderMobileAccordion = (title: string, links: { label: string; href: string; external?: boolean }[], legalLinks?: { label: string; href: string; external?: boolean }[]) => {
    const isOpen = openSection === title;
    return (
      <div className="border-b border-primary-foreground/10">
        <button onClick={() => toggleSection(title)} className="w-full flex items-center justify-between py-4 text-left">
          <span className="font-semibold text-primary-foreground">{title}</span>
          <ChevronDown className={`w-5 h-5 text-primary-foreground/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
          {renderLinks(links)}
          {legalLinks && <div className="mt-4 pt-4 border-t border-primary-foreground/10">{renderLinks(legalLinks)}</div>}
        </div>
      </div>
    );
  };

  return (
    <footer className="bg-[hsl(220,15%,10%)]">
      <div className="bg-gradient-to-br from-transparent via-primary-foreground/[0.02] to-accent/[0.03]">
        <div className="container-wide py-12 md:py-16">
          <div className="hidden lg:grid lg:grid-cols-6 gap-6 mb-12">
            <div>
              <h4 className="font-semibold text-primary-foreground mb-5">{footerColumns.exploreXR.title}</h4>
              {renderLinks(footerColumns.exploreXR.links)}
            </div>
            <div>
              <h4 className="font-semibold text-primary-foreground mb-5">{footerColumns.company.title}</h4>
              {renderLinks(footerColumns.company.links)}
              <div className="mt-5 pt-5 border-t border-primary-foreground/10">{renderLinks(footerColumns.company.legalLinks)}</div>
            </div>
            <div>
              <h4 className="font-semibold text-primary-foreground mb-5">{footerColumns.initiatives.title}</h4>
              {renderLinks(footerColumns.initiatives.links)}
            </div>
            <div>
              <h4 className="font-semibold text-primary-foreground mb-5">{footerColumns.support.title}</h4>
              {renderLinks(footerColumns.support.links)}
            </div>
            <div>
              <h4 className="font-semibold text-primary-foreground mb-5">Connect</h4>
              <ul className="space-y-3">
                {socialLinks.map((social) => (
                  <li key={social.name}>
                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                      <social.icon className="w-4 h-4" />
                      <span>{social.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Link to="/" className="inline-flex items-center gap-1 mb-4">
                <span className="text-xl font-bold text-primary-foreground">Bharat</span>
                <span className="text-xl font-bold"><span className="text-accent">X</span><span className="text-success">R</span></span>
              </Link>
              <p className="text-sm text-primary-foreground/60 mb-6 leading-relaxed">Building India's XR ecosystem through education, innovation, and collaboration.</p>
              <div className="mb-6">
                <div className="flex items-start gap-2 text-sm text-primary-foreground/60 mb-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <div><p className="text-primary-foreground/80">Delhi NCR</p><p className="text-primary-foreground/80">Bengaluru</p></div>
                </div>
              </div>
              <div className="space-y-2">
                <a href="mailto:chhavi@bharatxr.co" className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-colors"><Mail className="w-4 h-4" /><span>chhavi@bharatxr.co</span></a>
                <a href="mailto:support@bharatxr.co" className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-colors"><Mail className="w-4 h-4" /><span>support@bharatxr.co</span></a>
              </div>
            </div>
          </div>

          <div className="lg:hidden mb-8">
            <div className="mb-8 pb-8 border-b border-primary-foreground/10">
              <Link to="/" className="inline-flex items-center gap-1 mb-3">
                <span className="text-xl font-bold text-primary-foreground">Bharat</span>
                <span className="text-xl font-bold"><span className="text-accent">X</span><span className="text-success">R</span></span>
              </Link>
              <p className="text-sm text-primary-foreground/60 mb-4">Building India's XR ecosystem through education, innovation, and collaboration.</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-primary-foreground/10 hover:bg-accent/20 transition-colors" aria-label={social.name}>
                    <social.icon className="w-4 h-4 text-primary-foreground" />
                  </a>
                ))}
              </div>
            </div>
            {renderMobileAccordion(footerColumns.exploreXR.title, footerColumns.exploreXR.links)}
            {renderMobileAccordion(footerColumns.company.title, footerColumns.company.links, footerColumns.company.legalLinks)}
            {renderMobileAccordion(footerColumns.initiatives.title, footerColumns.initiatives.links)}
            {renderMobileAccordion(footerColumns.support.title, footerColumns.support.links)}
            <div className="mt-6 space-y-2">
              <a href="mailto:chhavi@bharatxr.co" className="flex items-center gap-2 text-sm text-primary-foreground/60"><Mail className="w-4 h-4" /><span>chhavi@bharatxr.co</span></a>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/60"><MapPin className="w-4 h-4" /><span>Delhi NCR • Bengaluru</span></div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/10 pt-6 text-center">
            <p className="text-sm text-primary-foreground/40">© {new Date().getFullYear()} Bharat XR. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
