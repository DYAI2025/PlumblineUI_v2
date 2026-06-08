import { useState } from "react";
import { cn } from "../utils/cn";

export type EvidenceStatus = "fake" | "insufficient" | "boundary" | "verified" | "contradiction" | "unverified";

interface EvidenceTagProps {
  label: string;
  status: EvidenceStatus;
  tooltip?: string;
  className?: string;
}

const statusColorMap = {
  fake: "border-bronze text-bronze bg-bronze/5",
  insufficient: "border-umber text-umber bg-umber/5",
  boundary: "border-teal text-teal bg-teal/5",
  verified: "border-gold text-gold bg-gold/5",
  contradiction: "border-bronze text-bronze bg-bronze/10",
  unverified: "border-umber text-umber bg-umber/5",
};

const defaultTooltipMap: Record<string, string> = {
  "fake-only": "No real boundary evidence.",
  "unit-fake": "Local or mocked signal only.",
  "integration-fake": "Integration-shaped, reality still unproven.",
  "real-boundary-smoke": "Minimal real boundary touched.",
  "production-verified": "Production evidence class, not assumed.",
  "user-confirmed": "Human acceptance evidence.",
  "contradiction": "Conflict must be resolved, not smoothed.",
  "not-wired": "Claim not connected to real path.",
  "unverified": "Claim remains unsupported."
};

export function EvidenceTag({ label, status, tooltip, className }: EvidenceTagProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [clicked, setClicked] = useState(false);

  const finalTooltip = tooltip || defaultTooltipMap[label] || `Evidence level: ${status}`;

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  const getStatusLabel = () => {
    if (status === "verified") return "VERIFIED";
    if (status === "boundary") return "BOUNDARY";
    if (status === "insufficient") return "INSUFFICIENT";
    if (status === "fake") return "FAKE";
    if (status === "contradiction") return "CONFLICT";
    return "UNVERIFIED";
  };

  return (
    <div
      className={cn("relative inline-block select-none", className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleClick}
    >
      <div
        className={cn(
          "px-2.5 py-1 font-mono text-[10px] tracking-widest border font-medium rounded-sm flex items-center gap-1.5 transition-all duration-300 cursor-help active:scale-95",
          statusColorMap[status],
          clicked && "ring-1 ring-gold shadow-[0_0_8px_rgba(213,137,27,0.4)]"
        )}
      >
        <span className={cn(
          "w-1.5 h-1.5 rounded-full inline-block animate-pulse",
          status === "verified" && "bg-gold",
          status === "boundary" && "bg-teal",
          status === "insufficient" && "bg-umber",
          status === "fake" && "bg-bronze",
          status === "contradiction" && "bg-bronze",
          status === "unverified" && "bg-umber"
        )} />
        <span className="uppercase">{label}</span>
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-depth-teal border border-bronze text-teal font-mono text-[9px] leading-relaxed z-50 rounded shadow-2xl backdrop-blur-md anim-fade-in">
          <div className="flex justify-between items-center mb-1 pb-1 border-b border-umber text-gold text-[8px] font-bold">
            <span>EVIDENCE ANNOTATION</span>
            <span>{getStatusLabel()}</span>
          </div>
          <p className="text-teal/90">{finalTooltip}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] border-4 border-transparent border-t-depth-teal" />
        </div>
      )}
    </div>
  );
}
