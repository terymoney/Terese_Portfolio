import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  /** default (cards): fade+slide, text: left->right travel */
  variant?: "default" | "text";
  once?: boolean;
};

export default function Reveal({
  children,
  delayMs = 0,
  className = "",
  variant = "default",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          if (once) io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`reveal-item ${variant === "text" ? "reveal-text" : ""} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
