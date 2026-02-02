// src/components/ProjectStickyTracker.tsx
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type SectionKey =
  | "highlights"
  | "story"
  | "how-it-works"
  | "evidence"
  | "contracts"
  | "proofs";

type Props = {
  /** ids must exist in ProjectDetail as <div id="..."> wrappers */
  showHowItWorks?: boolean;
  showEvidence?: boolean;
  showContracts?: boolean;
  showProofs?: boolean;

  /**
   * Optional: lets ProjectDetail control smooth scroll with a single offset
   * (best way to avoid “not exactly at section start”).
   */
  onJump?: (id: string) => void;
};

const NAV_AND_TRACKER_OFFSET = 160; // fallback offset (used only if onJump not provided)

const ProjectStickyTracker = ({
  showHowItWorks = true,
  showEvidence = true,
  showContracts = true,
  showProofs = true,
  onJump,
}: Props) => {
  const [active, setActive] = useState<SectionKey>("highlights");

  const sections = useMemo(() => {
    const base: Array<{ key: SectionKey; label: string; id: string }> = [
      { key: "highlights", label: "Highlights", id: "highlights" },
      { key: "story", label: "Story", id: "story" },
    ];

    if (showHowItWorks)
      base.push({ key: "how-it-works", label: "How it works", id: "how-it-works" });
    if (showEvidence) base.push({ key: "evidence", label: "Evidence", id: "evidence" });
    if (showContracts) base.push({ key: "contracts", label: "Contracts", id: "contracts" });
    if (showProofs) base.push({ key: "proofs", label: "Proofs", id: "proofs" });

    return base;
  }, [showHowItWorks, showEvidence, showContracts, showProofs]);

  const fallbackScrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - NAV_AND_TRACKER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const jump = (id: string, key: SectionKey) => {
    // update active immediately for instant feedback
    setActive(key);

    if (onJump) onJump(id);
    else fallbackScrollToId(id);
  };

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // pick the most visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          )[0];

        if (!visible?.target?.id) return;

        const found = sections.find((s) => s.id === visible.target.id);
        if (found) setActive(found.key);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
        // This margin is key: “top” accounts for sticky nav + tracker height
        rootMargin: `-${NAV_AND_TRACKER_OFFSET}px 0px -60% 0px`,
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <div className="sticky top-[76px] sm:top-[84px] lg:top-[92px] z-50 mb-6">
      {/* top-[72px] assumes your Navigation height ~72px. If yours is different, change this */}
      <div className="rounded-2xl border border-border bg-background/70 backdrop-blur shadow-card">
        <div className="flex gap-2 overflow-x-auto p-3">
          {sections.map((s) => {
            const isActive = active === s.key;
            return (
              <Button
                key={s.key}
                size="sm"
                variant={isActive ? "default" : "outline"}
                className="shrink-0"
                onClick={() => jump(s.id, s.key)}
              >
                {s.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectStickyTracker;
