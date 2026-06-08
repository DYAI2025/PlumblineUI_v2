import { useState } from "react";
import { sections } from "./content";
import { useSectionObserver } from "./hooks/useSectionObserver";
import { GravityInteractionLayer } from "./components/GravityInteractionLayer";
import { VerticalSectionNav } from "./components/VerticalSectionNav";
import { EvidenceTag } from "./components/EvidenceTag";
import { GlassPanel } from "./components/GlassPanel";
import { LedgerCard } from "./components/LedgerCard";
import { FeatureCard } from "./components/FeatureCard";
import { TerminalBlock } from "./components/TerminalBlock";
import { CTAButton } from "./components/CTAButton";
import { SEO } from "./components/SEO";
import { 
  Compass, 
  Terminal, 
  Shield, 
  Activity, 
  HelpCircle, 
  GitBranch, 
  LineChart, 
  ArrowRight, 
  DollarSign, 
  Sparkles,
  Layers
} from "lucide-react";

export default function App() {
  // Set up Section Observer to track current chapter 00-09
  const sectionIds = sections.map((s) => s.id);
  const activeSectionId = useSectionObserver(sectionIds);

  // Section 01 interactive words interactive state
  const [activeWords, setActiveWords] = useState<Record<string, boolean>>({
    tested: false,
    reviewed: false,
    merged: false,
    approved: false,
    done: false,
  });

  const toggleWord = (word: string) => {
    setActiveWords((prev) => ({
      ...prev,
      [word]: !prev[word],
    }));
  };

  const handleNavScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <GravityInteractionLayer>
      {/* 1. Technical SEO Dynamic Headers */}
      <SEO 
        title={`Plumbline — ${activeSectionId ? sections.find(s => s.id === activeSectionId)?.title : 'Evidence-first framework for Claude Code'}`} 
        description="Plumbline separates looks done from is done. Explore a forensic agent framework highlighting claims and true value gaps."
      />

      {/* 2. Side Floating Vertical Navigation */}
      <VerticalSectionNav activeSectionId={activeSectionId} />

      {/* 3. High-End Top Navigation Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-bronze/15 bg-void/80 backdrop-blur-md z-40 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 bg-gold flex items-center justify-center font-mono text-[9px] text-void font-extrabold select-none">
            P
          </div>
          <span className="font-mono text-xs font-black tracking-[0.25em] text-teal">
            PLUMBLINE
          </span>
        </div>

        {/* Desktop Anchor triggers */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-[10px] tracking-widest uppercase">
          <button 
            onClick={() => handleNavScroll("line")} 
            className="text-bronze hover:text-teal transition-colors cursor-pointer"
          >
            THE LINE
          </button>
          <button 
            onClick={() => handleNavScroll("gap")} 
            className="text-bronze hover:text-teal transition-colors cursor-pointer"
          >
            THE GAP
          </button>
          <button 
            onClick={() => handleNavScroll("ledger")} 
            className="text-bronze hover:text-teal transition-colors cursor-pointer"
          >
            THE LEDGER
          </button>
          <button 
            onClick={() => handleNavScroll("machine")} 
            className="text-bronze hover:text-teal transition-colors cursor-pointer"
          >
            MACHINE ROOM
          </button>
          <button 
            onClick={() => handleNavScroll("bench")} 
            className="text-bronze hover:text-teal transition-colors cursor-pointer"
          >
            BENCHMARKS
          </button>
          <button 
            onClick={() => handleNavScroll("install")} 
            className="text-bronze hover:text-teal transition-colors cursor-pointer"
          >
            INSTALL
          </button>
          <button 
            onClick={() => handleNavScroll("support")} 
            className="text-bronze hover:text-teal transition-colors cursor-pointer"
          >
            SPONSOR
          </button>
          <a
            href="https://github.com/DYAI2025/Plumbline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold font-bold hover:text-teal transition-colors cursor-pointer"
          >
            GITHUB
          </a>
        </nav>

        {/* Right Status tag Indicator */}
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase border border-teal/40 px-2.5 py-1 rounded bg-teal/5">
          <span className="w-1.5 h-1.5 bg-gold rounded-full inline-block animate-ping" />
          <span className="text-teal font-semibold">TENSION HANGS TRUE</span>
        </div>
      </header>

      {/* MAIN CONTENT CANVAS */}
      <main className="w-full">
        
        {/* ============================================== */}
        {/* SECTION 00 — Opening / The Drop */}
        {/* ============================================== */}
        <section
          id="drop"
          className="min-h-screen py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative overflow-hidden"
        >
          {/* Symmetrical vertical reference line centered behind content */}
          <div className="physical-line" />

          {/* Absolute Floating Evidence Labels flanking the plumbline */}
          <div className="absolute top-1/4 left-1/4 hidden xl:block z-20">
            <EvidenceTag label="fake-only" status="fake" />
          </div>
          <div className="absolute top-1/3 right-1/4 hidden xl:block z-20">
            <EvidenceTag label="not-wired" status="insufficient" />
          </div>
          <div className="absolute top-1/2 left-[18%] hidden xl:block z-20">
            <EvidenceTag label="contradiction" status="contradiction" />
          </div>
          <div className="absolute top-[65%] right-[22%] hidden xl:block z-20">
            <EvidenceTag label="unverified" status="unverified" />
          </div>
          <div className="absolute top-[75%] left-[30%] hidden xl:block z-20">
            <EvidenceTag label="real-boundary-smoke" status="boundary" />
          </div>
          <div className="absolute top-[82%] right-[15%] hidden xl:block z-20">
            <EvidenceTag label="user-confirmed" status="verified" />
          </div>

          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-8">
              {/* Telemetry microtext */}
              <div className="flex items-center gap-2 font-mono text-[10px] text-bronze uppercase tracking-widest">
                <Compass className="w-4 h-4 text-gold animate-spin" />
                <span>PLUMBLINE SYSTEM INSTRUMENTATION [v0.9.1]</span>
              </div>

              {/* Huge typographic phrase inspired by Mockup A */}
              <h1 className="huge-editorial-title text-teal leading-none tracking-tight">
                WHERE VALUE IS ABSENT,
                <br />
                <span className="text-gold font-black">PLUMBLINE DOES NOT</span>
                <br />
                DECORATE THE GAP.
                <br />
                <span className="bg-gradient-to-r from-teal to-gold bg-clip-text text-transparent">IT SHOWS IT.</span>
              </h1>

              {/* Subline detail */}
              <p className="font-sans text-base md:text-lg text-teal/85 max-w-xl leading-relaxed">
                An evidence-first agent framework for Claude Code — built to separate <span className="text-gold font-semibold">“looks done”</span> from <span className="text-teal font-extrabold">“is done”</span>.
              </p>

              {/* CTA groups and links */}
              <div className="flex flex-wrap gap-4 pt-4">
                <CTAButton variant="primary" onClick={() => handleNavScroll("machine")}>
                  Explore the agents
                </CTAButton>
                <CTAButton variant="secondary" onClick={() => handleNavScroll("install")}>
                  Install Plumbline
                </CTAButton>
                <CTAButton variant="ghost" onClick={() => handleNavScroll("support")}>
                  Sponsor the benchmarks
                </CTAButton>
              </div>

              {/* Bottom statistics microcopy */}
              <div className="pt-6 font-mono text-[9px] text-[#7F3A0E] tracking-widest uppercase border-t border-umber/40 max-w-lg">
                86 subagents · 16 vendored skills · Reality Ledger QA · empirical benchmark harness
              </div>
            </div>

            {/* Right atmospheric text card */}
            <div className="lg:col-span-5 flex justify-end">
              <GlassPanel className="max-w-sm border border-gold/20 p-5 shadow-2xl relative">
                <div className="font-mono text-[9px] text-gold uppercase tracking-widest mb-3">
                  SYSTEM CORE LAW
                </div>
                <blockquote className="font-sans italic text-base text-teal/90 leading-relaxed border-l-2 border-gold pl-3">
                  "Gravity is not a question. Value is not a claim. Plumbline reveals what holds."
                </blockquote>
                <div className="mt-4 font-mono text-[8px] text-bronze text-right">
                  DEVIATION EXPOSURE GATEWAY // ENG_TRUTH
                </div>
              </GlassPanel>
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* SECTION 01 — The Claim Is Not The Value */}
        {/* ============================================== */}
        <section
          id="claim"
          className="min-h-screen py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative bg-depth-teal/20"
        >
          <div className="max-w-4xl mx-auto w-full relative z-10 space-y-12">
            <div className="space-y-4">
              <span className="micro-ui-label text-gold">CHAPTER 01 // PRINCIPLE</span>
              <h2 className="font-sans font-black text-2xl md:text-5xl text-teal uppercase tracking-tight">
                Green is not true.
              </h2>
            </div>

            {/* Clickable interactive words loop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 font-sans text-base text-teal/85 leading-relaxed max-w-2xl">
                <p>
                  A test can be{" "}
                  <button
                    onClick={() => toggleWord("tested")}
                    className={`px-1.5 py-0.5 rounded font-mono text-xs uppercase font-bold tracking-widest transition-all cursor-pointer ${
                      activeWords.tested ? "bg-bronze text-void border border-bronze" : "border border-teal/30 hover:border-teal text-teal hover:bg-teal/5"
                    }`}
                  >
                    tested
                  </button>{" "}
                  and approve.
                  <br />
                  A review can{" "}
                  <button
                    onClick={() => toggleWord("reviewed")}
                    className={`px-1.5 py-0.5 rounded font-mono text-xs uppercase font-bold tracking-widest transition-all cursor-pointer ${
                      activeWords.reviewed ? "bg-umber text-teal border border-umber" : "border border-teal/30 hover:border-teal text-teal hover:bg-teal/5"
                    }`}
                  >
                    reviewed
                  </button>{" "}
                  and merge.
                  <br />
                  An agent can{" "}
                  <button
                    onClick={() => toggleWord("merged")}
                    className={`px-1.5 py-0.5 rounded font-mono text-xs uppercase font-bold tracking-widest transition-all cursor-pointer ${
                      activeWords.merged ? "bg-bronze text-void border border-bronze" : "border border-teal/30 hover:border-teal text-teal hover:bg-teal/5"
                    }`}
                  >
                    merged
                  </button>{" "}
                  perfectly.
                  <br />
                  A task can be{" "}
                  <button
                    onClick={() => toggleWord("approved")}
                    className={`px-1.5 py-0.5 rounded font-mono text-xs uppercase font-bold tracking-widest transition-all cursor-pointer ${
                      activeWords.approved ? "bg-gold text-void border border-gold" : "border border-teal/30 hover:border-teal text-teal hover:bg-teal/5"
                    }`}
                  >
                    approved
                  </button>{" "}
                  as{" "}
                  <button
                    onClick={() => toggleWord("done")}
                    className={`px-1.5 py-0.5 rounded font-mono text-xs uppercase font-bold tracking-widest transition-all cursor-pointer ${
                      activeWords.done ? "bg-[#ff4d4d] text-void border border-[#ff4d4d]" : "border border-teal/30 hover:border-teal text-teal hover:bg-teal/5"
                    }`}
                  >
                    done
                  </button>{" "}
                  completely.
                </p>
                <p className="text-gold font-extrabold text-lg">
                  And still nothing real has happened.
                </p>
                <p className="text-xs text-bronze border-l-2 border-umber pl-4">
                  Plumbline exists for the moment when “done” looks convincing — but value has not crossed the boundary into reality.
                </p>
              </div>

              {/* Forensic diagnosis readout panel showing failure labels */}
              <GlassPanel className="p-5 font-mono space-y-4">
                <div className="text-[10px] text-bronze uppercase tracking-wider pb-2 border-b border-umber">
                  ACTIVE CRITICAL ANALYSIS
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span>TEST STATE:</span>
                    {activeWords.tested ? (
                      <span className="text-bronze font-bold flex items-center gap-2">
                        [unit-fake] WARNING
                      </span>
                    ) : (
                      <span className="text-teal/40 italic">[Click 'tested' trigger]</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>REVIEW STATE:</span>
                    {activeWords.reviewed ? (
                      <span className="text-umber font-bold flex items-center gap-2">
                        [not wired] CRITICAL
                      </span>
                    ) : (
                      <span className="text-teal/40 italic">[Click 'reviewed' trigger]</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>MERGE QUALITY:</span>
                    {activeWords.merged ? (
                      <span className="text-bronze font-bold flex items-center gap-2">
                        [no boundary proof]
                      </span>
                    ) : (
                      <span className="text-teal/40 italic">[Click 'merged' trigger]</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>APPROVAL GATES:</span>
                    {activeWords.approved ? (
                      <span className="text-gold font-bold flex items-center gap-2">
                        [no user confirmation]
                      </span>
                    ) : (
                      <span className="text-teal/40 italic">[Click 'approved' trigger]</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>DELIVERY THREAD:</span>
                    {activeWords.done ? (
                      <span className="text-[#ff4d4d] font-bold flex items-center gap-2">
                        ▲ [value-risk] RETRIEVAL_VOID
                      </span>
                    ) : (
                      <span className="text-teal/40 italic">[Click 'done' trigger]</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-[9px] text-bronze uppercase border-t border-umber">
                  Plumbline does not punish failure. It exposes unsupported certainty.
                </div>
              </GlassPanel>
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* SECTION 02 — The Line */}
        {/* ============================================== */}
        <section
          id="line"
          className="min-h-screen py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative bg-[#17110D]"
        >
          <div className="physical-line" />

          <div className="max-w-4xl mx-auto w-full relative z-10 space-y-12">
            <div className="space-y-4">
              <span className="micro-ui-label text-gold">CHAPTER 02 // ANALOGY</span>
              <h2 className="font-sans font-black text-2xl md:text-5xl text-teal uppercase tracking-tight">
                A plumb line does not argue. <span className="text-gold">It shows.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans text-base text-teal/85 leading-relaxed">
              <div className="space-y-6">
                <p>
                  A plumb line is one of the oldest instruments for truth in construction. It does not negotiate with the builder. It does not care how straight the wall appears.
                </p>
                <p className="font-bold text-gold">
                  It follows gravity — and by following it, reveals deviation.
                </p>
                <p>
                  Plumbline applies the same physical principle to agentic software work today inside Claude Code.
                </p>
              </div>

              <div className="space-y-6 bg-depth-teal/15 p-6 border border-bronze/35 rounded">
                <div className="pb-2 border-b border-umber font-mono text-[10px] text-bronze uppercase tracking-widest">
                  DECIDING VERTS
                </div>
                
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <span className="text-bronze font-bold uppercase block text-[10px]">PROCESS INQUIRY:</span>
                    <span className="text-teal">“Did the agent finish compiling?”</span>
                  </div>
                  <div>
                    <span className="text-gold font-bold uppercase block text-[10px]">VALUE INQUIRY:</span>
                    <span className="text-gold font-black">“Does the result still hang true against confirmed human value?”</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-umber/40">
                  <p className="text-xs uppercase tracking-widest font-bold text-teal font-mono">
                    The reference is not the process. The reference is value.
                  </p>
                  <p className="text-xs font-mono text-bronze italic mt-1.5">
                    "Der Prozess ist nicht die Referenz. Der Wert ist die Referenz."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* SECTION 03 — The Gap */}
        {/* ============================================== */}
        <section
          id="gap"
          className="min-h-screen py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative bg-depth-teal/10"
        >
          <div className="max-w-4xl mx-auto w-full relative z-10 space-y-12">
            <div className="space-y-4">
              <span className="micro-ui-label text-gold">CHAPTER 03 // EXPOSURE</span>
              <h2 className="font-sans font-black text-2xl md:text-5xl text-teal uppercase tracking-tight">
                Where value is absent, Plumbline does not decorate the gap. <span className="text-gold">It shows it.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 font-sans text-base text-teal/85 leading-relaxed">
                <p>
                  Plumbline does not add another layer of confidence theater. It does not turn mock evidence into product truth. It does not let a fake boundary pass as reality.
                </p>
                <p className="font-bold text-gold">
                  If value is missing, the gap remains visible.
                </p>
                <p className="text-xs text-bronze border-l-2 border-umber/60 pl-4 font-mono">
                  A feature touching I/O, APIs, UI, remotes or production configuration cannot be called real just because isolated mocks compiled. The line only holds when proof reaches the boundary.
                </p>
              </div>

              {/* Grid of Evidence Badges */}
              <GlassPanel className="p-6 space-y-4">
                <div className="font-mono text-[9px] text-[#7F3A0E] uppercase pb-2 border-b border-umber">
                  DEMANDABLE CLAIMS SPECIFICATION GATES
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <EvidenceTag label="fake-only" status="fake" />
                  <EvidenceTag label="unit-fake" status="fake" />
                  <EvidenceTag label="integration-fake" status="insufficient" />
                  <EvidenceTag label="real-boundary-smoke" status="boundary" />
                  <EvidenceTag label="production-verified" status="verified" />
                  <EvidenceTag label="user-confirmed" status="verified" />
                </div>
                
                <div className="p-3 bg-void border border-umber/40 rounded text-[10px] font-mono text-bronze">
                  <span>TIP: Hover tags for diagnostic commentary or click them for state ping.</span>
                </div>
              </GlassPanel>
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* SECTION 04 — The Ledger */}
        {/* ============================================== */}
        <section
          id="ledger"
          className="min-h-screen py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative bg-[#17110D]"
        >
          <div className="max-w-4xl mx-auto w-full relative z-10 space-y-12">
            <div className="space-y-4">
              <span className="micro-ui-label text-gold">CHAPTER 04 // EVIDENCE TRACER</span>
              <h2 className="font-sans font-black text-2xl md:text-5xl text-teal uppercase tracking-tight">
                Every requirement carries evidence.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6 font-sans text-base text-teal/85 leading-relaxed">
                <p>
                  Plumbline turns development and product requirements into card logs of claims and physical proofs.
                </p>
                <div className="font-mono text-xs space-y-2 bg-depth-teal/10 p-5 border border-umber/35 rounded">
                  <span className="text-gold font-bold block mb-1 uppercase text-[10px]">VERIFIED GATES:</span>
                  <div>▲ What value does this serve?</div>
                  <div>▲ Where is it wired to active output?</div>
                  <div>▲ Which physical boundary did it cross?</div>
                  <div>▲ What evidence supports it?</div>
                  <div>▲ Who accepted it?</div>
                </div>
              </div>

              {/* Dynamic Ledger Card instance */}
              <div className="lg:col-span-7">
                <LedgerCard />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* SECTION 05 — The Machine Room */}
        {/* ============================================== */}
        <section
          id="machine"
          className="min-h-screen py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative bg-depth-teal/10"
        >
          <div className="max-w-6xl mx-auto w-full relative z-10 space-y-12">
            <div className="space-y-4 text-center">
              <span className="micro-ui-label text-gold">CHAPTER 05 // SYSTEM GATES</span>
              <h2 className="font-sans font-black text-2xl md:text-5xl text-teal uppercase tracking-tight max-w-2xl mx-auto">
                Welcome to the machine room.
              </h2>
              <p className="font-sans text-teal/80 text-base max-w-xl mx-auto">
                Plumbline is not just a manifesto. It ships as a complete agentic delivery environment matching product design guidelines.
              </p>
            </div>

            {/* Bento Grid layout of diverse features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <FeatureCard
                cmdOrName="/agileteam"
                title="Autonomous Delivery Pipeline"
                description="Manages complete task progressions: requirements → PRD → TDD → review → security → validation → human acceptance."
                className="lg:col-span-3"
              />
              <FeatureCard
                cmdOrName="/concilium"
                title="Four-Body Council"
                description="Market, Tech, Skeptic, and Distribution agents stress-test ideas inside Claude Code before consuming tokens."
                className="lg:col-span-3"
              />
              <FeatureCard
                cmdOrName="Reality Ledger"
                title="Rigorous Evidence Classes"
                description="Each requirement receives an explicit evidence class matching reality boundaries. Fake mocks remain fake."
                className="lg:col-span-2"
              />
              <FeatureCard
                cmdOrName="Honest Status"
                title="Command for Truth"
                description="Expose what complies and what remains unverified. Perfect for direct structural evaluation audits."
                className="lg:col-span-2"
              />
              <FeatureCard
                cmdOrName="Agent Explorer"
                title="Zero-Install Inspector"
                description="Browser console interface to study dynamic capability limits, triggers, source code, and security rules."
                className="lg:col-span-2"
              />
              {/* Extra technical card to balance grid */}
              <div className="border border-bronze/65 bg-depth-teal/30 backdrop-blur-md rounded p-6 flex flex-col justify-between font-mono text-[10px] text-bronze h-full min-h-[150px] lg:col-span-6">
                <div className="space-y-2">
                  <span className="text-gold uppercase tracking-widest font-black block">SYSTEM OVERKILL WARNING</span>
                  <p className="font-sans text-teal/70 leading-relaxed text-xs">
                    This structure is built specifically for auditable human-agent software systems where confidence theater is a project hazard.
                  </p>
                </div>
                <div className="pt-4 border-t border-umber/45 flex justify-between items-center uppercase tracking-widest text-[#7F3A0E] text-[8px]">
                  <span>AUDITABLE ENGINE LOGS // ACTIVE</span>
                  <span className="text-gold font-bold">READY_</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* SECTION 06 — The Benchmark */}
        {/* ============================================== */}
        <section
          id="bench"
          className="min-h-screen py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative bg-[#17110D]"
        >
          <div className="max-w-4xl mx-auto w-full relative z-10 space-y-12">
            <div className="space-y-4">
              <span className="micro-ui-label text-gold">CHAPTER 06 // AUDIT BENCHMARKS</span>
              <h2 className="font-sans font-black text-2xl md:text-5xl text-teal uppercase tracking-tight">
                We measured the idea we wanted to believe. <span className="text-bronze">It did not fully survive.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6 font-sans text-base text-teal/85 leading-relaxed">
                <p>
                  Plumbline benchmarked its own agent framework. The result was not a clean marketing win.
                </p>
                <p>
                  Prompt discipline helped on specific gates. It did not magically fix weaker models. Some boundary failures were caught only by stronger model judgment profiles.
                </p>
                <p className="text-gold font-bold">
                  The benchmark did not make Plumbline smaller. It made it honest. So the raw result stayed in the repo.
                </p>
              </div>

              {/* Benchmarking data cards */}
              <div className="grid grid-cols-2 gap-4">
                <GlassPanel className="p-4" isInteractive={false}>
                  <span className="font-mono text-[9px] text-bronze uppercase font-black block mb-1">Measured:</span>
                  <p className="text-xs text-teal font-sans font-bold">mutation-oracle benchmarks</p>
                </GlassPanel>
                
                <GlassPanel className="p-4" isInteractive={false}>
                  <span className="font-mono text-[9px] text-gold uppercase font-black block mb-1">Found:</span>
                  <p className="text-xs text-teal font-sans">prompt discipline improves recall limits</p>
                </GlassPanel>

                <GlassPanel className="p-4" isInteractive={false}>
                  <span className="font-mono text-[9px] text-bronze uppercase font-black block mb-1">Also Found:</span>
                  <p className="text-xs text-[#ff4d4d] font-sans">model capability dominates boundary judgment</p>
                </GlassPanel>

                <GlassPanel className="p-4" isInteractive={false}>
                  <span className="font-mono text-[9px] text-teal uppercase font-black block mb-1">Published:</span>
                  <p className="text-xs text-teal font-sans">wins, failures, and structural trade-offs</p>
                </GlassPanel>
              </div>
            </div>

            {/* Bottom forensic hard line */}
            <div className="p-5 border border-bronze/45 bg-depth-teal/15 rounded flex items-center justify-between pointer-events-none">
              <span className="font-mono text-xs uppercase tracking-widest text-bronze">FORENSIC VERDICT:</span>
              <p className="font-mono text-xs text-gold font-extrabold text-right uppercase">
                "Net-positive on Opus, trade-off on sub-Opus."
              </p>
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* SECTION 07 — The Install */}
        {/* ============================================== */}
        <section
          id="install"
          className="min-h-screen py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative bg-depth-teal/10"
        >
          <div className="max-w-4xl mx-auto w-full relative z-10 space-y-12">
            <div className="space-y-4">
              <span className="micro-ui-label text-gold">CHAPTER 07 // SETUP</span>
              <h2 className="font-sans font-black text-2xl md:text-5xl text-teal uppercase tracking-tight">
                Install the line.
              </h2>
              <p className="font-sans text-teal/80 text-base leading-relaxed max-w-xl">
                Plumbline runs natively inside Claude Code. No MCP server is required for default deployments.
              </p>
            </div>

            {/* Side-by-side terminal configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <div className="font-mono text-[10px] text-gold uppercase tracking-widest font-extrabold">
                  01 // MOUNT CORE AGENT COMMANDS
                </div>
                <TerminalBlock lines={[
                  "git clone https://github.com/DYAI2025/Plumbline plumbline",
                  "cd plumbline",
                  "./config/claude/install.sh"
                ]} />
              </div>

              <div className="space-y-4">
                <div className="font-mono text-[10px] text-teal uppercase tracking-widest font-extrabold">
                  02 // EXECUTE AGENT DELIVERIES
                </div>
                <TerminalBlock lines={[
                  '/agileteam "add OAuth2 login with refresh-token rotation"'
                ]} />
              </div>
            </div>

            {/* Setup Advice Hint */}
            <div className="p-4 bg-void border border-umber/45 rounded space-y-2">
              <span className="font-mono text-[9px] text-[#ff4d4d] font-black uppercase">CORE ENGINE ADVICE:</span>
              <p className="font-sans text-xs text-teal/80 leading-relaxed">
                For best truth-checking quality, use Opus on verification checking gates. Lower-cost models can run the workflow, but the README documents where their boundary judgment remains weak.
              </p>
            </div>

            {/* Navigation action buttons group */}
            <div className="flex flex-wrap gap-4 justify-start pt-4">
              <CTAButton variant="primary" href="https://github.com/DYAI2025/Plumbline">
                Open GitHub Repository
              </CTAButton>
              <CTAButton variant="secondary" onClick={() => handleNavScroll("machine")}>
                Launch Agent Explorer
              </CTAButton>
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* SECTION 08 — The Patronage */}
        {/* ============================================== */}
        <section
          id="support"
          className="min-h-screen py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative bg-[#17110D]"
        >
          <div className="max-w-4xl mx-auto w-full relative z-10 space-y-12">
            <div className="space-y-4">
              <span className="micro-ui-label text-gold">CHAPTER 08 // SPONSORSHIP</span>
              <h2 className="font-sans font-black text-2xl md:text-5xl text-teal uppercase tracking-tight">
                Fund the measurement. <span className="text-[#ff4d4d]">Not the theater.</span>
              </h2>
              <p className="font-sans text-teal/80 text-base leading-relaxed max-w-2xl">
                Plumbline's central claims are measured, not asserted. That costs real model tokens. Sponsorship funds daily benchmark runs, oracle corpora, and deeper evaluation.
              </p>
            </div>

            {/* Sponsor levels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassPanel className="p-6 flex flex-col justify-between h-full border border-bronze/40" isInteractive={true}>
                <div>
                  <div className="font-mono text-xs text-teal border border-teal/20 bg-teal/5 px-2 py-0.5 inline-block rounded mb-4">
                    LEVEL 01
                  </div>
                  <h3 className="font-sans font-bold text-lg text-teal mb-2">Haiku Supporter</h3>
                  <div className="font-mono text-xl text-gold font-extrabold mb-4">$25 / mo</div>
                  <p className="font-sans text-xs text-teal/70 leading-relaxed">
                    Keeps daily smoke checks alive on standard integrations and CLI stubs.
                  </p>
                </div>
                <div className="pt-6">
                  <CTAButton variant="secondary" className="w-full" href="https://github.com/DYAI2025/Plumbline">
                    Support
                  </CTAButton>
                </div>
              </GlassPanel>

              <GlassPanel className="p-6 flex flex-col justify-between h-full border-2 border-gold" isInteractive={true}>
                <div>
                  <div className="font-mono text-xs text-gold border border-gold/45 bg-gold/15 px-2 py-0.5 inline-block rounded mb-4 font-extrabold">
                    RECOMMENDED
                  </div>
                  <h3 className="font-sans font-bold text-lg text-teal mb-2">Opus Validator</h3>
                  <div className="font-mono text-xl text-gold font-extrabold mb-4">$120 / mo</div>
                  <p className="font-sans text-xs text-teal/70 leading-relaxed">
                    Funds deep evaluation runs and physical boundary traps testing across new models.
                  </p>
                </div>
                <div className="pt-6">
                  <CTAButton variant="primary" className="w-full" href="https://github.com/DYAI2025/Plumbline">
                    SUPPORT CORE
                  </CTAButton>
                </div>
              </GlassPanel>

              <GlassPanel className="p-6 flex flex-col justify-between h-full border border-bronze/40" isInteractive={true}>
                <div>
                  <div className="font-mono text-xs text-teal border border-teal/20 bg-teal/5 px-2 py-0.5 inline-block rounded mb-4">
                    LEVEL 03
                  </div>
                  <h3 className="font-sans font-bold text-lg text-teal mb-2">Enterprise Governance</h3>
                  <div className="font-mono text-xl text-gold font-extrabold mb-4">$500 / mo</div>
                  <p className="font-sans text-xs text-teal/70 leading-relaxed">
                    Supports sustained benchmarking and high-end core Reality Ledger development priorities.
                  </p>
                </div>
                <div className="pt-6">
                  <CTAButton variant="secondary" className="w-full" href="https://github.com/DYAI2025/Plumbline">
                    Partner
                  </CTAButton>
                </div>
              </GlassPanel>
            </div>

            {/* Disclaimer strip */}
            <div className="p-4 bg-depth-teal/20 border border-umber text-center font-mono text-[9px] text-bronze uppercase tracking-widest leading-relaxed">
              Disclaimer: Sponsorship supports an open-source project. It is not an SLA, a paid product, or a feature guarantee.
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* SECTION 09 — Final Manifesto */}
        {/* ============================================== */}
        <section
          id="final"
          className="min-h-screen py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative bg-depth-teal/10"
        >
          {/* Vertical convergence line ends here */}
          <div className="physical-line" />

          <div className="max-w-4xl mx-auto w-full relative z-10 space-y-12 text-center">
            <div className="space-y-4">
              <span className="micro-ui-label text-gold">CHAPTER 09 // EPILOGUE</span>
              <h2 className="huge-editorial-title text-gold inline-block tracking-tight max-w-4xl font-black">
                The line remains true. <span className="text-teal">Or it does not.</span>
              </h2>
            </div>

            <div className="max-w-xl mx-auto space-y-6 font-sans text-base text-teal/85 leading-relaxed">
              <p>
                Plumbline is built for the uncomfortable part of agentic software work: the place where consensus is not enough, tests are not enough, and confidence becomes dangerous without evidence.
              </p>
              <p className="font-extrabold text-[#ff4d4d]">
                It does not promise that agents cannot fail. It makes failure harder to hide.
              </p>
              
              {/* Selective narrow light cone container representing the final statement */}
              <div className="p-6 bg-void border border-gold/35 rounded space-y-3 shadow-xl">
                <span className="font-mono text-[8.5px] text-[#7F3A0E] tracking-widest uppercase block font-black">
                  FINAL VERDICT WARNING
                </span>
                <p className="font-mono text-xs text-gold uppercase leading-relaxed tracking-wider font-extrabold">
                  "If you only need a single prompt, this is overkill."
                </p>
                <p className="text-xs text-teal/80 leading-relaxed font-sans">
                  If you want to build, inspect, and evolve autonomous developers that prove they hang true: <span className="text-gold font-bold">welcome to the machine room.</span>
                </p>
              </div>
            </div>

            {/* Final CTA Buttons alignment */}
            <div className="flex flex-wrap gap-4 justify-center pt-8">
              <CTAButton variant="primary" onClick={() => handleNavScroll("install")}>
                Explore Plumbline
              </CTAButton>
              <CTAButton variant="secondary" onClick={() => handleNavScroll("line")}>
                Install Locally
              </CTAButton>
              <CTAButton variant="ghost" onClick={() => handleNavScroll("support")}>
                Sponsor benchmark truth
              </CTAButton>
            </div>
            
            {/* Fine print copy */}
            <div className="pt-16 font-mono text-[8px] text-bronze uppercase tracking-[0.3em] select-none">
              PLUMBLINE SYSTEM // G_REF_ALIGN_TRUTH_GATES
            </div>
          </div>
        </section>

      </main>

      {/* Atmospheric Footer */}
      <footer className="w-full border-t border-bronze/15 bg-void py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 relative z-20 text-[10px] font-mono text-bronze">
        <div>
          <span>© 2026 PLUMBLINE GATEWAY LABS. MIT EXPLICIT LICENSE.</span>
        </div>
        <div className="flex gap-6 uppercase">
          <a href="#drop" className="hover:text-teal transition-colors">TOP</a>
          <a href="https://github.com/DYAI2025/Plumbline" className="hover:text-teal transition-colors">GITHUB</a>
          <a href="/public/llms.txt" className="hover:text-teal transition-colors">LLMS.TXT</a>
          <a href="/public/robots.txt" className="hover:text-teal transition-colors">ROBOTS.TXT</a>
        </div>
      </footer>
    </GravityInteractionLayer>
  );
}
