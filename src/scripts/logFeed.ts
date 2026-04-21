/* Rolling fake-log feed for the right-side pane.
   Mixes auth, packet, and ids events at random intervals. */

const STORAGE_KEY = 'logfeed.visible';
const MAX_LINES = 60;

type Severity = 'info' | 'warn' | 'normal';
type Generator = () => { text: string; severity: Severity };

const ips = () =>
  `${rand(10, 240)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`;
const rand = (a: number, b: number) =>
  Math.floor(a + Math.random() * (b - a + 1));
const pick = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const SSH_USERS = ['root', 'admin', 'guest', 'oracle', 'pi', 'tony', 'operator'];
const PORTS = [22, 80, 443, 3306, 5432, 8080, 6379, 25565, 8443, 8888];

const generators: Generator[] = [
  () => ({
    text: `sshd[${rand(1000, 9999)}]: Failed password for ${pick(SSH_USERS)} from ${ips()} port ${rand(40000, 60000)}`,
    severity: 'warn',
  }),
  () => ({
    text: `sshd[${rand(1000, 9999)}]: Accepted publickey for tony from ${ips()} port ${rand(40000, 60000)}`,
    severity: 'info',
  }),
  () => ({
    text: `kernel: nf_conntrack: DROP IN=eth0 SRC=${ips()} DST=10.0.0.1 PROTO=TCP SPT=${rand(1024, 65000)} DPT=${pick(PORTS)}`,
    severity: 'normal',
  }),
  () => ({
    text: `suricata: ET POLICY Outbound DNS lookup of suspicious.tld from ${ips()}`,
    severity: 'warn',
  }),
  () => ({
    text: `nginx: ${ips()} - "GET /admin HTTP/1.1" 401 - "curl/8.4.0"`,
    severity: 'normal',
  }),
  () => ({
    text: `auditd: type=USER_LOGIN msg=audit(${Date.now() / 1000 | 0}.${rand(100,999)}:${rand(100, 999)}): pid=${rand(1000, 9999)} uid=0 res=success`,
    severity: 'info',
  }),
  () => ({
    text: `cron[${rand(1000, 9999)}]: (operator) CMD (run-parts --report /etc/cron.hourly)`,
    severity: 'normal',
  }),
  () => ({
    text: `fail2ban: WARNING [sshd] Ban ${ips()}`,
    severity: 'warn',
  }),
  () => ({
    text: `dhclient: bound to 10.0.0.${rand(2, 250)} -- renewal in ${rand(1200, 3600)} seconds`,
    severity: 'info',
  }),
  () => ({
    text: `kernel: TCP: request_sock_TCP: Possible SYN flooding on port ${pick(PORTS)}`,
    severity: 'warn',
  }),
];

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

type Feed = {
  show: () => void;
  hide: () => void;
  toggle: () => boolean;
  isVisible: () => boolean;
};

let singleton: Feed | null = null;

export function getLogFeed(): Feed {
  if (singleton) return singleton;

  let pane: HTMLElement | null = null;
  let stream: HTMLElement | null = null;
  let timerId: number | null = null;
  let visible = false;

  const ensure = () => {
    pane = document.getElementById('log-pane');
    stream = document.getElementById('log-stream');
  };

  const emit = () => {
    if (!stream) return;
    const gen = pick(generators);
    const { text, severity } = gen();
    const line = document.createElement('div');
    line.className = 'log-line' + (severity !== 'normal' ? ' ' + severity : '');
    const ts = document.createElement('span');
    ts.className = 'ts';
    ts.textContent = timestamp();
    line.appendChild(ts);
    line.appendChild(document.createTextNode(text));
    stream.appendChild(line);
    while (stream.children.length > MAX_LINES) {
      stream.firstElementChild?.remove();
    }
    stream.scrollTop = stream.scrollHeight;
  };

  const start = () => {
    if (timerId !== null) return;
    const loop = () => {
      emit();
      timerId = window.setTimeout(loop, rand(450, 1700));
    };
    loop();
  };

  const stop = () => {
    if (timerId !== null) window.clearTimeout(timerId);
    timerId = null;
  };

  singleton = {
    show: () => {
      ensure();
      if (!pane) return;
      pane.removeAttribute('hidden');
      visible = true;
      localStorage.setItem(STORAGE_KEY, '1');
      start();
    },
    hide: () => {
      ensure();
      if (!pane) return;
      pane.setAttribute('hidden', '');
      visible = false;
      localStorage.setItem(STORAGE_KEY, '0');
      stop();
    },
    toggle: () => {
      visible ? singleton!.hide() : singleton!.show();
      return visible;
    },
    isVisible: () => visible,
  };

  return singleton;
}

export function initLogFeedFromStorage(): void {
  const feed = getLogFeed();
  // Default off on mobile, default on for desktop if user hasn't chosen otherwise
  const stored = localStorage.getItem(STORAGE_KEY);
  const isWide = window.matchMedia('(min-width: 1024px)').matches;
  if (stored === '1') feed.show();
  else if (stored === null && isWide) feed.show();
}
