-- Weeks table — one row per week per year
create table weeks (
  id uuid primary key default gen_random_uuid(),
  week_number integer not null,
  year integer not null,
  created_at timestamptz default now(),
  unique (week_number, year)
);

-- Elements table — every visual thing on a letter
create table elements (
  id uuid primary key default gen_random_uuid(),
  week_id uuid references weeks(id) on delete cascade not null,
  author text not null check (author in ('A', 'B')),
  type text not null check (type in ('text', 'image', 'gif', 'drawing')),
  content text not null,
  x integer not null default 0,
  y integer not null default 0,
  width integer not null default 200,
  height integer not null default 100,
  rotation integer not null default 0,
  z_index integer not null default 0,
  created_at timestamptz default now()
);

-- Allow public read/write since auth is handled via password gate at app level
alter table weeks enable row level security;
create policy "public access weeks" on weeks for all using (true) with check (true);

alter table elements enable row level security;
create policy "public access elements" on elements for all using (true) with check (true);

-- Realtime subscriptions
alter publication supabase_realtime add table weeks;
alter publication supabase_realtime add table elements;
