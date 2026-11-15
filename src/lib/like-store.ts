/**
 * /like's store: anonymous results people chose to share, and the optional
 * IPIP rows, in Supabase (migration 20261115_like_results.sql).
 *
 * The push-store pattern exactly: PostgREST over plain fetch, no SDK;
 * `import.meta.env.X ?? process.env.X` so a credential set in Vercel works
 * without a rebuild; when Supabase is not configured every accessor throws and
 * the routes answer an honest 503, never a success shape.
 *
 * What a row may carry is decided HERE, by whitelist: the routes build the row
 * from the fields below and nothing else, so a name, an IP, a user agent or any
 * unknown field a client sends is dropped before anything is written. No IP is
 * ever logged; the rate limiter holds one in memory for five minutes and no more.
 */
import { decodePerson, answeredCount, BLOCK, MAX_MOMENTS } from '@/lib/like/engine';
import { ITEM_COUNT, ITEM_SET } from '@/lib/like/ipip';
import bankDoc from '@/lib/like/bank.json';

/** The IPIP offer closes once this many people have done it (collection-design.md: "a settled answer at about 350"). */
export const IPIP_TARGET = 350;

/** The only host this site writes. Stamped server-side, never taken from a client. */
export const LIKE_HOST = 'tomcassidy.co';

export const BANK_VERSION: string = (bankDoc as { meta: { bank_version: string } }).meta.bank_version;

function env(name: string): string | undefined {
  const fromImport = (import.meta.env as Record<string, string | undefined>)[name];
  const fromProcess =
    typeof process !== 'undefined' ? (process.env as Record<string, string | undefined>)[name] : undefined;
  return fromImport || fromProcess;
}

