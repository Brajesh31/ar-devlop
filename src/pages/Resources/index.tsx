import { PageTransition } from '@/components/layout/PageTransition';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import { ResourcesHeader } from './ResourcesHeader';
import { LearningCategories } from './LearningCategories';
import { FeaturedResources } from './FeaturedResources';
import { ToolsSection } from './ToolsSection';
import { LearningPaths } from './LearningPaths';
import { CommunityPicks } from './CommunityPicks';
import { ResourcesFAQ } from './ResourcesFAQ';
import { ResourcesCTA } from './ResourcesCTA';
import { Footer } from '@/components/layout/Footer';
import { GradientOrb } from '@/components/ui/DecorativeElements';

const ResourcesPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-x-clip">
        <SEOHead {...seoConfig.resources} />
        {/* Decorative Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb 
            className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 blur-3xl" 
          />
          <GradientOrb 
            className="absolute bottom-1/3 -right-20 w-60 h-60 bg-accent/5 blur-3xl" 
          />
        </div>

        <ResourcesHeader />
        <main className="relative z-10">
          <LearningCategories />
          <FeaturedResources />
          <ToolsSection />
          <LearningPaths />
          <CommunityPicks />
          <ResourcesFAQ />
          <ResourcesCTA />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ResourcesPage;
