import { useEffect, useRef } from "react";
import {
  Kernel,
  Shell,
  createDefaultRegistry,
  createPkgCommand,
  createPsCommand,
  createTopCommand,
  createKillCommand,
  createWatchCommand,
  createHelpCommand,
} from "@lifo-sh/core";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebglAddon } from "@xterm/addon-webgl";
import "@xterm/xterm/css/xterm.css";

const THEME = {
  background: "#09090b",
  foreground: "#a1a1aa",
  cursor: "#10b981",
  cursorAccent: "#09090b",
  selectionBackground: "#27272a",
  black: "#18181b",
  red: "#ef4444",
  green: "#10b981",
  yellow: "#eab308",
  blue: "#3b82f6",
  magenta: "#a855f7",
  cyan: "#06b6d4",
  white: "#a1a1aa",
  brightBlack: "#3f3f46",
  brightRed: "#f87171",
  brightGreen: "#34d399",
  brightYellow: "#fde047",
  brightBlue: "#60a5fa",
  brightMagenta: "#c084fc",
  brightCyan: "#22d3ee",
  brightWhite: "#e4e4e7",
};

/** Thin terminal adapter matching the interface Shell expects */
function createTerminal(container: HTMLElement) {
  const xterm = new XTerm({
    theme: THEME,
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 13,
    lineHeight: 1.4,
    cursorBlink: true,
    cursorStyle: "block",
    scrollback: 500,
    allowProposedApi: true,
  });

  const fitAddon = new FitAddon();
  xterm.loadAddon(fitAddon);
  xterm.open(container);

  try {
    const webgl = new WebglAddon();
    webgl.onContextLoss(() => webgl.dispose());
    xterm.loadAddon(webgl);
  } catch {
    // canvas fallback is fine
  }

  xterm.attachCustomKeyEventHandler((e) => {
    if (e.type === "keydown" && e.ctrlKey && e.key === "l") {
      e.preventDefault();
      xterm.clear();
      return false;
    }
    return true;
  });

  fitAddon.fit();
  const ro = new ResizeObserver(() => fitAddon.fit());
  ro.observe(container);

  return {
    write: (data: string) => xterm.write(data),
    writeln: (data: string) => xterm.writeln(data),
    onData: (cb: (data: string) => void) => xterm.onData(cb),
    get cols() {
      return xterm.cols;
    },
    get rows() {
      return xterm.rows;
    },
    focus: () => xterm.focus(),
    clear: () => xterm.clear(),
    dispose: () => {
      ro.disconnect();
      xterm.dispose();
    },
  };
}

const MOTD = [
  "welcome to joeyjooste.com",
  "type 'help' for available commands",
  "",
].join("\n");

const FILES: Record<string, string> = {
  "/etc/motd": MOTD,
  "/etc/hostname": "void\n",
  "/home/user/about.txt": [
    "joey jooste",
    "============",
    "",
    "software engineer based in dublin, ireland.",
    "building fast things with typescript, react & go.",
    "less code, less wrong.",
    "",
    "currently: engineer @ fused (ai agents)",
    "previously: co-founder @ codeyard (rag before it was cool)",
    "",
    "setup: void linux / dwm / helix",
  ].join("\n"),
  "/home/user/projects/codeyard.txt": [
    "CodeYard",
    "========",
    "AI-powered code assistant using RAG.",
    "Co-founded in 2024.",
    "Stack: TypeScript, React, Go, Vector DBs",
  ].join("\n"),
  "/home/user/projects/fused.txt": [
    "Fused",
    "=====",
    "AI agent platform.",
    "Engineer since 2025.",
    "Stack: TypeScript, React, Python",
  ].join("\n"),
  "/home/user/links.txt": [
    "links",
    "=====",
    "",
    "github:   https://github.com/joeyjooste",
    "linkedin: https://linkedin.com/in/joeyjooste",
    "email:    hello@joeyjooste.com",
    "website:  https://joeyjooste.com",
  ].join("\n"),
};

const Terminal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    const init = async () => {
      if (!containerRef.current || destroyed) return;

      // Boot kernel and populate VFS
      const kernel = new Kernel();
      await kernel.boot({ persist: true });

      if (destroyed) return;

      for (const [path, content] of Object.entries(FILES)) {
        // Ensure parent dirs exist
        const parts = path.split("/").filter(Boolean);
        for (let i = 1; i < parts.length; i++) {
          const dir = "/" + parts.slice(0, i).join("/");
          try {
            kernel.vfs.mkdir(dir);
          } catch {
            // already exists
          }
        }
        kernel.vfs.writeFile(path, content);
      }

      // Create our terminal with the right theme from the start
      const term = createTerminal(containerRef.current!);

      if (destroyed) {
        term.dispose();
        return;
      }

      // Write MOTD
      const motd = kernel.vfs.readFileString("/etc/motd");
      term.write(motd.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n"));

      // Set up registry and shell
      const registry = createDefaultRegistry();
      registry.register("pkg", createPkgCommand(registry));

      const env: Record<string, string> = {
        ...kernel.getDefaultEnv(),
        HOSTNAME: "void",
        USER: "joey",
      };

      // Shell expects the Terminal interface — our adapter matches it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shell = new Shell(term as any, kernel.vfs, registry, env);
      const jobTable = shell.getJobTable();

      registry.register("ps", createPsCommand(jobTable));
      registry.register("top", createTopCommand(jobTable));
      registry.register("kill", createKillCommand(jobTable));
      registry.register("watch", createWatchCommand(registry));
      registry.register("help", createHelpCommand(registry));

      shell.start();
      term.focus();

      cleanupRef.current = () => {
        term.dispose();
      };
    };

    init();

    return () => {
      destroyed = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="border border-zinc-800 h-64 overflow-hidden pl-1">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
};

export default Terminal;
