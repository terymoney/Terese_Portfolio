import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin } from "lucide-react";
import Reveal from "@/components/Reveal";

const GITHUB_URL = "https://github.com/terymoney";
const LINKEDIN_URL = "http://linkedin.com/in/maria-terese-ezeobi-9a50011b1";
const EMAIL = "teryclair.te@gmail.com";

const Contact = () => {
  return (
    <section
      id="contact"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-card"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Reveal variant="text" delayMs={0}>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Get In Touch
            </h2>
          </Reveal>
          <Reveal variant="text" delayMs={90}>
            <p className="text-lg text-muted-foreground">
              Let's collaborate on your next Web3 project
            </p>
          </Reveal>
        </div>

        <Reveal delayMs={0}>
          <Card className="bg-card/50 border-primary/20 shadow-elevation">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                  <a href={`mailto:${EMAIL}`} className="w-full sm:w-auto">
                    <Button
                      variant="default"
                      size="lg"
                      className="gap-2 w-full shadow-glow hover:shadow-elevation transition-all"
                    >
                      <Mail className="w-5 h-5" />
                      {EMAIL}
                    </Button>
                  </a>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-secondary rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-6 h-6" />
                  </a>

                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-secondary rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
