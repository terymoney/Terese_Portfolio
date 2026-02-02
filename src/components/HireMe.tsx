import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Github, Linkedin, Mail } from "lucide-react";

const GITHUB_URL = "https://github.com/terymoney";
const LINKEDIN_URL = "http://linkedin.com/in/maria-terese-ezeobi-9a50011b1";
const EMAIL = "teryclair.te@gmail.com";

const HireMe = () => {
  return (
    <Reveal delayMs={120}>
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-card/60 border-primary/20 shadow-card hover:shadow-elevation hover:-translate-y-1 transition-all duration-300">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Hire Me
                    </h3>
                  </div>

                  <p className="text-muted-foreground max-w-2xl">
                    I build production-grade smart contracts and Web3 apps —
                    governance systems, DeFi engines, NFT systems, account
                    abstraction, and cross-chain protocols — with tests and
                    on-chain proof.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-secondary/50">
                      Open to Full-time
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/50">
                      Freelance / Contract
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/50">
                      Remote-friendly
                    </Badge>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                  <a href={`mailto:${EMAIL}`} className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto gap-2 shadow-glow hover:shadow-elevation transition-all">
                      <Mail className="w-4 h-4" />
                      Email Me
                    </Button>
                  </a>

                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button variant="outline" className="w-full sm:w-auto gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </Button>
                  </a>

                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button variant="secondary" className="w-full sm:w-auto gap-2">
                      <Github className="w-4 h-4" />
                      GitHub
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Reveal>
  );
};

export default HireMe;
