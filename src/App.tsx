import { useState, useEffect } from "react";
import Terminal from "./components/Terminal";

const App = () => {
  const [section, setSection] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);


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
                className="text-zinc-500 hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
              >
                {l.label}
              </a>
            ))}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col justify-start px-6 md:px-16 lg:px-24 pt-32 pb-16">
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
                go. less code, less wrong.
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
            className="mt-8 md:mt-12 transition-opacity duration-1000 ease-out"
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
                  className={`px-4 py-2 text-sm border transition-all duration-200 cursor-pointer ${
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
            {section === "terminal" && <Terminal />}

            {/* Stack section */}
            {section === "stack" && (
              <div className="py-4 flex flex-wrap gap-2 animate-fadeIn">
                {[
                  { name: "typescript", href: "https://www.typescriptlang.org" },
                  { name: "react", href: "https://react.dev" },
                  { name: "golang", href: "https://go.dev" },
                  { name: "python", href: "https://www.python.org" },
                  { name: "docker", href: "https://www.docker.com" },
                  { name: "sqlite", href: "https://www.sqlite.org" },
                  { name: "linux", href: "https://www.kernel.org" },
                  { name: "helix", href: "https://helix-editor.com" },
                  { name: "git", href: "https://git-scm.com" },
                ].map((tech) => (
                  <a
                    key={tech.name}
                    href={tech.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-xs border border-zinc-800 text-zinc-500 hover:border-emerald-400/50 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {tech.name}
                  </a>
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
                className="hover:text-emerald-400 transition-colors cursor-pointer"
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
      <div className="fixed bottom-8 left-8 hidden md:flex items-center gap-3 text-xs text-zinc-600">
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
