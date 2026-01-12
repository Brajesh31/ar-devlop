import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import { HackathonsHeader } from './HackathonsHeader';
import { HackathonFilterBar } from './HackathonFilterBar';
import { HackathonsGrid } from './HackathonsGrid';
import { NoHackathonsState } from './NoHackathonsState';
import { GradientOrb } from '@/components/ui/DecorativeElements';
import {
  hackathons, 
  getSortedHackathons, 
  filterHackathons,
  HackathonMode,
  HackathonStatus,
  HackathonTeamSize,
  HackathonFee,
} from '@/data/hackathons';

const HackathonsPage = () => {
  const [selectedMode, setSelectedMode] = useState<HackathonMode | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<HackathonStatus | null>(null);
  const [selectedTeamSize, setSelectedTeamSize] = useState<HackathonTeamSize | null>(null);
  const [selectedFee, setSelectedFee] = useState<HackathonFee | null>(null);

  const filteredHackathons = useMemo(() => {
    const filtered = filterHackathons(hackathons, {
      mode: selectedMode,
      status: selectedStatus,
      teamSize: selectedTeamSize,
      fee: selectedFee,
    });
    return getSortedHackathons(filtered);
  }, [selectedMode, selectedStatus, selectedTeamSize, selectedFee]);

  const handleReset = () => {
    setSelectedMode(null);
    setSelectedStatus(null);
    setSelectedTeamSize(null);
    setSelectedFee(null);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-x-clip">
        <SEOHead {...seoConfig.hackathons} />
        {/* Decorative Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <GradientOrb 
            className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 blur-3xl" 
          />
          <GradientOrb 
            className="absolute bottom-1/4 -left-20 w-60 h-60 bg-primary/5 blur-3xl" 
          />
        </div>

        <Header />
        <main className="relative z-10">
          <HackathonsHeader />
          <HackathonFilterBar
            selectedMode={selectedMode}
            selectedStatus={selectedStatus}
            selectedTeamSize={selectedTeamSize}
            selectedFee={selectedFee}
            onModeChange={setSelectedMode}
            onStatusChange={setSelectedStatus}
            onTeamSizeChange={setSelectedTeamSize}
            onFeeChange={setSelectedFee}
            onReset={handleReset}
          />
          {filteredHackathons.length > 0 ? (
            <HackathonsGrid hackathons={filteredHackathons} />
          ) : (
            <NoHackathonsState onReset={handleReset} />
          )}
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default HackathonsPage;
