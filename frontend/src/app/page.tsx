import { AgendaSection } from "@/components/landing/agenda-section";
import { AudienceSection } from "@/components/landing/audience-section";
import { FilterMatrixSection } from "@/components/landing/filter-matrix-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LearningsSection } from "@/components/landing/learnings-section";
import { MentorSection } from "@/components/landing/mentor-section";
import { ProfilesSection } from "@/components/landing/profiles-section";
import { UniquenessSection } from "@/components/landing/uniqueness-section";
import { FunnelShell } from "@/components/layout/funnel-shell";

export default function HomePage() {
  return (
    <FunnelShell variant="landing">
      <HeroSection />
      <AudienceSection />
      <ProfilesSection />
      <UniquenessSection />
      <LearningsSection />
      <FilterMatrixSection />
      <MentorSection />
      <AgendaSection />
    </FunnelShell>
  );
}
