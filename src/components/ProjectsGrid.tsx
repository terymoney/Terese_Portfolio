import { useEffect, useRef } from "react";
import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";
import Reveal from "@/components/Reveal";

const clamp = (text: string, max = 130) => {
  const t = (text ?? "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trimEnd()}…`;
};

const ProjectsGrid = () => {
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.slug}
                ref={(el) => (itemRefs.current[i] = el)}
                className="reveal-item"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <ProjectCard
                  title={p.title}
                  description={clamp(p.cardBlurb, 140)}
                  tags={p.tags.slice(0, 5)}
                  slug={p.slug}
                  icon={<Icon className="w-6 h-6" />}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
