import { audio } from './audio';
import {
  commands,
  commandNames,
  type CommandContext,
} from '../commands/index';
import { localFiles, type SystemFile } from '../data/systemFiles';

export type NotionProject = {
  id: string;
  title: string;
  description: string;
  url: string;
};

export type TerminalInit = {
  notionProjects: NotionProject[];
  notionConnected: boolean;
};

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function buildFiles(projects: NotionProject[]): Record<string, SystemFile> {
  const files: Record<string, SystemFile> = { ...localFiles };
  for (const p of projects) {
    const name = p.title.toLowerCase().replace(/\s+/g, '_') + '.md';
    files[name] = {
      desc: p.description,
      url: p.url,
      available: !!p.url && p.url !== '#',
    };
  }
  return files;
}

const HISTORY_KEY = 'terminal.history';
const MAX_HISTORY = 100;

function loadHistory(): string[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: string[]): void {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
  } catch {
    /* ignore */
  }
}

export function initTerminal(init: TerminalInit): void {
  const inputRaw = document.getElementById('cmd-input') as HTMLInputElement | null;
  const formRaw = document.getElementById('cmd-form') as HTMLFormElement | null;
  const historyContainerRaw = document.getElementById('history-container');
  const terminalOutputRaw = document.getElementById('terminal-output');
  const terminalFooterRaw = document.getElementById('terminal-footer');

  if (
    !inputRaw ||
    !formRaw ||
    !historyContainerRaw ||
    !terminalOutputRaw ||
    !terminalFooterRaw
  ) {
    return;
  }

  const input = inputRaw;
  const form = formRaw;
  const historyContainer = historyContainerRaw;
  const terminalOutput = terminalOutputRaw;
  const terminalFooter = terminalFooterRaw;

  const files = buildFiles(init.notionProjects);
  const history = loadHistory();
  let historyCursor = history.length;
  let activeTypewriter: { skip: () => void } | null = null;

  const ctx: CommandContext = {
    files,
    notionConnected: init.notionConnected,
    history,
    clear: () => {
      historyContainer.innerHTML = '';
    },
  };

  // Focus input on first interaction; also on clicks anywhere not selecting text or hitting a control
  const focusInput = () => setTimeout(() => input.focus(), 0);

  terminalFooter.addEventListener('click', focusInput);
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (window.getSelection()?.toString()) return;
    if (target.closest('a, button, input, iframe, [data-no-focus]')) return;
    focusInput();
  });

  // Audio init on first interaction
  const oneShotInit = () => audio.init();
  document.addEventListener('keydown', oneShotInit, { once: true });
  document.addEventListener('click', oneShotInit, { once: true });

  // SFX mute toggle button wiring
  const sfxBtn = document.getElementById('sfx-toggle') as HTMLButtonElement | null;
  const syncSfxBtn = (muted: boolean) => {
    if (!sfxBtn) return;
    sfxBtn.textContent = muted ? '[SFX:OFF]' : '[SFX:ON]';
    sfxBtn.setAttribute('aria-pressed', muted ? 'false' : 'true');
  };
  syncSfxBtn(audio.isMuted());
  audio.onChange(syncSfxBtn);
  sfxBtn?.addEventListener('click', () => {
    audio.toggle();
    if (!audio.isMuted()) audio.init();
  });

  // Mobile sidebar drawer
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const openSidebar = () => {
    sidebar?.classList.remove('-translate-x-full');
    sidebar?.setAttribute('aria-hidden', 'false');
    sidebarToggle?.setAttribute('aria-expanded', 'true');
  };
  const closeSidebar = () => {
    sidebar?.classList.add('-translate-x-full');
    sidebar?.setAttribute('aria-hidden', 'true');
    sidebarToggle?.setAttribute('aria-expanded', 'false');
  };
  sidebarToggle?.addEventListener('click', () => {
    const expanded = sidebarToggle.getAttribute('aria-expanded') === 'true';
    expanded ? closeSidebar() : openSidebar();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.getAttribute('aria-hidden') === 'false') {
      closeSidebar();
      sidebarToggle?.focus();
    }
  });

  // Typewriter that can be skipped
  function typewrite(el: HTMLElement, speed: number): Promise<void> {
    if (prefersReducedMotion()) return Promise.resolve();

    return new Promise<void>((resolve) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      const nodes: Text[] = [];
      let n: Node | null;
      while ((n = walker.nextNode())) {
        if ((n.nodeValue ?? '').trim() !== '') nodes.push(n as Text);
      }
      if (nodes.length === 0) {
        resolve();
        return;
      }
      const originals = nodes.map((node) => node.nodeValue ?? '');
      nodes.forEach((node) => (node.nodeValue = ''));

      let nodeIdx = 0;
      let charIdx = 0;
      let cancelled = false;
      let timeoutId: number | undefined;

      const finish = () => {
        nodes.forEach((node, i) => (node.nodeValue = originals[i]));
        if (timeoutId) window.clearTimeout(timeoutId);
        activeTypewriter = null;
        audio.play('done');
        resolve();
      };

      const tick = () => {
        if (cancelled) return;
        if (nodeIdx >= nodes.length) {
          finish();
          return;
        }
        const text = originals[nodeIdx];
        if (charIdx < text.length) {
          nodes[nodeIdx].nodeValue = (nodes[nodeIdx].nodeValue ?? '') + text.charAt(charIdx);
          charIdx++;
          if (charIdx % 3 === 0) audio.play('type');
          terminalOutput!.scrollTop = terminalOutput!.scrollHeight + 1000;
          timeoutId = window.setTimeout(tick, speed);
        } else {
          nodeIdx++;
          charIdx = 0;
          timeoutId = window.setTimeout(tick, speed);
        }
      };

      activeTypewriter = {
        skip: () => {
          if (cancelled) return;
          cancelled = true;
          finish();
        },
      };
      tick();
    });
  }

  function appendPrompt(cmd: string): void {
    const line = document.createElement('div');
    line.className = 'flex items-center gap-2 mt-4';
    const prefix = document.createElement('span');
    prefix.className = 'text-primary-container font-bold';
    prefix.textContent = 'tony@firefly:~$';
    const echo = document.createElement('span');
    echo.className = 'text-white';
    echo.textContent = cmd;
    line.append(prefix, echo);
    historyContainer!.appendChild(line);
  }

  function unknownCommand(cmd: string): HTMLElement {
    const node = document.createElement('div');
    node.className = 'ml-4 mt-2 text-error';
    node.textContent = `bash: ${cmd}: command not found. Type 'help' for available commands.`;
    return node;
  }

  async function runCommand(raw: string): Promise<void> {
    const cmd = raw.trim();
    if (!cmd) return;

    // push onto history
    history.push(cmd);
    saveHistory(history);
    historyCursor = history.length;

    const [base, ...args] = cmd.split(/\s+/);
    const baseCmd = base.toLowerCase();

    if (baseCmd === 'clear') {
      commands.clear([], ctx);
      return;
    }

    appendPrompt(cmd);
    audio.play('enter');

    const handler = commands[baseCmd];
    let result: ReturnType<typeof commands[string]> | null = null;
    if (handler) {
      result = handler(args, ctx) ?? null;
    } else {
      result = { node: unknownCommand(cmd), typewrite: false };
    }

    if (!result) return;

    historyContainer!.appendChild(result.node);
    terminalOutput!.scrollTo({ top: terminalOutput!.scrollHeight + 1000, behavior: 'smooth' });

    if (result.typewrite) {
      await typewrite(result.node, 5);
    }
    input.focus();
  }

  // Tab completion
  function completeTab(): void {
    const value = input.value;
    const parts = value.split(' ');
    if (parts.length === 1) {
      const prefix = parts[0].toLowerCase();
      const match = commandNames.find((c) => c.startsWith(prefix));
      if (match) input.value = match + ' ';
    } else if (parts.length === 2 && parts[0].toLowerCase() === 'cat') {
      const prefix = parts[1].toLowerCase();
      const match = Object.keys(files).find((f) => f.startsWith(prefix));
      if (match) input.value = 'cat ' + match;
    }
  }

  input.addEventListener('keydown', (e) => {
    audio.init();

    // Ctrl+L → clear; Ctrl+C → cancel typewriter
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      commands.clear([], ctx);
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      activeTypewriter?.skip();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      completeTab();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyCursor > 0) {
        historyCursor--;
        input.value = history[historyCursor] ?? '';
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyCursor < history.length - 1) {
        historyCursor++;
        input.value = history[historyCursor] ?? '';
      } else {
        historyCursor = history.length;
        input.value = '';
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.value;
      input.value = '';
      void runCommand(val);
      return;
    }

    // Any other keypress while typewriter is active: skip it
    if (activeTypewriter) {
      activeTypewriter.skip();
    }
    audio.play('type');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    void runCommand(val);
  });
}
