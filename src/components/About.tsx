import { Card, CardContent } from "@/components/ui/card";
import { Award, Code, Sparkles, ShieldCheck, GitBranch } from "lucide-react";
import Reveal from "@/components/Reveal";

const About = () => {
  const achievements = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Smart Contracts (DeFi + NFTs + DAO)",
      description:
        "Built and deployed real Solidity systems: stablecoin engine, DAO governance with timelock, on-chain NFTs, Merkle airdrops, and ERC-4337 account abstraction flows.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Security + Testing Mindset",
      description:
        "Protocol-style testing with Foundry: unit tests, edge cases, coverage, and safety constraints like health factor rules and signature/merkle verification checks.",
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Cross-chain + Oracles",
      description:
        "Hands-on with Chainlink tooling (price feeds, CCIP message lifecycle) and designing flows that stay correct across async execution and multi-chain states.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Production Proofs",
      description:
        "I prioritize verifiable work: deployed addresses, explorer links, and transaction proofs that show the full lifecycle actually ran on-chain.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Full-Stack Web3 Delivery",
      description:
        "React + TypeScript frontends wired to on-chain contracts via wagmi/viem, focused on clean UX, error handling, and real user flows.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Reveal variant="text" delayMs={0}>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              About Me
            </h2>
          </Reveal>

          <Reveal variant="text" delayMs={90}>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              I build clean, security-minded Web3 systems — with real
              deployments and proofs. My focus is turning complex protocol logic
              into maintainable code and a friendly user experience.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((a, i) => (
            <Reveal key={a.title} delayMs={i * 90}>
              <Card className="bg-gradient-card border-primary/20 hover:border-primary/50 transition-all shadow-card hover:shadow-elevation">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      {a.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {a.title}
                    </h3>
                    <p className="text-muted-foreground">{a.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
