import Reveal from "@/components/Reveal";

const skills = [
  {
    category: "Smart Contracts",
    items: ["Solidity", "Foundry", "Hardhat", "OpenZeppelin", "EIP-712", "Merkle Trees"],
  },
  {
    category: "DeFi Protocol Design",
    items: [
      "Collateralized Stablecoin Engines",
      "Health Factor / Risk Constraints",
      "Mint / Burn / Redeem Flows",
      "DAO Governance + Timelock",
    ],
  },
  {
    category: "Chainlink + Cross-chain",
    items: ["Price Feeds", "CCIP Message Lifecycle", "TokenPools (Burn/Mint)", "Async Execution Handling"],
  },
  {
    category: "Testing & Security",
    items: ["Unit/Interaction Tests", "Edge Case Testing", "Coverage-driven Testing", "Signature Verification Safety"],
  },
  {
    category: "Web3 Frontend",
    items: ["React", "TypeScript", "wagmi", "viem", "RainbowKit", "TailwindCSS"],
  },
  {
    category: "Dev Workflow",
    items: ["Git/GitHub", "Etherscan Proofs", "Deployments on Sepolia + zkSync", "Clean UX + Error Handling"],
  },
];

const SkillsGrid = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Reveal variant="text" delayMs={0}>
            <h2 className="text-4xl font-bold text-foreground mb-3">
              Technical Skills
            </h2>
          </Reveal>

          <Reveal variant="text" delayMs={90}>
            <p className="text-xl text-muted-foreground">
              Full-stack Web3 development expertise
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {skills.map((skill, i) => (
            <Reveal key={skill.category} delayMs={i * 90}>
              <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-all shadow-card hover:shadow-elevation h-full flex flex-col">
                {/* Heading (pink/primary) */}
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {skill.category}
                </h3>

                {/* Compact bullet list (no huge gaps) */}
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {skill.items.map((item) => (
                    <li key={item} className="leading-snug">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsGrid;
