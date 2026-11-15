-- /like ("What are you like, anyway?"): anonymous results people CHOSE to share,
-- and the optional 28-item IPIP questionnaire some of them also did.
--
-- Additive and idempotent by design, on the coach_subscribers pattern. It
-- creates only `like_*` objects and alters nothing that already exists in this
-- database, which also carries the SSi learning app, Popty and Cowch.
--
-- NOT APPLIED by any code in this repo. Tom applies it by hand in Supabase.
--
-- Anonymity is the design, not a policy on top of it:
--   * no name, no IP, no user agent, no device or account id, no cookie;
--   * no timestamp finer than the day, and no serial id, so neither insert
--     order nor time can match a row to a visit;
--   * the ONLY link between a result and its IPIP answers is `result_key`, a
--     random uuid the browser makes at share time, holds in memory only, and
--     never reuses. It appears nowhere else: not in a URL, not in storage, not
--     in any other table. A fresh key per share means two shares by one person
--     cannot be joined either.
--
-- RLS on with NO policies: only the service-role key (the server) can read or
-- write. Raw rows are never served to a browser.

create table if not exists like_results (
  result_key    uuid primary key,          -- random per share, made in the browser
  bank_version  text not null,             -- e.g. '2.0'; answers only mean something against it
  answers       text not null,             -- the link's compact answer string, name and stated stripped
  sections      smallint not null check (sections between 1 and 3),  -- 10, 20 or 30 moments
  host          text not null,             -- 'tomcassidy.co'; later 'cowch'
  day           date not null default current_date,   -- the date only, never a time
  prev_answers  text                       -- optional: earlier answers from a replay, stripped the same way
);

create table if not exists like_ipip (
  result_key    uuid primary key references like_results(result_key) on delete cascade,
  item_set      text not null,             -- which 28 items, in which order: 'mini20-c6-e5-v1'
  responses     smallint[] not null
                check (cardinality(responses) = 28
                       and 1 <= all(responses) and 5 >= all(responses)),
  day           date not null default current_date
);

alter table like_results enable row level security;
alter table like_ipip    enable row level security;

-- No policies, deliberately: RLS with none denies the anon and authenticated
-- roles outright, and the service-role key bypasses RLS. If a policy ever
-- appears on these tables it should be treated as a mistake.
revoke all on like_results from anon, authenticated;
revoke all on like_ipip    from anon, authenticated;
