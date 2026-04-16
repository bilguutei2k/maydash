create table boards (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My board',
  created_at timestamptz default now()
);

create table cards (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id) on delete cascade not null,
  type text not null check (type in ('note', 'image', 'link')),
  title text,
  body text,
  url text,
  color text not null default '#c8956c',
  author text not null,
  position integer not null default 0,
  deleted boolean not null default false,
  created_at timestamptz default now()
);

alter publication supabase_realtime add table cards;
alter publication supabase_realtime add table boards;
