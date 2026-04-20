import type { SystemFile } from '../data/systemFiles';

export type CommandContext = {
  files: Record<string, SystemFile>;
  notionConnected: boolean;
  history: string[];
  clear: () => void;
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
  ['history', 'Show recent commands'],
  ['contact', 'Show contact channels'],
  ['clear', 'Clear terminal output (Ctrl+L)'],
];

export const commands: Record<string, Command> = {
  help(_args, ctx) {
    const grid = el('div', {
      class: 'mt-2 grid grid-cols-[120px_1fr] gap-y-1 lg:grid-cols-[180px_1fr]',
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
    return { node: wrapper, typewrite: false };
  },
};

export const commandNames = Object.keys(commands).concat(['clear']);
