import { NavLink } from "@/components/NavLink";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors flex-shrink-0"
          >
            <img src="/assets/brand/teri-t.svg" alt="Terese" className="w-7 h-7" />
            <span className="font-bold text-lg hidden sm:inline">Web3 Portfolio</span>
          </NavLink>

          <div className="flex items-center gap-3 sm:gap-6">
            <NavLink
              to="/"
              end
              className="text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
              activeClassName="text-primary font-medium"
            >
              Home
            </NavLink>

            <NavLink
              to="/projects"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
              activeClassName="text-primary font-medium"
            >
              Projects
            </NavLink>

            <NavLink
              to="/web3"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
              activeClassName="text-primary font-medium"
            >
              Web3
            </NavLink>
            <ThemeToggle />

            <a
              href="https://github.com/terymoney"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-shrink-0"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
