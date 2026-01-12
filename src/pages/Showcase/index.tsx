import { useState } from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import { ShowcaseHeader } from './ShowcaseHeader';
import { ShowcaseFilters } from './ShowcaseFilters';
import { ProjectGallery } from './ProjectGallery';
import { FeaturedProjects } from './FeaturedProjects';
import { CreatorsSection } from './CreatorsSection';
import { ProgramContext } from './ProgramContext';
import { ShowcaseCTA } from './ShowcaseCTA';
import { ProjectDetailModal } from './ProjectDetailModal';
import { Footer } from '@/components/layout/Footer';
import { GradientOrb, FloatingCircle } from '@/components/ui/DecorativeElements';
import { getAllProjects, filterProjects, ProjectCategory, ShowcaseProject } from '@/data/showcase';

const ShowcasePage = () => {
  const [activeFilters, setActiveFilters] = useState<ProjectCategory[]>([]);
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const allProjects = getAllProjects();
  const filteredProjects = filterProjects(allProjects, activeFilters);

  const handleFilterToggle = (filter: ProjectCategory) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleViewDetails = (project: ShowcaseProject) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-x-clip">
        <SEOHead {...seoConfig.showcase} />
        {/* Decorative Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb 
            className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 blur-3xl" 
          />
          <GradientOrb 
            className="absolute top-1/2 -left-20 w-60 h-60 bg-primary/5 blur-3xl" 
          />
          <FloatingCircle 
            className="absolute top-1/3 right-1/4 w-3 h-3 bg-accent/20 rounded-full"
            delay={0}
          />
        </div>

        <ShowcaseHeader />
        <main className="relative z-10">
          <ShowcaseFilters activeFilters={activeFilters} onFilterToggle={handleFilterToggle} />
          <ProjectGallery projects={filteredProjects} onViewDetails={handleViewDetails} />
          <FeaturedProjects onViewDetails={handleViewDetails} />
          <CreatorsSection />
          <ProgramContext />
          <ShowcaseCTA />
        </main>
        <Footer />
        <ProjectDetailModal 
          project={selectedProject} 
          open={modalOpen} 
          onClose={handleCloseModal} 
        />
      </div>
    </PageTransition>
  );
};

export default ShowcasePage;
