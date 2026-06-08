import { useState } from "react";
import { Terminal, Shield, Eye, Layers, Compass } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { cn } from "../utils/cn";

interface FeatureCardProps {
  title: string;
  cmdOrName: string;
  description: string;
  className?: string;
}

export function FeatureCard({ title, cmdOrName, description, className }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Return specific icon based on the feature trigger
  const getIcon = () => {
    switch (cmdOrName) {
      case "/agileteam":
        return <Terminal className="w-5.5 h-3.5 text-gold" />;
      case "/concilium":
        return <Shield className="w-5.5 h-3.5 text-teal" />;
      case "Reality Ledger":
        return <Layers className="w-5.5 h-3.5 text-gold" />;
      case "Honest Status":
        return <Eye className="w-5.5 h-3.5 text-teal" />;
      case "Agent Explorer":
        return <Compass className="w-5.5 h-3.5 text-gold" />;
      default:
        return <Terminal className="w-5.5 h-3.5 text-teal" />;
    }
  };

  const getForensicMeta = () => {
    switch (cmdOrName) {
      case "/agileteam":
        return { channel: "I/O PROBE", path: "TDD_VERIFY_FLOW", gate: "HUMAN_SIGN_OFF" };
      case "/concilium":
        return { channel: "STRESS_TRIAL", path: "TOKEN_BUDGET_WALL", gate: "COUNCIL_VOTING" };
      case "Reality Ledger":
        return { channel: "CLAIM_REGISTRY", path: "METRIC_SENSORS", gate: "EVIDENCE_GATHER" };
      case "Honest Status":
        return { channel: "TRUTH_DEVIATION", path: "COMPOSITION_MATCH", gate: "GAP_EXPOSER" };
      case "Agent Explorer":
        return { channel: "ASSET_CATALOG", path: "SUBAGENT_SOURCE", gate: "RUNTIME_AUDITING" };
      default:
        return { channel: "GENERIC_RUN", path: "SYSTEM_SANDBOX", gate: "AUDIT_LOGGER" };
    }
  };

  const meta = getForensicMeta();

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("relative group transition-all duration-300 transform hover:-translate-y-0.5", className)}
    >
      <GlassPanel className="h-full flex flex-col justify-between" isInteractive={true}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <span className="font-mono text-xs text-gold bg-gold/10 px-2.5 py-0.5 border border-gold/20 rounded">
              {cmdOrName}
            </span>
            <div className="p-1 rounded bg-depth-teal/30">{getIcon()}</div>
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="font-sans font-extrabold text-base text-teal/90 group-hover:text-gold transition-colors duration-400">
              {title}
            </h3>
            <p className="text-xs text-teal/70 leading-relaxed font-sans mt-2">
              {description}
            </p>
          </div>
        </div>

        {/* Forensic metadata logs section revealed on hover */}
        <div className="mt-5 pt-3 border-t border-umber/40 font-mono text-[9px] relative overflow-hidden h-14">
          <div
            className={`space-y-1 transition-all duration-500 transform ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-40"
            }`}
          >
            <div className="flex justify-between text-[#7F3A0E]">
              <span>SOURCE CHANNEL:</span>
              <span className="text-teal font-semibold">{meta.channel}</span>
            </div>
            <div className="flex justify-between text-[#7F3A0E]">
              <span>EVIDENCE PATH:</span>
              <span className="text-teal font-semibold">{meta.path}</span>
            </div>
            <div className="flex justify-between text-[#7F3A0E]">
              <span>BOUNDARY GATE:</span>
              <span className="text-gold font-bold">{meta.gate}</span>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
