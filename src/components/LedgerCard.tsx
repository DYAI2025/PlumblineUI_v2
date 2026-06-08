import { EvidenceTag } from "./EvidenceTag";
import { Lock, FileText, AlertTriangle, Cpu } from "lucide-react";

export function LedgerCard() {
  return (
    <div className="border border-bronze/50 bg-void font-mono p-5 rounded relative overflow-hidden max-w-xl mx-auto shadow-xl">
      {/* Dynamic top alert frame */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-bronze" />
      
      {/* Header telemetry strip */}
      <div className="flex justify-between items-center text-[9px] text-bronze/75 pb-3 border-b border-umber mb-4">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-gold animate-pulse" />
          <span>CLAIMS AUDIT CHANNELS</span>
        </div>
        <div>
          <span>LEDGER LOG STATE: [INSUFFICIENT]</span>
        </div>
      </div>

      {/* Main Requirement Details */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-umber/30 px-2 py-0.5 rounded border border-umber text-bronze tracking-widest font-black">
                REQ-017
              </span>
              <span className="text-xs font-bold text-teal tracking-wide uppercase">
                OAuth refresh-token rotation
              </span>
            </div>
            <p className="text-[12px] text-teal/80 mt-1.5 leading-relaxed">
              Claim: <span className="text-teal font-medium font-sans">Users stay securely authenticated across sessions without token theft.</span>
            </p>
          </div>
          <Lock className="w-5 h-5 text-bronze shrink-0 mt-1" />
        </div>

        {/* Audit Evidence Ledger */}
        <div className="p-3 bg-depth-teal/20 border border-umber/40 rounded space-y-3">
          <div className="text-[10px] text-bronze/90 uppercase tracking-widest flex items-center gap-1.5 font-bold">
            <FileText className="w-3.5 h-3.5 text-bronze" />
            <span>EXAMINED SIGNAL LEDGER:</span>
          </div>
          
          <div className="space-y-2">
            {/* Row 1 */}
            <div className="flex justify-between items-center text-[11px] py-1 border-b border-umber/20">
              <span className="text-teal/70 font-mono">1. Unit / Integration Stage:</span>
              <div className="flex items-center gap-2">
                <EvidenceTag label="integration-fake" status="insufficient" />
                <span className="text-[9px] text-[#ff4d4d] font-bold">INSUFFICIENT</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex justify-between items-center text-[11px] py-1 border-b border-umber/20">
              <span className="text-teal/70 font-mono">2. Real Environment Probe:</span>
              <div className="flex items-center gap-2">
                <EvidenceTag label="real-boundary-smoke" status="boundary" />
                <span className="text-[9px] text-teal tracking-widest font-bold">REQUIRED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator banner */}
        <div className="border border-bronze/30 bg-umber/10 p-3 rounded flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-bronze shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-bold text-gold uppercase tracking-wider">
              VERDICT STATE: DEFICIENT GAPS EXPOSED
            </div>
            <p className="text-[9px] text-bronze leading-relaxed mt-1">
              STATUS CODE: <span className="text-[#ff4d4d] font-bold">RED</span>. The framework halted because isolated tests passed but the boundary checks were stubbed. No production composition evidence reached the gate yet. This is a non-negotiable value gap.
            </p>
          </div>
        </div>

        {/* Footer microcopy */}
        <div className="text-right text-[8px] text-bronze/60 font-mono scale-95 origin-right">
          A green test is a signal. Not a verdict.
        </div>
      </div>
    </div>
  );
}
