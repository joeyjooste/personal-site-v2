import { useState, useEffect, useRef } from "react";

const App = () => {
  const [section, setSection] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!section || section !== "terminal") return;
    if (terminalLines.length > 0) return;

    const lines = [
      "> initializing...",
      "> loading void linux kernel...",
      "> starting dwm...",
      "> executing ~/.xinitrc...",
      "> ready.",
      "",
      "  welcome to joeyjooste.com",
      "",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setTerminalLines((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [section]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const experience = [
    {
      year: "2025",
      role: "Engineer",
      place: "Fused",
      note: "AI agents",
    },
    {
      year: "2024",
      role: "Co-founder",
      place: "CodeYard",
      note: "RAG before it was cool",
    },
    {
      year: "2023",
      role: "Freelance",
      place: "Independent",
      note: "Golang APIs, web systems",
    },
  ];

  const links = [
    { label: "github", href: "https://github.com/joeyjooste" },
    { label: "linkedin", href: "https://linkedin.com/in/joeyjooste" },
    { label: "email", href: "mailto:hello@joeyjooste.com" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Ambient cursor glow */}
      <div
        className="fixed w-96 h-96 rounded-full pointer-events-none transition-all duration-300 ease-out opacity-15 blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
          left: cursor.x,
          top: cursor.y,
        }}
      />

      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center">
          <span className="text-sm tracking-widest text-zinc-400">JJ</span>
          <div className="flex gap-6 text-sm">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-emerald-400 transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 py-32">
          {/* Hero */}
          <div className="max-w-5xl">
            <div className="overflow-hidden mb-2">
              <h1
                className="text-[12vw] md:text-[8vw] font-bold leading-[0.85] tracking-tighter text-white transition-transform duration-1000 ease-out"
                style={{
                  transform: isLoaded ? "translateY(0)" : "translateY(100%)",
                }}
              >
                JOEY
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1
                className="text-[12vw] md:text-[8vw] font-bold leading-[0.85] tracking-tighter text-emerald-400 transition-transform duration-1000 ease-out delay-100"
                style={{
                  transform: isLoaded ? "translateY(0)" : "translateY(100%)",
                }}
              >
                JOOSTE
              </h1>
            </div>

            <div
              className="mt-12 flex flex-col md:flex-row md:items-end gap-8 md:gap-16 transition-opacity duration-1000 ease-out"
              style={{
                opacity: isLoaded ? 1 : 0,
                transitionDelay: "500ms",
              }}
            >
              <p className="text-zinc-500 max-w-xs text-sm leading-relaxed">
                software engineer. building fast things with typescript, react &
                go. mass bloat extinction advocate.
              </p>
              <div className="flex gap-4 text-sm">
                <span className="text-zinc-600">dublin, ie</span>
                <span className="text-zinc-700">/</span>
                <span className="text-zinc-600">void linux</span>
                <span className="text-zinc-700">/</span>
                <span className="text-zinc-600">dwm</span>
              </div>
            </div>
          </div>

          {/* Interactive sections */}
          <div
            className="mt-24 md:mt-32 transition-opacity duration-1000 ease-out"
            style={{
              opacity: isLoaded ? 1 : 0,
              transitionDelay: "700ms",
            }}
          >
            <div className="flex gap-1 mb-8">
              {["work", "terminal", "stack"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSection(section === s ? null : s)}
                  className={`px-4 py-2 text-sm border transition-all duration-200 ${
                    section === s
                      ? "bg-white text-black border-white"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Work section */}
            {section === "work" && (
              <div className="space-y-4 py-4 animate-fadeIn">
                {experience.map((exp, i) => (
                  <div
                    key={i}
                    className="group flex items-baseline gap-4 md:gap-8 text-sm"
                  >
                    <span className="text-zinc-700 tabular-nums">
                      {exp.year}
                    </span>
                    <span className="text-zinc-400 group-hover:text-white transition-colors">
                      {exp.role}
                    </span>
                    <span className="text-emerald-400/70 group-hover:text-emerald-400 transition-colors">
                      @{exp.place}
                    </span>
                    <span className="hidden md:block text-zinc-700 flex-1 border-b border-dotted border-zinc-800 mx-4" />
                    <span className="hidden md:block text-zinc-600 text-xs">
                      {exp.note}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Terminal section */}
            {section === "terminal" && (
              <div
                ref={terminalRef}
                className="bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm h-64 overflow-y-auto animate-fadeIn"
              >
                {terminalLines.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line?.startsWith(">")
                        ? "text-emerald-400/70"
                        : "text-zinc-500"
                    }
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
                <div className="flex items-center gap-2 text-zinc-400 mt-2">
                  <span className="text-emerald-400">❯</span>
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            )}

            {/* Stack section */}
            {section === "stack" && (
              <div className="py-4 flex flex-wrap gap-2 animate-fadeIn">
                {[
                  "typescript",
                  "react",
                  "golang",
                  "python",
                  "docker",
                  "sqlite",
                  "linux",
                  "helix",
                  "git",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs border border-zinc-800 text-zinc-500 hover:border-emerald-400/50 hover:text-emerald-400 transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Bottom section */}
        <footer className="px-6 md:px-16 lg:px-24 py-8 flex flex-col md:flex-row justify-end items-start md:items-center gap-4 text-xs text-zinc-700">
          <div className="flex gap-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <a
                href="https://pagespeed.web.dev/analysis?url=https://joeyjooste.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                page speed
              </a>
            </div>
            <span>no cookies</span>
            <span>no tracking</span>
            <span>deliberately minimal</span>
          </div>
        </footer>
      </div>

      {/* Large background text */}
      <div className="fixed bottom-0 right-0 text-[30vw] font-bold leading-none text-zinc-900/50 pointer-events-none select-none tracking-tighter">
        JJ
      </div>

      {/* Corner accent */}
      <div className="fixed top-0 right-0 w-32 h-32 pointer-events-none">
        <div className="absolute top-8 right-8 w-px h-16 bg-gradient-to-b from-emerald-400/50 to-transparent" />
        <div className="absolute top-8 right-8 w-16 h-px bg-gradient-to-l from-emerald-400/50 to-transparent" />
      </div>

      {/* Status indicator */}
      <div className="fixed bottom-8 left-8 flex items-center gap-3 text-xs text-zinc-600">
        <span className="font-mono">01</span>
        <div className="w-8 h-px bg-zinc-800" />
        <span>index</span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
