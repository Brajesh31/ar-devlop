import React from 'react';

interface CitySkylineProps {
  city: 'delhi' | 'bengaluru' | 'mumbai';
  className?: string;
}

const DelhiSkyline = () => (
  <svg viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* India Gate inspired */}
    <rect x="130" y="30" width="40" height="50" fill="currentColor" opacity="0.15" />
    <rect x="135" y="20" width="30" height="15" fill="currentColor" opacity="0.2" />
    <rect x="145" y="10" width="10" height="15" fill="currentColor" opacity="0.25" />
    <rect x="140" y="50" width="20" height="30" fill="currentColor" opacity="0.1" />
    
    {/* Left buildings */}
    <rect x="20" y="50" width="25" height="30" fill="currentColor" opacity="0.12" />
    <rect x="50" y="40" width="20" height="40" fill="currentColor" opacity="0.15" />
    <rect x="75" y="55" width="18" height="25" fill="currentColor" opacity="0.1" />
    <rect x="98" y="45" width="22" height="35" fill="currentColor" opacity="0.13" />
    
    {/* Right buildings */}
    <rect x="180" y="45" width="22" height="35" fill="currentColor" opacity="0.13" />
    <rect x="207" y="55" width="18" height="25" fill="currentColor" opacity="0.1" />
    <rect x="230" y="35" width="25" height="45" fill="currentColor" opacity="0.15" />
    <rect x="260" y="50" width="20" height="30" fill="currentColor" opacity="0.12" />
  </svg>
);

const BengaluruSkyline = () => (
  <svg viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* Vidhana Soudha inspired dome */}
    <rect x="125" y="35" width="50" height="45" fill="currentColor" opacity="0.15" />
    <ellipse cx="150" cy="35" rx="20" ry="10" fill="currentColor" opacity="0.2" />
    <rect x="145" y="20" width="10" height="15" fill="currentColor" opacity="0.18" />
    
    {/* Tech park buildings */}
    <rect x="15" y="45" width="30" height="35" fill="currentColor" opacity="0.12" />
    <rect x="50" y="35" width="25" height="45" fill="currentColor" opacity="0.15" />
    <rect x="80" y="50" width="20" height="30" fill="currentColor" opacity="0.1" />
    
    {/* Right side modern buildings */}
    <rect x="190" y="40" width="28" height="40" fill="currentColor" opacity="0.14" />
    <rect x="223" y="30" width="22" height="50" fill="currentColor" opacity="0.16" />
    <rect x="250" y="45" width="30" height="35" fill="currentColor" opacity="0.12" />
  </svg>
);

const MumbaiSkyline = () => (
  <svg viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    {/* Gateway of India inspired */}
    <rect x="130" y="35" width="40" height="45" fill="currentColor" opacity="0.15" />
    <rect x="140" y="25" width="20" height="15" fill="currentColor" opacity="0.2" />
    <ellipse cx="150" cy="25" rx="12" ry="8" fill="currentColor" opacity="0.18" />
    <rect x="143" y="50" width="14" height="30" fill="currentColor" opacity="0.08" />
    
    {/* High-rise buildings left */}
    <rect x="10" y="20" width="20" height="60" fill="currentColor" opacity="0.14" />
    <rect x="35" y="35" width="25" height="45" fill="currentColor" opacity="0.12" />
    <rect x="65" y="25" width="22" height="55" fill="currentColor" opacity="0.16" />
    <rect x="92" y="40" width="28" height="40" fill="currentColor" opacity="0.13" />
    
    {/* High-rise buildings right */}
    <rect x="180" y="30" width="25" height="50" fill="currentColor" opacity="0.14" />
    <rect x="210" y="15" width="20" height="65" fill="currentColor" opacity="0.16" />
    <rect x="235" y="35" width="28" height="45" fill="currentColor" opacity="0.12" />
    <rect x="268" y="25" width="22" height="55" fill="currentColor" opacity="0.15" />
  </svg>
);

const CitySkyline: React.FC<CitySkylineProps> = ({ city, className = '' }) => {
  const skylines = {
    delhi: <DelhiSkyline />,
    bengaluru: <BengaluruSkyline />,
    mumbai: <MumbaiSkyline />
  };

  return (
    <div className={`text-muted-foreground ${className}`}>
      {skylines[city]}
    </div>
  );
};

export default CitySkyline;
