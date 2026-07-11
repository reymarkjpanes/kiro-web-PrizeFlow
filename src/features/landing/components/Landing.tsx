import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { SolutionSection } from './SolutionSection';
import { FeaturesSection } from './FeaturesSection';
import { WhySection } from './WhySection';
import { CtaSection } from './CtaSection';

interface LandingProps {
  onEnterApp: () => void;
}


function Landing({ onEnterApp }: LandingProps) {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav onEnterApp={onEnterApp} />
      {/* Spacer for fixed nav */}
      <div className="pt-14">
        <HeroSection onGetStarted={onEnterApp} />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <WhySection />
        <CtaSection onGetStarted={onEnterApp} />
      </div>
    </div>
  );
}

export { Landing };
export type { LandingProps };
