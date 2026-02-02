import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  slug: string;
  icon: React.ReactNode;
}

// ✅ Change just this if you want the cards taller/shorter
const CARD_H = "h-[360px] sm:h-[360px] lg:h-[360px]";

const ProjectCard = ({
  title,
  description,
  tags,
  slug,
  icon,
}: ProjectCardProps) => {
  return (
    <Card
      className={[
        "group",
        "hover:border-primary/50 transition-all",
        "shadow-card hover:shadow-elevation",
        "bg-gradient-card",
        // ✅ FIXED height = equal cards always
        CARD_H,
        // ✅ layout
        "flex flex-col",
      ].join(" ")}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:shadow-glow transition-all">
            {icon}
          </div>
        </div>

        {/* Clamp title so it never expands layout */}
        <CardTitle
          className="text-2xl mb-2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={title}
        >
          {title}
        </CardTitle>

        {/* Clamp description so it never expands layout */}
        <CardDescription
          className="text-base"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={description}
        >
          {description}
        </CardDescription>
      </CardHeader>

      {/* Push footer to bottom (consistent) */}
      <CardContent className="mt-auto">
        {/* Keep tags from wrapping (wrapping makes cards look inconsistent) */}
        <div className="flex flex-nowrap overflow-hidden gap-2 mb-4">
          {tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-primary/30 whitespace-nowrap shrink-0"
              title={tag}
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 4 ? (
            <Badge
              variant="outline"
              className="border-primary/30 whitespace-nowrap shrink-0"
              title={`${tags.length - 4} more`}
            >
              +{tags.length - 4}
            </Badge>
          ) : null}
        </div>

        <Link to={`/project/${slug}`}>
          <Button
            variant="ghost"
            className="w-full gap-2 group-hover:bg-primary/10 group-hover:text-primary"
          >
            View Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
