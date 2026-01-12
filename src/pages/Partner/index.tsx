import { Header } from '@/components/layout/Header';
import { PartnerHero } from './PartnerHero';
import { WhyPartner } from './WhyPartner';
import { PartnershipModels } from './PartnershipModels';
import { CollaborationProcess } from './CollaborationProcess';
import { PartnersLogos } from './PartnersLogos';
import { PartnerImpact } from './PartnerImpact';
import { WhoShouldReach } from './WhoShouldReach';
import { PartnershipForm } from './PartnershipForm';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import { motion } from 'framer-motion';

const PartnerPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <SEOHead {...seoConfig.partner} />
      <Header />
      <PartnerHero />
      <WhyPartner />
      <PartnershipModels />
      <CollaborationProcess />
      <PartnersLogos />
      <PartnerImpact />
      <WhoShouldReach />
      <PartnershipForm />
      <Footer />
    </motion.div>
  );
};

export default PartnerPage;
