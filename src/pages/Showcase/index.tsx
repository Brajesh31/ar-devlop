import { useState, useEffect, useMemo } from 'react';
import Lenis from '@studio-freight/lenis';
import { motion, AnimatePresence, Variants } from 'framer-motion';
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
import { ProjectCategory, ShowcaseProject } from '@/data/showcase';
import { publicService } from '@/services/api';
import { API_CONFIG } from '@/config/api';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

// --- MASTER FRAMER MOTION VARIANTS ---
const headerReveal: Variants = {
    hidden: { opacity: 0, y: -40, filter: 'blur(12px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1] as const
        }
    }
};

const sectionSlideUp: Variants = {
    hidden: { opacity: 0, y: 80, filter: 'blur(20px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 1,
            ease: [0.16, 1, 0.3, 1] as const
        }
    }
};

const ShowcasePage = () => {
    // --- STATE MANAGEMENT ---
    const [loading, setLoading] = useState(true);
    const [allProjects, setAllProjects] = useState<ShowcaseProject[]>([]);
    const [activeFilters, setActiveFilters] = useState<ProjectCategory[]>([]);
    const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // --- 1. BUTTER-SMOOTH LENIS SCROLL ---
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.2
        });
        function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    // --- 2. FETCH DATA FROM DATABASE ---
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await publicService.showcase.getGallery();

                if (response.status === 'success' && Array.isArray(response.projects)) {
                    // MAP DB DATA TO UI FORMAT
                    const mappedProjects: ShowcaseProject[] = response.projects.map((item: any, index: number) => ({
                        id: (index + 1).toString(), // Fallback ID since public endpoint might not expose internal ID
                        title: item.project_title || "Untitled Project",
                        description: item.college_name || "Student Project", // Using college as fallback description
                        creatorName: item.student_name,

                        // Construct absolute Video URL
                        videoUrl: item.video_url
                            ? (item.video_url.startsWith('http')
                                ? item.video_url
                                : `${API_CONFIG.baseUrl.replace('/api', '')}${item.video_url}`)
                            : undefined,

                        projectUrl: item.lens_link,
                        thumbnail: '/placeholder.svg', // Default thumbnail

                        // Default Categories (Since DB tags aren't implemented yet)
                        categories: ['ar', 'student'] as ProjectCategory[],
                        techUsed: ['AR', 'Lens'],
                        builtDuring: new Date(item.submitted_at).getFullYear().toString(),
                        isFeatured: item.is_featured == 1
                    }));

                    setAllProjects(mappedProjects);
                }
            } catch (error) {
                console.error("Failed to load showcase:", error);
                toast({
                    title: "Connection Issue",
                    description: "Could not load projects from the database.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // --- 3. FILTER LOGIC ---
    const filteredProjects = useMemo(() => {
        if (activeFilters.length === 0) return allProjects;
        return allProjects.filter(project =>
            project.categories.some(cat => activeFilters.includes(cat))
        );
    }, [activeFilters, allProjects]);

    // Split for Featured Section
    const featuredProjects = useMemo(() =>
            allProjects.filter(p => p.isFeatured),
        [allProjects]);

    // --- HANDLERS ---
    const handleFilterToggle = (filter: ProjectCategory) => {
        setActiveFilters((prev) =>
            prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
        );
    };

    const handleViewDetails = (project: ShowcaseProject) => {
        setSelectedProject(project);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setTimeout(() => setSelectedProject(null), 500);
    };

    return (
        <div className="min-h-screen bg-white selection:bg-[#FF6B35]/20 selection:text-[#FF6B35] overflow-x-hidden">
            {/* Guarding SEOHead in case config is missing */}
            {seoConfig?.showcase && <SEOHead {...seoConfig.showcase} />}

            {/* --- LAYER 0: DEEP ATMOSPHERIC PARALLAX --- */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, 5, 0],
                        x: [0, 30, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -right-[5%] w-[80vw] h-[80vw] bg-gradient-to-br from-[#FF6B35]/5 via-[#FBBF24]/5 to-transparent rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1.1, 1, 1.1],
                        rotate: [0, -5, 0],
                        x: [0, -40, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[40%] -left-[10%] w-[60vw] h-[60vw] bg-gradient-to-tr from-[#3B82F6]/5 via-[#10B981]/5 to-transparent rounded-full blur-[120px]"
                />
            </div>

            {/* --- SECTION 1: HEADER & HERO --- */}
            <motion.div
                variants={headerReveal}
                initial="hidden"
                animate="visible"
                className="relative z-50"
            >
                <ShowcaseHeader />
            </motion.div>

            <main className="relative z-10 pb-0">

                {/* --- SECTION 2: STICKY FILTERS --- */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
                    className="sticky top-0 z-40 bg-white/60 backdrop-blur-2xl border-b border-white/40 shadow-sm pt-4 pb-4"
                >
                    <ShowcaseFilters
                        activeFilters={activeFilters}
                        onFilterToggle={handleFilterToggle}
                    />
                </motion.div>

                {/* --- LOADING STATE --- */}
                {loading && (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35]" />
                    </div>
                )}

                {/* --- SECTION 3: THE BENTO GALLERY --- */}
                {!loading && (
                    <div className="relative z-10 min-h-[50vh] py-16">
                        <ProjectGallery
                            projects={filteredProjects}
                            onViewDetails={handleViewDetails}
                        />
                    </div>
                )}

                {/* --- SECTION 4: FEATURED (Only if available) --- */}
                {!loading && featuredProjects.length > 0 && (
                    <motion.div
                        variants={sectionSlideUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative z-20"
                    >
                        {/* Pass fetched data to FeaturedProjects */}
                        <FeaturedProjects
                            projects={featuredProjects}
                            onViewDetails={handleViewDetails}
                        />
                    </motion.div>
                )}

                {/* --- SECTION 5: CREATORS --- */}
                <motion.div
                    variants={sectionSlideUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <CreatorsSection />
                </motion.div>

                {/* --- SECTION 6: CONTEXT & CTA --- */}
                <motion.div
                    variants={sectionSlideUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative z-30"
                >
                    <ProgramContext />
                    <ShowcaseCTA />
                </motion.div>

            </main>

            <Footer />

            {/* --- LAYER 99: MODAL ORCHESTRATION --- */}
            <AnimatePresence mode="wait">
                {modalOpen && selectedProject && (
                    <ProjectDetailModal
                        project={selectedProject}
                        open={modalOpen}
                        onClose={handleCloseModal}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShowcasePage;