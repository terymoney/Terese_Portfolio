// src/components/WorkExperience.tsx
import Reveal from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, MapPin, ShieldCheck, Sparkles } from "lucide-react";

type WorkSection = {
  title: string;
  description: string;
  bullets?: string[];
};

type ExperienceItem = {
  role: string;
  company: string;
  employmentType?: string;
  location?: string;
  start: string;
  end: string;
  overview: string;
  mindset: string;
  sections: WorkSection[];
  howIWork: string[];
  skills?: string[];
};

const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Smart Contract Engineer / Web3 Engineer",
    company: "Independent",
    employmentType: "Independent",
    location: "Remote • Nigeria",
    start: "2023",
    end: "Present",
    overview:
      "Since 2023, I’ve been designing and deploying production-grade Web3 systems across Ethereum ecosystems. My work focuses on protocol-level Solidity development, governance safety, account abstraction, and non-custodial payments — with an emphasis on building systems that actually run on-chain, not demos.",
    mindset:
      "I enjoy solving the uncomfortable parts of Web3 engineering: security edge cases, EVM constraints, governance abuse, and UX problems that lead to real user losses.",
    sections: [
      {
        title: "Fully On-Chain NFTs",
        description:
          "Explored what it really takes to make NFTs fully on-chain (no IPFS/off-chain metadata), and how to work around EVM bytecode/storage limits.",
        bullets: [
          "Split architecture: ERC-721 ownership + small SVG index",
          "Separate on-chain SVG storage contract for reusable templates",
          "tokenURI() assembles metadata + images dynamically via Base64 encoding",
          "Designed to avoid bytecode overflows and reduce gas/storage pressure",
        ],
      },
      {
        title: "DAO Governance & Stablecoin Protocol",
        description:
          "Built a DAO governance system that controls a stablecoin engine’s risk parameters on-chain, with safeguards against rushed/dangerous changes.",
        bullets: [
          "Skin-in-the-game voting via token locking (vote-escrow)",
          "Reputation through time commitment (longer locks → more influence)",
          "Timelock execution to prevent immediate post-vote parameter changes",
          "Executed a real on-chain parameter change (minHealthFactor) through the full lifecycle",
        ],
      },
      {
        title: "Account Abstraction (Multisig)",
        description:
          "Explored AA across ecosystems: ERC-4337-style smart accounts on EVM chains, and native AA smart accounts on zkSync.",
        bullets: [
          "ERC-4337 multisig authorization with validation + execution flow focus",
          "zkSync native AA: executed ERC-20 minting, approvals, transfers from smart contracts",
          "Learned how AA design shifts with the underlying execution model",
        ],
      },
      {
        title: "Non-Custodial Payments (T-Link Pay)",
        description:
          "Built a stablecoin pay-link and invoice system that allows freelancers to receive ERC-20 payments without custody or intermediaries.",
        bullets: [
          "Preventing funds from being sent to the wrong address",
          "Confirming the correct token and exact amount were paid",
          "Invoice links lock receiver address + expected amount",
          "Server-side verification by decoding tx receipts + ERC-20 Transfer logs",
          "Invoices are marked complete only after cryptographic verification",
          "Printable receipt generated with on-chain proof",
        ],
      },
      {
        title: "Token Distribution & Cross-Chain Systems",
        description:
          "Built distribution and cross-chain systems with strong constraints around correctness and invariants.",
        bullets: [
          "Merkle + EIP-712 gated airdrop with pull-based token transfers",
          "Prevents unauthorized and duplicate claims",
          "Cross-chain rebasing ERC-20 using Chainlink CCIP",
          "Designed to preserve supply invariants across chains via burn/mint pools",
        ],
      },
    ],
    howIWork: [
      "I prioritize correctness and safety over shortcuts.",
      "I like systems that can be proven on-chain, not just explained.",
      "I document my work thoroughly so others can reproduce it.",
      "I’m comfortable owning projects end-to-end: design → contracts → tests → deployment → UI integration.",
    ],
    skills: [
      "Solidity",
      "Foundry",
      "OpenZeppelin",
      "EIP-712",
      "ERC-4337",
      "Governance + Timelock",
      "Chainlink (CCIP/Feeds)",
      "TypeScript",
      "React",
      "wagmi/viem",
    ],
  },
];

export default function WorkExperience() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal variant="text" delayMs={0}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-primary/15 border border-primary/20">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Work Experience
            </h2>
          </div>
        </Reveal>

        <Reveal variant="text" delayMs={80}>
          <p className="text-muted-foreground max-w-2xl mb-8">
            Professional experience and the type of systems I build (projects are showcased below).
          </p>
        </Reveal>

        <div className="grid gap-6">
          {EXPERIENCE.map((item, idx) => (
            <Reveal key={`${item.company}-${item.role}-${idx}`} delayMs={idx * 80}>
              <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 sm:p-7 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/15 to-transparent rounded-bl-full -mr-8 -mt-8" />

                <div className="relative z-10">
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-bold">{item.role}</h3>
                        {item.employmentType ? (
                          <Badge className="bg-primary/15 text-primary border-primary/20">
                            {item.employmentType}
                          </Badge>
                        ) : null}
                      </div>

                      <p className="text-muted-foreground mt-1">
                        <span className="font-semibold text-foreground">{item.company}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          {item.start} — {item.end}
                        </span>
                        {item.location ? (
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            {item.location}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Overview */}
                  <div className="mt-6 grid gap-4">
                    <div className="rounded-xl border border-border bg-background/40 p-4">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.overview}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-background/40 p-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.mindset}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What I've worked on */}
                  <div className="mt-7">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      What I’ve Worked On
                    </h4>

                    <div className="grid gap-4">
                      {item.sections.map((s, i) => (
                        <div
                          key={`${s.title}-${i}`}
                          className="rounded-2xl border border-border bg-background/30 p-5"
                        >
                          <p className="font-semibold">{s.title}</p>
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            {s.description}
                          </p>

                          {s.bullets?.length ? (
                            <ul className="list-disc pl-5 mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed">
                              {s.bullets.map((b, bi) => (
                                <li key={`${s.title}-b-${bi}`}>{b}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* How I work */}
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold text-foreground mb-3">How I Work</h4>
                    <div className="rounded-2xl border border-border bg-background/30 p-5">
                      <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground leading-relaxed">
                        {item.howIWork.map((h, i) => (
                          <li key={`how-${i}`}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Skills */}
                  {item.skills?.length ? (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.skills.map((s) => (
                        <span
                          key={`skill-${s}`}
                          className="text-xs px-2.5 py-1 rounded-full border border-border bg-background/40 text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
