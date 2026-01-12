import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import { HeroSection } from './HeroSection';
import { WhoWeAreSection } from './WhoWeAreSection';
import { ImpactSection } from './ImpactSection';
import { WhatWeDoSection } from './WhatWeDoSection';
import { SpotlightsSection } from './SpotlightsSection';
import { EventsPreviewSection } from './EventsPreviewSection';
import { CommunityGallerySection } from './CommunityGallerySection';
import { PartnersSection } from './PartnersSection';
import { FinalCTASection } from './FinalCTASection';

const HomePage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <SEOHead {...seoConfig.home} />
        <Header />
        <main>
          <HeroSection />
          <WhoWeAreSection />
          <ImpactSection />
          <WhatWeDoSection />
          <SpotlightsSection />
          <EventsPreviewSection />
          <CommunityGallerySection />
          <PartnersSection />
          <FinalCTASection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default HomePage;