function supabaseConfig(): { url: string; key: string } | null {
  const url = env('SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  return url && key ? { url: url.replace(/\/+$/, ''), key } : null;
}

export function canPersist(): boolean {
  return supabaseConfig() !== null;
}

async function rest(path: string, init: RequestInit & { prefer?: string } = {}): Promise<Response> {
  const cfg = supabaseConfig();
  if (!cfg) throw new Error('Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).');
  const { prefer, ...rest_ } = init;
  const res = await fetch(`${cfg.url}/rest/v1/${path}`, {
    ...rest_,
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
  });
  if (!res.ok) throw new StoreError(res.status, `Supabase ${res.status} on ${path.split('?')[0]}`);
  return res;
}

export class StoreError extends Error {
  constructor(public status: number, msg: string) {
    super(msg);
  }
}

/* ---------- shape checks ---------- */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const isResultKey = (v: unknown): v is string => typeof v === 'string' && UUID_RE.test(v);

/** Ranked links ('r' + one char per moment) and the older two-char form. */
const RANKED_RE = new RegExp(`^r[0-9a-zA-Z.x]{1,${MAX_MOMENTS}}$`);
const LEGACY_RE = new RegExp(`^[0-9x.\\-]{2,${MAX_MOMENTS * 2}}$`);

/**
 * Takes whatever answer string a client sent and returns the stored form —
 * `~~<answers>`, the link's own encoding with the NAME and the STATED
 * self-placement emptied whatever the client put there — plus how many whole
 * sections it covers. Null when it isn't an answer string at all.
 */
export function cleanAnswers(v: unknown): { answers: string; sections: number } | null {
  if (typeof v !== 'string' || v.length > 200) return null;
  const parts = v.split('~');
  if (parts.length !== 3) return null;
  const ans = parts[2];
  if (!RANKED_RE.test(ans) && !LEGACY_RE.test(ans)) return null;
  const stored = `~~${ans}`;
  const person = decodePerson(stored);
  if (!person) return null;
  const sections = Math.min(3, Math.floor(answeredCount(person.answers) / BLOCK));
  return sections >= 1 ? { answers: stored, sections } : null;
}

const utcDay = () => new Date().toISOString().slice(0, 10);

/* ---------- writes ---------- */

export interface ResultRow {
  result_key: string;
  bank_version: string;
  answers: string;
  sections: number;
  host: string;
  day: string;
  prev_answers: string | null;
}

export function buildResultRow(body: Record<string, unknown>): ResultRow | string {
  if (!isResultKey(body.result_key)) return 'result_key must be a random uuid';
  if (body.bank_version !== BANK_VERSION) return 'unknown bank_version';
  const a = cleanAnswers(body.answers);
  if (!a) return 'answers is not an answer string with at least one whole section';
  let prev: string | null = null;
  if (body.prev_answers !== undefined && body.prev_answers !== null) {
    const p = cleanAnswers(body.prev_answers);
    if (!p) return 'prev_answers is not an answer string';
    prev = p.answers;
  }
  return {
    result_key: body.result_key,
    bank_version: BANK_VERSION,
    answers: a.answers,
    sections: a.sections,
    host: LIKE_HOST,
    day: utcDay(),
    prev_answers: prev,
  };
}

export interface IpipRow {
  result_key: string;
  item_set: string;
  responses: number[];
  day: string;
}

export function buildIpipRow(body: Record<string, unknown>): IpipRow | string {
  if (!isResultKey(body.result_key)) return 'result_key must be a random uuid';
  if (body.item_set !== ITEM_SET) return 'unknown item_set';
  const r = body.responses;
  if (!Array.isArray(r) || r.length !== ITEM_COUNT || !r.every((x) => Number.isInteger(x) && x >= 1 && x <= 5)) {
    return `responses must be ${ITEM_COUNT} whole numbers from 1 to 5`;
  }
  return { result_key: body.result_key, item_set: ITEM_SET, responses: r as number[], day: utcDay() };
}

/** `return=minimal`: PostgREST sends nothing back, so no row ever travels back out. */
export async function insertResult(row: ResultRow): Promise<void> {
  await rest('like_results', { method: 'POST', body: JSON.stringify(row), prefer: 'return=minimal' });
}

export async function insertIpip(row: IpipRow): Promise<void> {
  await rest('like_ipip', { method: 'POST', body: JSON.stringify(row), prefer: 'return=minimal' });
}

/** How many IPIP rows exist: a count only, never a row (Content-Range: 0-0/N or * /N). */
export async function ipipCount(): Promise<number> {
  const res = await rest('like_ipip?select=result_key&limit=1', { method: 'HEAD', prefer: 'count=exact' });
  const n = Number((res.headers.get('content-range') ?? '').split('/')[1]);
  if (!Number.isFinite(n)) throw new StoreError(502, 'no count in Content-Range');
  return n;
}

/* ---------- guards (the /api/guide pattern) ---------- */

const RATE_WINDOW_MS = 5 * 60 * 1000;
const logs = new Map<string, Map<string, number[]>>();

/** Per-IP sliding window, per route; the IP lives only in this Map, five minutes at most, and is never logged. */
export function rateLimited(request: Request, route: string, max: number): number {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const log = logs.get(route) ?? new Map<string, number[]>();
  logs.set(route, log);
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  for (const [k, ts] of log) {
    const fresh = ts.filter((t) => t > cutoff);
    if (fresh.length) log.set(k, fresh);
    else log.delete(k);
  }
  const ts = log.get(ip) ?? [];
  if (ts.length >= max) return Math.max(1, Math.ceil((ts[0] + RATE_WINDOW_MS - now) / 1000));
  ts.push(now);
  log.set(ip, ts);
  return 0;
}

// x-forwarded-host / host, NOT new URL(request.url).host: behind Vercel's proxy
// the latter is the internal invocation host (CLAUDE.md, "the bug that bit before").
function allowedHosts(request: Request): string[] {
  const hosts = [request.headers.get('x-forwarded-host'), request.headers.get('host')];
  try {
    hosts.push(new URL(request.url).host);
  } catch {
    /* the forwarding headers still carry the answer */
  }
  return hosts.filter((h): h is string => Boolean(h)).map((h) => h.toLowerCase());
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // not a browser cross-site call; the other defences still apply
  try {
    return allowedHosts(request).includes(new URL(origin).host.toLowerCase());
  } catch {
    return false;
  }
}

export function json(obj: unknown, status: number, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra },
  });
}

/** Read a small JSON object body; null when it is anything else. */
export async function readBody(request: Request, maxBytes = 4_000): Promise<Record<string, unknown> | null> {
  const raw = await request.text();
  if (raw.length > maxBytes) return null;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
