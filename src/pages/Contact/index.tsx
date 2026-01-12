import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import ContactHero from './ContactHero';
import OfficeAddresses from './OfficeAddresses';
import ContactFAQs from './ContactFAQs';
import ContactForm from './ContactForm';
import { ConnectingDots } from '@/components/ui/DecorativeElements';

const ContactPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background overflow-x-clip">
        <SEOHead {...seoConfig.contact} />
        <Header />
        <main>
          {/* Hero + Intent Cards (merged) */}
          <ContactHero />
          
          {/* Connecting element */}
          <ConnectingDots className="bg-background" />
          
          {/* Office Addresses */}
          <OfficeAddresses />
          
          {/* FAQs */}
          <ContactFAQs />
          
          {/* Connecting element */}
          <ConnectingDots className="bg-background" />
          
          {/* Contact Form + Social */}
          <ContactForm />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ContactPage;
