import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import { AboutHero3D } from './AboutHero3D';
import { FounderSpotlight } from './FounderSpotlight';
import { MissionVisionSection } from './MissionVisionSection';
import { JourneyTimeline3D } from './JourneyTimeline3D';
import { ValuesGrid } from './ValuesGrid';
import { ImpactMetrics3D } from './ImpactMetrics3D';
import { TeamShowcase } from './TeamShowcase';
import { PartnersMarquee } from './PartnersMarquee';
import { CommunityStats } from './CommunityStats';
import { AboutCTA3D } from './AboutCTA3D';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...seoConfig.about} />
      <Header />
      <main>
        <AboutHero3D />
        <FounderSpotlight />
        <MissionVisionSection />
        <JourneyTimeline3D />
        <ValuesGrid />
        <ImpactMetrics3D />
        <TeamShowcase />
        <PartnersMarquee />
        <CommunityStats />
        <AboutCTA3D />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
