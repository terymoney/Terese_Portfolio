import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SkillsGrid from "@/components/SkillsGrid";
import HireMe from "@/components/HireMe";
import Certificates from "@/components/Certificates";
import WorkExperience from "@/components/WorkExperience";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <SkillsGrid />
      <WorkExperience />
      <Certificates />
      <HireMe />
    </div>
  );
};

export default Index;
