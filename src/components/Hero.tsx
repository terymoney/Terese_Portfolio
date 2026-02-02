import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";

const GITHUB_URL = "https://github.com/terymoney";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] pt-24 sm:pt-28 flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Layout: image + text */}
        <div className="flex flex-col items-center text-center gap-8 sm:gap-10">
          {/* Profile image */}
          <Reveal delayMs={0}>
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-primary/15 blur-xl" />
              <img
                src="/assets/profile/Terese.jpeg"
                alt="Maria Terese Ezeobi"
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border border-border/60 shadow-lg"
              />
            </div>
          </Reveal>

          <div className="space-y-8">
            <Reveal variant="text" delayMs={80}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground">
                Hi, I'm{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  Maria Terese Ezeobi
                </span>
              </h1>
            </Reveal>

            <Reveal variant="text" delayMs={160}>
              <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
                Full-stack blockchain developer specializing in Solidity smart
                contracts, DeFi protocols, and Web3 applications. Building secure,
                scalable decentralized systems with Foundry, Chainlink, and modern
                Web3 tooling.
              </p>
            </Reveal>

            <Reveal delayMs={240}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/projects">
                  <Button
                    size="lg"
                    className="gap-2 shadow-glow hover:shadow-elevation transition-all"
                  >
                    View Projects
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Github className="w-4 h-4" />
                    GitHub Profile
                  </Button>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
