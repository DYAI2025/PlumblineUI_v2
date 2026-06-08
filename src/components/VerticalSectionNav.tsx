import { sections } from "../content";
import { cn } from "../utils/cn";

interface VerticalSectionNavProps {
  activeSectionId: string;
}

export function VerticalSectionNav({ activeSectionId }: VerticalSectionNavProps) {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3.5 z-40 select-none"
      aria-label="Progress observer"
    >
      {sections.map((sect) => {
        const isActive = activeSectionId === sect.id;

        return (
          <button
            key={sect.id}
            onClick={() => handleScroll(sect.id)}
            aria-label={`Scroll to ${sect.title}`}
            className="flex items-center justify-end gap-3 text-right group focus:outline-none cursor-pointer"
          >
            {/* Hover details labels */}
            <span
              className={cn(
                "font-mono text-[9px] tracking-widest uppercase transition-all duration-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 font-bold",
                isActive ? "text-gold opacity-80" : "text-bronze"
              )}
            >
              {sect.label}
            </span>

            {/* Numerical index tracker */}
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "font-mono text-[10px] font-bold transition-colors duration-300",
                  isActive ? "text-gold scale-105" : "text-umber group-hover:text-teal"
                )}
              >
                {sect.index}
              </span>

              {/* Physical point element indicator */}
              <div
                className={cn(
                  "w-1.5 h-1.5 transition-all duration-400 border border-transparent rounded-sm",
                  isActive
                    ? "bg-gold border-gold/40 scale-125 rotate-45"
                    : "bg-void border-umber/80 group-hover:bg-teal group-hover:border-teal"
                )}
              />
            </div>
          </button>
        );
      })}
    </nav>
  );
}
