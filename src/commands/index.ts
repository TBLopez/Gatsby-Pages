import type { SystemFile } from '../data/systemFiles';
import type { ThemeName } from '../scripts/themes';
import {
  ACHIEVEMENTS,
  getAll,
  getUnlocked,
  isUnlocked,
  unlock,
} from '../scripts/achievements';

export type CommandContext = {
  files: Record<string, SystemFile>;
  notionConnected: boolean;
  history: string[];
  clear: () => void;
  toggleMatrix: () => boolean;
  toggleLogFeed: () => boolean;
  setTheme: (name: ThemeName) => void;
  themes: readonly ThemeName[];
  currentTheme: () => ThemeName;
  triggerReboot: () => Promise<void>;
};

export type CommandResult = {
  node: HTMLElement;
  typewrite: boolean;
};

export type Command = (args: string[], ctx: CommandContext) => CommandResult | void;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  }
  for (const child of children) {
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

function output(className: string, ...children: (Node | string)[]): HTMLElement {
  return el('div', { class: `ml-4 mt-2 ${className}` }, ...children);
}

function errorLine(msg: string): HTMLElement {
  return output('text-error', msg);
}

const helpRows: Array<[string, string]> = [
  ['whoami', 'Display current operator info'],
  ['pwd', 'Print working directory'],
  ['date', 'Display system time'],
  ['echo [text]', 'Print arguments'],
  ['ls', 'List available archives'],
  ['cat [file]', 'Open archive inline'],
  ['nmap [host]', 'Scan a host (simulated)'],
  ['top', 'Live process list'],
  ['neofetch', 'System information'],
  ['matrix', 'Toggle matrix rain effect'],
  ['theme [name]', 'Switch palette: matrix/amber/ice/dracula/mono'],
  ['tail', 'Toggle live log feed pane'],
  ['reboot', 'Replay the boot sequence'],
  ['achievements', 'Show operator badges'],
  ['contact', 'Show contact channels'],
  ['history', 'Show recent commands'],
  ['clear', 'Clear terminal output (Ctrl+L)'],
];

export const commands: Record<string, Command> = {
  help(_args, ctx) {
    const grid = el('div', {
      class:
        'mt-2 grid grid-cols-[110px_1fr] gap-y-1 gap-x-2 sm:grid-cols-[140px_1fr] lg:grid-cols-[200px_1fr]',
    });
    for (const [name, desc] of helpRows) {
      grid.append(
        el('span', { class: 'opacity-70' }, name),
        el('span', {}, desc),
      );
    }
    const status = ctx.notionConnected
      ? el(
          'div',
          { class: 'mt-3 opacity-60 text-[10px] text-primary-container' },
          'DATABASE UPLINK ACTIVE // CMS ENABLED',
        )
      : el(
          'div',
          { class: 'mt-3 opacity-60 text-[10px] text-error' },
          'DATABASE UPLINK OFFLINE // LOCAL MODE',
        );

    const socials = el(
      'div',
      {
        class:
          'mt-3 border-t border-outline-variant/40 pt-2 opacity-60 text-[10px]',
      },
      'SOCIAL_LINKS: ',
    );
    socials.append(
      el(
        'a',
        {
          href: 'https://github.com/TBLopez',
          target: '_blank',
          rel: 'noopener',
          class: 'hover:text-white underline',
        },
        'github',
      ),
      document.createTextNode(' | '),
      el(
        'a',
        {
          href: 'https://www.linkedin.com/in/techtony/',
          target: '_blank',
          rel: 'noopener',
          class: 'hover:text-white underline',
        },
        'linkedin',
      ),
    );

    const box = el('div', { class: 'text-primary-container ml-4 mt-2' });
    box.append(
      el('div', {}, 'AVAILABLE COMMANDS:'),
      grid,
      socials,
      status,
    );
    return { node: box, typewrite: true };
  },

  pwd() {
    return {
      node: output('text-primary-container', '/home/operator/firefly/tony'),
      typewrite: true,
    };
  },

  whoami() {
    const box = output('text-primary-container');
    box.append(
      el('span', { class: 'block' }, 'TONY LOPEZ // SECURITY_ANALYST'),
      el(
        'span',
        { class: 'block opacity-70 mt-1' },
        'Specializing in security, penetration testing, and tactical development.',
      ),
    );
    return { node: box, typewrite: true };
  },

  sudo() {
    unlock('oops');
    return {
      node: output(
        'text-error font-bold select-none uppercase',
        '[!] SECURITY ALERT [!] ACCESS DENIED: THIS INCIDENT WILL BE REPORTED.',
      ),
      typewrite: true,
    };
  },

  date() {
    return {
      node: output('text-primary-container', new Date().toString()),
      typewrite: true,
    };
  },

  echo(args) {
    return {
      node: output('text-white whitespace-pre-wrap', args.join(' ')),
      typewrite: true,
    };
  },

  contact() {
    const box = output('text-primary-container');
    const row = (label: string, href: string, display: string) =>
      el(
        'div',
        { class: 'flex gap-3' },
        el('span', { class: 'opacity-70 w-20' }, label),
        el(
          'a',
          {
            href,
            target: '_blank',
            rel: 'noopener',
            class: 'hover:text-white underline text-secondary',
          },
          display,
        ),
      );
    box.append(
      row('github', 'https://github.com/TBLopez', 'github.com/TBLopez'),
      row(
        'linkedin',
        'https://www.linkedin.com/in/techtony/',
        'linkedin.com/in/techtony',
      ),
    );
    return { node: box, typewrite: true };
  },

  history(_args, ctx) {
    const box = output('text-primary-container');
    if (ctx.history.length === 0) {
      box.append(el('div', { class: 'opacity-70' }, '(history empty)'));
    } else {
      ctx.history.forEach((cmd, i) => {
        box.append(
          el(
            'div',
            { class: 'grid grid-cols-[48px_1fr]' },
            el('span', { class: 'opacity-50' }, String(i + 1).padStart(3, ' ')),
            el('span', {}, cmd),
          ),
        );
      });
    }
    return { node: box, typewrite: false };
  },

  clear(_args, ctx) {
    ctx.clear();
  },

  nmap(args) {
    const target = args[0] || '127.0.0.1';
    const box = output('text-primary-container');
    const dim = (text: string) =>
      el('div', { class: 'opacity-70' }, text);
    const portLine = (port: string, state: 'open' | 'filtered', svc: string) =>
      el(
        'div',
        { class: 'text-white' },
        `${port.padEnd(10, ' ')}`,
        el(
          'span',
          {
            class:
              state === 'open' ? 'text-primary-container' : 'text-error',
          },
          state.padEnd(9, ' '),
        ),
        svc,
      );
    box.append(
      dim(
        `Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toISOString()}`,
      ),
      el('div', {}, `Nmap scan report for ${target}`),
      el('div', {}, 'Host is up (0.00032s latency).'),
      el('div', { class: 'mt-2 text-error' }, 'PORT      STATE    SERVICE'),
      portLine('22/tcp', 'filtered', 'ssh'),
      portLine('80/tcp', 'open', 'http'),
      portLine('443/tcp', 'open', 'https'),
      portLine('3306/tcp', 'filtered', 'mysql'),
      el(
        'div',
        { class: 'mt-2 text-error font-bold' },
        '[!] WARNING: UNSECURE PORT DETECTED. INITIATING PAYLOAD...',
      ),
      el(
        'div',
        { class: 'text-white text-[10px] mt-1' },
        '[|||||||||||||||||||||||||||||||] 100% EXPLOIT SUCCESSFUL',
      ),
      el(
        'div',
        {
          class:
            'mt-2 text-primary-container font-bold tracking-widest uppercase',
        },
        'SYSTEM COMPROMISED. ROOT ACCESS GRANTED.',
      ),
    );
    unlock('recon');
    return { node: box, typewrite: true };
  },

  ls(_args, ctx) {
    const grid = el('div', {
      class: 'ml-4 mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    });
    for (const [name, file] of Object.entries(ctx.files)) {
      const card = el(
        'div',
        {
          class:
            'border-l-2 border-outline-variant pl-2 hover:border-primary-container transition-colors',
        },
        el(
          'div',
          {
            class: `font-bold ${file.available ? 'text-secondary' : 'text-secondary/60'}`,
          },
          name,
          file.available
            ? ''
            : el('span', { class: 'ml-2 text-[9px] text-error' }, '[SEALED]'),
        ),
        el(
          'div',
          { class: 'text-[10px] text-white/50 truncate' },
          file.desc,
        ),
      );
      grid.append(card);
    }
    return { node: grid, typewrite: false };
  },

  cat(args, ctx) {
    const filename = args[0];
    if (!filename) return { node: errorLine('cat: missing file operand'), typewrite: false };
    const file = ctx.files[filename];
    if (!file)
      return {
        node: errorLine(`cat: ${filename}: No such file or directory`),
        typewrite: false,
      };
    if (!file.available || !file.url || file.url === '#')
      return {
        node: output(
          'text-error',
          `cat: ${filename}: archive sealed — contact operator for access`,
        ),
        typewrite: false,
      };

    const wrapper = el('div', {
      class:
        'ml-4 mt-4 w-full max-w-4xl bg-surface border border-outline-variant mb-8',
    });
    const header = el(
      'div',
      {
        class:
          'bg-primary-container text-black text-[10px] font-bold px-2 py-1 flex justify-between items-center select-none uppercase tracking-widest',
      },
      el('span', {}, `VIEWER_MODULE // ${filename}`),
    );
    const link = el(
      'a',
      {
        href: file.url,
        target: '_blank',
        rel: 'noopener',
        class:
          'hover:text-white transition-colors mr-2 flex items-center gap-1 bg-black/20 px-2 py-0.5',
        'aria-label': `Open ${filename} in a new tab`,
      },
      '[NEW_SYS_WINDOW]',
    );
    header.append(link);
    const frameBox = el('div', { class: 'w-full bg-black p-1' });
    const iframe = el('iframe', {
      src: file.url,
      class:
        'w-full h-[60vh] border-none bg-white grayscale-[0.3] contrast-[1.1]',
      title: filename,
      loading: 'lazy',
    });
    frameBox.append(iframe);
    wrapper.append(header, frameBox);
    unlock('archivist');
    return { node: wrapper, typewrite: false };
  },

  matrix(args, ctx) {
    const arg = (args[0] || '').toLowerCase();
    let on: boolean;
    if (arg === 'on') {
      ctx.toggleMatrix(); // ensure on
      on = true;
    } else if (arg === 'off') {
      // call toggle if currently on; cheap approach: set explicitly via toggle if needed
      const isOn = (document.getElementById('matrix-rain') as HTMLElement | null)?.classList.contains('active');
      if (isOn) ctx.toggleMatrix();
      on = false;
    } else {
      on = ctx.toggleMatrix();
    }
    if (on) unlock('rainmaker');
    return {
      node: output(
        'text-primary-container',
        on ? 'matrix: rain enabled — wake up, neo.' : 'matrix: rain disabled.',
      ),
      typewrite: false,
    };
  },

  theme(args, ctx) {
    const requested = (args[0] || '').toLowerCase();
    if (!requested) {
      const box = output('text-primary-container');
      box.append(
        el('div', {}, `current theme: ${ctx.currentTheme()}`),
        el(
          'div',
          { class: 'opacity-70 mt-1' },
          `available: ${ctx.themes.join(', ')}`,
        ),
        el(
          'div',
          { class: 'opacity-50 text-[10px] mt-1' },
          'usage: theme <name>',
        ),
      );
      return { node: box, typewrite: false };
    }
    if (!(ctx.themes as readonly string[]).includes(requested)) {
      return {
        node: errorLine(
          `theme: unknown palette "${requested}". try: ${ctx.themes.join(', ')}`,
        ),
        typewrite: false,
      };
    }
    ctx.setTheme(requested as ThemeName);
    return {
      node: output(
        'text-primary-container',
        `theme: switched to ${requested}.`,
      ),
      typewrite: false,
    };
  },

  tail(_args, ctx) {
    const visible = ctx.toggleLogFeed();
    if (visible) unlock('packet_sniffer');
    return {
      node: output(
        'text-primary-container',
        visible
          ? 'tail -f /var/log/firefly.log — feed engaged.'
          : 'tail: feed detached.',
      ),
      typewrite: false,
    };
  },

  reboot(_args, ctx) {
    unlock('reboot_loop');
    void ctx.triggerReboot();
    return {
      node: output('text-primary-container', 'reboot: signaling kernel ...'),
      typewrite: false,
    };
  },

  neofetch() {
    const ua = navigator.userAgent;
    const platform = navigator.platform || 'unknown';
    const lang = navigator.language || 'en-US';
    const cores = (navigator.hardwareConcurrency || 1) + ' threads';
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    const browser = (() => {
      if (/firefox/i.test(ua)) return 'Firefox';
      if (/edg/i.test(ua)) return 'Edge';
      if (/chrome/i.test(ua)) return 'Chrome';
      if (/safari/i.test(ua)) return 'Safari';
      return 'Unknown';
    })();
    const logo = [
      '    ╔═══════════╗',
      '    ║ ░░▒▒▓▓██  ║',
      '    ║ ▓▓██▒▒░░  ║',
      '    ║   FIREFLY ║',
      '    ║   v.1.0.0 ║',
      '    ╚═══════════╝',
    ];
    const stats: Array<[string, string]> = [
      ['operator', 'tony@firefly'],
      ['os', 'FireflyOS x86_64'],
      ['kernel', '6.0.8-firefly'],
      ['shell', '/bin/firefly-sh'],
      ['terminal', browser],
      ['platform', platform],
      ['language', lang],
      ['cpu', cores],
      ['resolution', `${w}x${h} @ ${dpr}x`],
      ['uptime', `${Math.floor(performance.now() / 1000)}s`],
    ];
    const wrapper = el('div', { class: 'ml-4 mt-2 flex gap-4 flex-wrap' });
    const logoCol = el('pre', {
      class: 'text-primary-container text-[11px] leading-tight m-0',
    });
    logoCol.textContent = logo.join('\n');
    const statsCol = el('div', { class: 'text-[12px] flex flex-col gap-0.5' });
    for (const [k, v] of stats) {
      statsCol.append(
        el(
          'div',
          { class: 'flex gap-2' },
          el('span', { class: 'text-secondary w-24' }, k),
          el('span', { class: 'text-white' }, v),
        ),
      );
    }
    wrapper.append(logoCol, statsCol);
    return { node: wrapper, typewrite: false };
  },

  top() {
    const wrapper = el('div', {
      class: 'ml-4 mt-2 text-primary-container font-mono text-[12px]',
    });
    const summary = el('div', { class: 'opacity-70' });
    const headerRow = el(
      'div',
      {
        class:
          'mt-2 grid grid-cols-[44px_52px_52px_1fr] sm:grid-cols-[60px_60px_60px_1fr] gap-2 text-secondary border-b border-outline-variant/40 pb-1',
      },
      el('span', {}, 'PID'),
      el('span', {}, 'CPU%'),
      el('span', {}, 'MEM%'),
      el('span', {}, 'COMMAND'),
    );
    const body = el('div', { class: 'space-y-0.5 mt-1' });
    const footer = el(
      'div',
      { class: 'mt-2 opacity-60 text-[10px]' },
      'press q in real life · auto-stops in 8s',
    );
    wrapper.append(summary, headerRow, body, footer);

    type Proc = {
      pid: number;
      cmd: string;
      cpu: number;
      mem: number;
    };
    const procs: Proc[] = [
      { pid: 1, cmd: '/sbin/firefly-init', cpu: 0.1, mem: 0.5 },
      { pid: 217, cmd: 'sshd', cpu: 0.0, mem: 0.4 },
      { pid: 411, cmd: 'firefly-shell', cpu: 0.3, mem: 0.6 },
      { pid: 612, cmd: 'notion-uplink', cpu: 1.2, mem: 1.4 },
      { pid: 808, cmd: 'tail -f /var/log/firefly.log', cpu: 0.4, mem: 0.3 },
      { pid: 901, cmd: 'matrix-rain --renderer=canvas', cpu: 8.7, mem: 2.1 },
      { pid: 1024, cmd: 'audio-synth --triangle', cpu: 0.6, mem: 0.7 },
      { pid: 1337, cmd: 'recon-daemon --target=lan', cpu: 4.2, mem: 1.9 },
      { pid: 2048, cmd: 'opsec-monitor --strict', cpu: 2.1, mem: 1.2 },
      { pid: 4096, cmd: 'gh-pages --watch', cpu: 0.2, mem: 0.5 },
    ];

    const tickProcs = () => {
      const now = new Date().toLocaleTimeString();
      const load = (Math.random() * 1.5 + 0.2).toFixed(2);
      summary.textContent = `top - ${now}  load avg: ${load}, ${(parseFloat(load) * 1.1).toFixed(2)}, ${(parseFloat(load) * 1.3).toFixed(2)}  ·  ${procs.length} tasks`;
      // jitter cpu/mem a bit
      for (const p of procs) {
        p.cpu = Math.max(0, p.cpu + (Math.random() - 0.5) * 1.5);
        p.mem = Math.max(0, p.mem + (Math.random() - 0.5) * 0.4);
      }
      const sorted = [...procs].sort((a, b) => b.cpu - a.cpu);
      body.replaceChildren(
        ...sorted.map((p) =>
          el(
            'div',
            {
              class:
                'grid grid-cols-[44px_52px_52px_1fr] sm:grid-cols-[60px_60px_60px_1fr] gap-2 text-white/90',
            },
            el('span', {}, String(p.pid)),
            el(
              'span',
              {
                class:
                  p.cpu > 5 ? 'text-error' : 'text-primary-container',
              },
              p.cpu.toFixed(1),
            ),
            el('span', {}, p.mem.toFixed(1)),
            el('span', { class: 'truncate opacity-90' }, p.cmd),
          ),
        ),
      );
    };

    tickProcs();
    const id = window.setInterval(tickProcs, 900);
    window.setTimeout(() => {
      window.clearInterval(id);
      footer.textContent = '— stopped —';
      footer.classList.add('opacity-40');
    }, 8000);

    unlock('process_killer');
    return { node: wrapper, typewrite: false };
  },

  achievements() {
    const all = getAll();
    const wrapper = el('div', {
      class: 'ml-4 mt-2 text-primary-container',
    });
    wrapper.append(
      el(
        'div',
        { class: 'text-secondary' },
        `OPERATOR BADGES — ${getUnlocked().length}/${all.length}`,
      ),
      el(
        'div',
        {
          class:
            'mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-[12px]',
        },
        ...all.map((a) => {
          const got = isUnlocked(a.id);
          return el(
            'div',
            {
              class: got
                ? 'text-primary-container'
                : 'text-white/40',
            },
            el(
              'span',
              { class: 'inline-block w-5 opacity-80' },
              got ? '◉' : '◌',
            ),
            el('span', { class: 'font-bold' }, a.name),
            el(
              'span',
              { class: 'block opacity-60 ml-5 text-[10px]' },
              got ? 'UNLOCKED' : a.hint,
            ),
          );
        }),
      ),
    );
    void ACHIEVEMENTS; // referenced for potential future use
    return { node: wrapper, typewrite: false };
  },
};

export const commandNames = Object.keys(commands).concat(['clear']);
