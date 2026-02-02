// src/pages/ProjectDetail.tsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Reveal from "@/components/Reveal";
import ProjectStickyTracker from "@/components/ProjectStickyTracker";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Github,
  ExternalLink,
  FileCode,
  Rocket,
  TestTube,
  Image as ImageIcon,
} from "lucide-react";

import { getProjectBySlug } from "@/data/projects";

const NAV_AND_TRACKER_OFFSET = 160; // <-- adjust ONCE if needed

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = getProjectBySlug(slug);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y =
      el.getBoundingClientRect().top + window.scrollY - NAV_AND_TRACKER_OFFSET;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground">
            Project Not Found
          </h1>
          <p className="text-muted-foreground mt-2">
            Make sure this project exists in{" "}
            <code className="font-mono">src/data/projects.ts</code>.
          </p>

          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/projects")}
            >
              {"<"} Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const repoUrl = project.repoUrl;
  const primaryExplorerUrl =
    project.contracts?.[0]?.explorerUrl ?? project.links?.[0]?.href;

  // Featured transparent NFT preview ONLY for the onchain NFT project
  const featuredNftSrc =
    project.slug === "robot-onchain-nfts"
      ? "/assets/evidence/robot-onchain-nfts/nft1.png"
      : null;

  // Prevent duplicating nft1.png in evidence gallery
  const evidence =
    project.evidence?.filter((e) => {
      if (project.slug !== "robot-onchain-nfts") return true;
      return !(e.src.includes("nft1.png") || e.src === featuredNftSrc);
    }) ?? [];

  const premiumCardClass =
    "group hover:border-primary/50 transition-all shadow-card hover:shadow-elevation bg-gradient-card";

  const tagClass =
    "bg-primary/10 text-primary border border-primary/30 transition-colors " +
    "hover:bg-[#0B1220] hover:text-primary hover:border-[#0B1220]";

  const showHowItWorks = Boolean(project.timeline?.length);
  const showEvidence = evidence.length > 0;
  const showContracts = Boolean(project.contracts?.length);
  const showProofs = Boolean(project.links?.length);

  // (Optional) If you ever want: compute section order once
  const stickyConfig = useMemo(
    () => ({
      showHowItWorks,
      showEvidence,
      showContracts,
      showProofs,
    }),
    [showHowItWorks, showEvidence, showContracts, showProofs]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* ✅ Back key: simple "<" that stays visible everywhere */}
      <div className="fixed left-4 top-24 z-50">
        <Reveal delayMs={0}>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/70 backdrop-blur border-border shadow-card hover:shadow-elevation"
            onClick={() => navigate(-1)}
            aria-label="Back"
            title="Back"
          >
            {"<"}
          </Button>
        </Reveal>
      </div>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Reveal variant="text" delayMs={0}>
              <h1 className="text-5xl font-bold text-foreground mb-4">
                {project.title}
              </h1>
            </Reveal>

            <Reveal variant="text" delayMs={80}>
              <p className="text-xl text-muted-foreground mb-3">
                {project.tagline}
              </p>
            </Reveal>

            <Reveal variant="text" delayMs={140}>
              <p className="text-muted-foreground mb-6">
                {project.description}
              </p>
            </Reveal>

            <Reveal delayMs={200}>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <Badge key={tag} className={tagClass}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </Reveal>

            <Reveal delayMs={260}>
              <div className="flex flex-wrap gap-3">
                <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <Github className="w-4 h-4" />
                    View Repository
                  </Button>
                </a>

                {project.liveDemoUrl ? (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </Button>
                  </a>
                ) : null}

                {primaryExplorerUrl ? (
                  <a
                    href={primaryExplorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="gap-2">
                      <FileCode className="w-4 h-4" />
                      Explorer Proof
                    </Button>
                  </a>
                ) : null}
              </div>
            </Reveal>
          </div>

          {/* Sticky tracker (DO NOT WRAP IN <Reveal />) */}
<div className="sticky top-[92px] z-50 mb-6">
  <ProjectStickyTracker
    showHowItWorks={showHowItWorks}
    showEvidence={showEvidence}
    showContracts={showContracts}
    showProofs={showProofs}
  />
</div>

    

          {/* Main Content */}
          <div className="space-y-6">
            {/* Highlights */}
            <div id="highlights">
              <Reveal delayMs={0}>
                <Card className={premiumCardClass}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      Key Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project.highlights?.length ? (
                      <ul className="space-y-2">
                        {project.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-muted-foreground">{h}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">
                        Highlights coming soon.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Reveal>
            </div>

            {/* NFT Preview */}
            {featuredNftSrc ? (
              <div id="nft-preview">
                <Reveal delayMs={60}>
                  <Card className={premiumCardClass}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        NFT Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border border-border overflow-hidden bg-transparent">
                        <img
                          src={featuredNftSrc}
                          alt="Robot On-chain NFT Preview"
                          className="w-full h-auto block object-contain bg-transparent"
                          style={{ background: "transparent" }}
                          loading="lazy"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              </div>
            ) : null}

            {/* Story */}
            <div id="story">
              <Reveal delayMs={90}>
                <Card className={premiumCardClass}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TestTube className="w-5 h-5" />
                      The Story
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.story.map((s, i) => (
                      <Reveal key={s.title} delayMs={i * 60} variant="text">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">
                            {s.title}
                          </h4>
                          <p className="text-muted-foreground">{s.body}</p>
                        </div>
                      </Reveal>
                    ))}
                  </CardContent>
                </Card>
              </Reveal>
            </div>

            {/* How it works */}
            {project.timeline?.length ? (
              <div id="how-it-works">
                <Reveal delayMs={120}>
                  <Card className={premiumCardClass}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileCode className="w-5 h-5" />
                        How It Works
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {project.timeline.map((step, idx) => (
                        <Reveal key={`${step.title}-${idx}`} delayMs={idx * 70}>
                          <div className="p-4 rounded-lg border border-border">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-semibold text-foreground">
                                  {idx + 1}. {step.title}
                                </p>
                                <p className="text-muted-foreground mt-1">
                                  {step.body}
                                </p>
                              </div>

                              {step.proofUrl ? (
                                <a
                                  href={step.proofUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    Proof
                                  </Button>
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </Reveal>
                      ))}
                    </CardContent>
                  </Card>
                </Reveal>
              </div>
            ) : null}

            {/* Evidence */}
            {evidence.length ? (
              <div id="evidence">
                <Reveal delayMs={140}>
                  <Card className={premiumCardClass}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Evidence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {evidence.map((e, i) => (
                          <Reveal key={e.src} delayMs={i * 70}>
                            <a
                              href={e.src}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-lg border border-border overflow-hidden bg-card hover:border-primary/40 transition-colors"
                            >
                              <div className="aspect-video bg-muted/20">
                                <img
                                  src={e.src}
                                  alt={e.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                              <div className="p-3">
                                <p className="font-semibold text-foreground text-sm">
                                  {e.title}
                                </p>
                                {e.caption ? (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {e.caption}
                                  </p>
                                ) : null}
                              </div>
                            </a>
                          </Reveal>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              </div>
            ) : null}

            {/* Contracts */}
            {project.contracts?.length ? (
              <div id="contracts">
                <Reveal delayMs={160}>
                  <Card className={premiumCardClass}>
                    <CardHeader>
                      <CardTitle>Live Contracts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {project.contracts.map((c, i) => (
                        <Reveal key={`${c.label}-${c.address}`} delayMs={i * 70}>
                          <div className="p-4 rounded-lg border border-border">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground">
                                  {c.label}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {c.network}
                                </p>
                                <code className="text-sm text-muted-foreground break-all block mt-2">
                                  {c.address}
                                </code>
                              </div>

                              <a
                                href={c.explorerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Explorer
                                </Button>
                              </a>
                            </div>
                          </div>
                        </Reveal>
                      ))}
                    </CardContent>
                  </Card>
                </Reveal>
              </div>
            ) : null}

            {/* Proof Links */}
            {project.links?.length ? (
              <div id="proofs">
                <Reveal delayMs={180}>
                  <Card className={premiumCardClass}>
                    <CardHeader>
                      <CardTitle>Proof Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {project.links.map((l, i) => (
                        <Reveal key={l.href} delayMs={i * 60}>
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Button
                              variant="outline"
                              className="w-full justify-between gap-2"
                            >
                              <span className="truncate">{l.label}</span>
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        </Reveal>
                      ))}
                    </CardContent>
                  </Card>
                </Reveal>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
