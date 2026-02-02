import Navigation from "@/components/Navigation";
import ProjectsGrid from "@/components/ProjectsGrid";

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="py-12 px-4 sm:px-6 lg:px-8 text-center bg-gradient-hero">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            My Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of smart contracts, DApps, and Web3 applications built
            with Solidity and modern blockchain tools
          </p>
        </div>
        <ProjectsGrid />
      </div>
    </div>
  );
};

export default Projects;
