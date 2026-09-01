-- The coaching engine's own two tables: one row per subscribed device, one row
-- per person per week for the goal they set in their own words.
--
-- Additive and idempotent by design. It creates only `coach_*` objects and
-- alters nothing that already exists in this database, which also carries the
-- SSi learning app, Popty and Cowch.
--
-- Identity is the push endpoint: unique to a device, unguessable, so hashing it
-- gives a user id with nobody signing up for anything. That also makes the row a
-- CREDENTIAL — anyone holding the endpoint plus its keys can push to that phone
-- — so RLS is enabled with NO policies and the tables are reachable only with
-- the service-role key, from the server.

create table if not exists coach_subscribers (
  id            text primary key,          -- sha-256(endpoint), hex, first 32 chars
  endpoint      text not null unique,
  p256dh        text not null,
  auth          text not null,
  program_slug  text not null default 'reasonable-eating',
  start_ms      bigint not null,           -- THEIR week one, not Tom's
  created_at    timestamptz not null default now(),
  last_sent_at  timestamptz,
  last_status   int,                       -- web-push status code, 201 on success
  fail_count    int not null default 0,
  revoked_at    timestamptz                -- null = live; set on 404/410
);

create table if not exists coach_goals (
  subscriber_id text not null references coach_subscribers(id) on delete cascade,
  week_index    int  not null,             -- ABSOLUTE ordinal from weekIndex()
  text          text not null,
  blessed       bool not null default false,
  set_at_ms     bigint not null,
  primary key (subscriber_id, week_index)
);

-- The cron's only query: every live row, in creation order.
create index if not exists coach_subscribers_live_idx
  on coach_subscribers (created_at)
  where revoked_at is null;

alter table coach_subscribers enable row level security;
alter table coach_goals       enable row level security;

-- No policies, deliberately: RLS with none denies the anon and authenticated
-- roles outright, and the service-role key bypasses RLS. If a policy ever
-- appears on these tables it should be treated as a mistake.
revoke all on coach_subscribers from anon, authenticated;
revoke all on coach_goals       from anon, authenticated;
