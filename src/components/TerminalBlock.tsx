import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface TerminalBlockProps {
  lines: string[];
}

export function TerminalBlock({ lines }: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  const fullText = lines.join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = fullText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {}
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="bg-[#0B282A]/45 border border-bronze/50 rounded overflow-hidden font-mono text-xs w-full max-w-xl mx-auto shadow-2xl relative group">
      {/* Upper window actions bar */}
      <div className="flex justify-between items-center bg-void/90 px-4 py-2 border-b border-umber">
        <div className="flex items-center gap-1.5 text-bronze text-[9px] uppercase tracking-wider font-bold">
          <Terminal className="w-3.5 h-3.5 text-gold animate-pulse" />
          <span>FORENSIC OPERATING LOG</span>
        </div>
        
        {/* Copy Trigger */}
        <button
          onClick={handleCopy}
          aria-label="Copy terminal command to clipboard"
          className="flex items-center gap-1.5 text-bronze hover:text-gold transition-colors text-[10px] uppercase font-semibold cursor-pointer py-0.5 px-2 rounded hover:bg-umber/30 focus:outline-none focus:ring-1 focus:ring-gold"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-gold" />
              <span className="text-gold">line copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>COPY RUN</span>
            </>
          )}
        </button>
      </div>

      {/* Code Text Panel */}
      <div className="p-4 overflow-x-auto whitespace-pre leading-relaxed text-teal/95 relative max-h-72">
        {lines.map((ln, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-[10px] text-bronze/50 select-none text-right w-5 pt-0.5">{(i + 1).toString().padStart(2, "0")}</span>
            <span className="text-gold/40 select-none font-bold pt-0.5">$</span>
            <span className="flex-1 font-mono tracking-wide leading-relaxed truncate">{ln}</span>
          </div>
        ))}
        
        {/* Animated simulation cursor */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 pointer-events-none select-none">
          <span className="text-[8px] text-bronze/60 uppercase">ACTIVE_GATE</span>
          <span className="w-2 h-4 bg-gold animate-pulse inline-block" />
        </div>
      </div>
    </div>
  );
}
