import { useState, ReactNode } from "react";
import { cn } from "../utils/cn";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  isInteractive?: boolean;
}

export function GlassPanel({ children, className, isInteractive = true }: GlassPanelProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      tabIndex={isInteractive ? 0 : undefined}
      onFocus={isInteractive ? () => setFocused(true) : undefined}
      onBlur={isInteractive ? () => setFocused(false) : undefined}
      className={cn(
        "relative rounded p-6 bg-depth-teal/40 border border-bronze/65 transition-all duration-400 ease-out backdrop-blur-md",
        isInteractive && "hover:border-teal/50 hover:bg-depth-teal/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
        focused && "outline-none border-gold/70 ring-1 ring-gold/30",
        className
      )}
    >
      {/* Precision corner details for high-end brutalist diagnostic mood */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-teal/40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-teal/40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-teal/40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-teal/40 pointer-events-none" />
      
      {children}
    </div>
  );
}
