export interface SectionData {
  id: string;
  label: string;
  index: string;
  title: string;
  headline: string;
}

export const sections = [
  {
    id: "drop",
    index: "00",
    label: "DROP",
    title: "The Drop",
    headline: "Does it hang true?",
    phrase: "Where value is absent, Plumbline does not decorate the gap. It shows it.",
    overlay: "Gravity is not a question. Value is not a claim. Plumbline reveals what holds.",
    subline: "An evidence-first agent framework for Claude Code — built to separate “looks done” from “is done”."
  },
  {
    id: "claim",
    index: "01",
    label: "CLAIM",
    title: "The Claim Is Not The Value",
    headline: "Green is not true.",
    copy: "A test can be green. A review can approve. An agent can agree. A task can be closed. And still nothing real has happened.",
    follow: "Plumbline exists for the moment when “done” looks convincing — but value has not crossed the boundary into reality."
  },
  {
    id: "line",
    index: "02",
    label: "LINE",
    title: "The Line",
    headline: "A plumb line does not argue. It shows.",
    copy: "A plumb line is one of the oldest instruments for truth in construction. It does not negotiate with the builder. It does not care how straight the wall appears. It follows gravity — and by following it, reveals deviation.",
    transfer: "Plumbline applies the same principle to agentic software work.",
    not: "Did the agent finish?",
    but: "Does the result still hang true against confirmed human value?",
    core: "The reference is not the process. The reference is value.",
    german: "Der Prozess ist nicht die Referenz. Der Wert ist die Referenz."
  },
  {
    id: "gap",
    index: "03",
    label: "GAP",
    title: "The Gap",
    headline: "Where value is absent, Plumbline does not decorate the gap. It shows it.",
    copy: "Plumbline does not add another layer of confidence theater. It does not turn mock evidence into product truth. It does not let a fake boundary pass as reality. If value is missing, the gap remains visible.",
    explanation: "A feature touching I/O, APIs, UI, remotes or production composition cannot be called real because isolated tests passed. The line only holds when the evidence reaches the boundary."
  },
  {
    id: "ledger",
    index: "04",
    label: "LEDGER",
    title: "The Ledger",
    headline: "Every requirement carries evidence.",
    copy: "Plumbline turns product work into a ledger of claims and proofs. Every requirement must answer: What value does this serve? Where is it wired? Which boundary did it cross? What evidence supports it? Who accepted it?",
    ledgerCard: {
      id: "REQ-017",
      title: "OAuth refresh-token rotation",
      claim: "Users stay securely authenticated across sessions.",
      evidenceFake: "integration-fake → insufficient",
      evidenceRequired: "real-boundary-smoke → required",
      status: "RED until production composition is touched."
    },
    microcopy: "A green test is a signal. Not a verdict."
  },
  {
    id: "machine",
    index: "05",
    label: "MACHINE",
    title: "Machine Room",
    headline: "Welcome to the machine room.",
    copy: "Plumbline is not just a manifesto. It ships an agentic delivery system for Claude Code: requirements, TDD, independent review, security, validation, product judgment and human sign-off.",
    features: [
      {
        cmd: "/agileteam",
        title: "Autonomous Delivery Pipeline",
        description: "requirements → PRD → TDD → review → security → validation → product judgment → human acceptance."
      },
      {
        cmd: "/concilium",
        title: "Four-Body Council",
        description: "Market, Tech, Skeptic and Distribution stress-test the idea before the build consumes tokens."
      },
      {
        name: "Reality Ledger",
        title: "Evidence Classes",
        description: "Each requirement receives an evidence class. Fake stays fake. Boundary proof stays explicit."
      },
      {
        name: "Honest Status",
        title: "A Command for Truth",
        description: "Separating what looks done from what is done — including what remains unverified."
      },
      {
        name: "Agent Explorer",
        title: "Zero-Install Browser Interface",
        description: "Inspect the subagent library: categories, tools, triggers, source links directly."
      }
    ],
    microcopy: "This is overkill for a single prompt. It is built for auditable agent systems."
  },
  {
    id: "bench",
    index: "06",
    label: "BENCH",
    title: "Benchmarks",
    headline: "We measured the idea we wanted to believe. It did not fully survive.",
    copy: "Plumbline benchmarked its own agent framework. The result was not a clean marketing win. Prompt discipline helped in one place. It did not magically fix weaker models. Some boundary failures were caught only by stronger model judgment. So the result stayed in the repo.",
    message: "The benchmark did not make Plumbline smaller. It made it honest.",
    cards: [
      { label: "Measured", text: "mutation-oracle benchmarks" },
      { label: "Found", text: "prompt discipline can improve recall" },
      { label: "Also found", text: "model capability dominates real-boundary judgment" },
      { label: "Published", text: "wins, failures, trade-offs" }
    ],
    summary: "“The DNA is strictly better” would be a lie. “Net-positive on Opus, trade-off on sub-Opus” is closer to truth."
  },
  {
    id: "install",
    index: "07",
    label: "INSTALL",
    title: "Install",
    headline: "Install the line.",
    copy: "Plumbline runs inside Claude Code. No MCP server is required for the default install. The lean install mounts the core governance agents, commands, skills and hooks.",
    hint: "For best truth-checking quality, use Opus on the checking gates. Lower-cost models can run the workflow, but the README documents where their boundary judgment is weaker."
  },
  {
    id: "support",
    index: "08",
    label: "SUPPORT",
    title: "Sponsor",
    headline: "Fund the measurement. Not the theater.",
    copy: "Plumbline’s central claims are measured, not asserted. That costs real model tokens. Sponsorship funds benchmark runs, oracle corpora, smoke checks and deeper evaluation across model classes.",
    tiers: [
      {
        name: "Haiku Supporter",
        p: "$25/mo",
        desc: "Keeps daily smoke checks alive."
      },
      {
        name: "Opus Validator",
        p: "$120/mo",
        desc: "Funds deep evaluation runs and boundary traps."
      },
      {
        name: "Enterprise Governance Patron",
        p: "$500/mo",
        desc: "Supports sustained benchmarking and Reality Ledger priorities."
      }
    ],
    disclaimer: "Sponsorship supports an open-source project. It is not an SLA, a paid product, or a feature guarantee."
  },
  {
    id: "final",
    index: "09",
    label: "FINAL",
    title: "Final Manifesto",
    headline: "The line remains true. Or it does not.",
    copy: "Plumbline is built for the uncomfortable part of agentic software work: the place where consensus is not enough, tests are not enough, and confidence becomes dangerous without evidence. It does not promise that agents cannot fail. It makes failure harder to hide.",
    overkill: "If you only need a single prompt, this is overkill.",
    join: "If you want to build, inspect and evolve agent systems that prove they hang true:",
    welcome: "welcome to the machine room."
  }
];
