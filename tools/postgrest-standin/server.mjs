#!/usr/bin/env node
// A tiny local stand-in shaped like PostgREST, for proving the /api/like/*
// routes end to end WITHOUT any real Supabase. It is not a database and talks
// to none: it appends every accepted insert to a JSON-lines file.
//
//   node tools/postgrest-standin/server.mjs <port> <rows.jsonl>
//
// Point the site at it with SUPABASE_URL=http://127.0.0.1:<port> and any
// non-empty SUPABASE_SERVICE_ROLE_KEY. It mimics just what like-store.ts uses:
//   POST /rest/v1/<table>   (Prefer: return=minimal) -> 201, empty body
//   HEAD|GET /rest/v1/<table>?...  (Prefer: count=exact) -> Content-Range: */N
// and the migration's constraints that matter: unknown columns refused, unique
// result_key per table, like_ipip.result_key must exist in like_results, 28
// responses of 1-5.
import http from 'node:http';
import fs from 'node:fs';

const [port = '54399', file = 'rows.jsonl'] = process.argv.slice(2);
const TABLES = {
  like_results: ['result_key', 'bank_version', 'answers', 'sections', 'host', 'day', 'prev_answers'],
  like_ipip: ['result_key', 'item_set', 'responses', 'day'],
};
const rows = { like_results: [], like_ipip: [] };
if (fs.existsSync(file)) {
  for (const l of fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)) {
    const { table, row } = JSON.parse(l);
    rows[table]?.push(row);
  }
}
const send = (res, status, body = '', headers = {}) => {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(body ? JSON.stringify(body) : '');
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const table = url.pathname.replace(/^\/rest\/v1\//, '');
    console.log(new Date().toISOString(), req.method, url.pathname + url.search);
    if (!req.headers.apikey || !req.headers.authorization) return send(res, 401, { message: 'no key' });
    if (!TABLES[table]) return send(res, 404, { message: `no table ${table}` });
    if (req.method === 'HEAD' || req.method === 'GET') {
      const n = rows[table].length;
      return send(res, 200, req.method === 'GET' ? [] : '', { 'Content-Range': n ? `0-0/${n}` : `*/0` });
    }
    if (req.method !== 'POST') return send(res, 405, { message: 'method' });
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      let row;
      try {
        row = JSON.parse(raw);
      } catch {
        return send(res, 400, { message: 'bad json' });
      }
      const extra = Object.keys(row).filter((k) => !TABLES[table].includes(k));
      if (extra.length) return send(res, 400, { message: `unknown column(s) ${extra.join(',')}` });
      if (rows[table].some((r) => r.result_key === row.result_key)) return send(res, 409, { message: 'duplicate key' });
      if (table === 'like_ipip') {
        if (!rows.like_results.some((r) => r.result_key === row.result_key)) return send(res, 409, { message: 'fk violation' });
        const r = row.responses;
        if (!Array.isArray(r) || r.length !== 28 || !r.every((x) => x >= 1 && x <= 5)) return send(res, 400, { message: 'check violation' });
      }
      rows[table].push(row);
      fs.appendFileSync(file, JSON.stringify({ table, row }) + '\n');
      send(res, 201);
    });
  })
  .listen(Number(port), '127.0.0.1', () => console.log(`postgrest stand-in on 127.0.0.1:${port}, rows -> ${file}`));
