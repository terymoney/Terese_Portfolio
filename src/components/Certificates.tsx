import Reveal from "@/components/Reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink } from "lucide-react";

type Cert = {
  title: string;
  issuer: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  href: string;
  tags?: string[];
};

const CERTS: Cert[] = [
  {
    title: "Advanced Foundry",
    issuer: "Cyfrin Updraft",
    level: "Advanced",
    href: "https://profiles.cyfrin.io/u/teryclairte/achievements/advanced-foundry",
    tags: ["Foundry", "Testing", "Security"],
  },
  {
    title: "Foundry",
    issuer: "Cyfrin Updraft",
    level: "Intermediate",
    href: "https://profiles.cyfrin.io/u/teryclairte/achievements/foundry",
    tags: ["Solidity", "Foundry"],
  },
  {
    title: "Smart Contracts",
    issuer: "Coursera",
    href: "https://www.coursera.org/account/accomplishments/verify/WV2G4XGNB337",
    tags: ["Solidity", "EVM"],
  },
  {
    title: "Blockchain Basics",
    issuer: "Coursera",
    href: "https://www.coursera.org/account/accomplishments/verify/KGFKYSG87X8Y?utm_source%3Dandroid%26utm_medium%3Dcertificate%26utm_content%3Dcert_image%26utm_campaign%3Dsharing_cta%26utm_product%3Dcourse",
    tags: ["Blockchain", "Consensus"],
  },
  {
    title: "JavaScript Basics",
    issuer: "Coursera",
    href: "https://www.coursera.org/account/accomplishments/verify/AHF8DUUOJC2D",
    tags: ["JavaScript"],
  },
  {
    title: "HTML, CSS, and JavaScript for Web Developers",
    issuer: "Coursera",
    href: "https://www.coursera.org/account/accomplishments/verify/ZP47AS15N62E",
    tags: ["HTML", "CSS", "JS"],
  },
  {
    title: "Decentralized Applications (Dapps)",
    issuer: "Coursera",
    href: "https://www.coursera.org/account/accomplishments/verify/47CNIQDAQAX3",
    tags: ["DApps", "Web3"],
  },
];

function levelBadge(level?: Cert["level"]) {
  if (!level) return null;
  const base = "border";
  if (level === "Advanced") return <Badge className={`${base} bg-primary/10 text-primary border-primary/30`}>{level}</Badge>;
  if (level === "Intermediate") return <Badge variant="secondary">{level}</Badge>;
  return <Badge variant="outline">{level}</Badge>;
}

export default function Certificates() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <Reveal variant="text" delayMs={0}>
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Certificates</h2>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Credible training milestones from my Web3 journey (started 2023).
          </p>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CERTS.map((c, i) => (
          <Reveal key={c.href} delayMs={60 + i * 40}>
            <Card className="group border-border/60 hover:border-primary/30 transition-all duration-300 bg-gradient-card shadow-card hover:shadow-elevation">
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg leading-snug">{c.title}</CardTitle>
                  {levelBadge(c.level)}
                </div>
                <p className="text-sm text-muted-foreground">{c.issuer}</p>

                {c.tags?.length ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {c.tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </CardHeader>

              <CardContent className="pt-0">
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-between group-hover:border-primary/40 transition-colors"
                  >
                    View certificate
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
