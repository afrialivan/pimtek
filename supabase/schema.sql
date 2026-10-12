-- Skema database OKFT-UH (PIMTEK Team Finder)
-- Jalankan di Supabase Dashboard -> SQL Editor.

-- 1. Users (tanpa email, sesuai keputusan)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  nim text unique not null,
  name text not null,
  department text not null default '',
  role text not null default 'user',
  bio text not null default '',
  skills text not null default '',
  interests text not null default '',
  experiences text not null default '',
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- 2. Skim PKM
create table if not exists schemes (
  id text primary key,
  name text not null,
  description text not null default ''
);

-- 3. Teams
create table if not exists teams (
  id text primary key,
  name text not null,
  title text,
  scheme_id text references schemes(id),
  group_link text,
  idea_overview text,
  about text not null default '',
  status text not null default 'Berjalan',
  leader_nim text,
  created_at text not null default '',
  deadline text not null default ''
);

-- 4. Memberships (aturan 1 tim dijaga di API, bukan constraint keras agar seed fleksibel)
create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  team_id text not null references teams(id) on delete cascade,
  nim text not null,
  role text not null default 'Anggota',
  joined_at timestamptz not null default now(),
  unique (team_id, nim)
);

-- 5. Join requests
create table if not exists join_requests (
  id uuid primary key default gen_random_uuid(),
  team_id text not null references teams(id) on delete cascade,
  nim text not null,
  name text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- 6. Dokumen tim (upload file fase 2 via Supabase Storage)
create table if not exists team_documents (
  id uuid primary key default gen_random_uuid(),
  team_id text not null references teams(id) on delete cascade,
  name text not null,
  file_url text,
  size text not null default '',
  uploaded_by text,
  created_at timestamptz not null default now()
);

-- 7. Tautan tim
create table if not exists team_links (
  id uuid primary key default gen_random_uuid(),
  team_id text not null references teams(id) on delete cascade,
  label text not null,
  url text not null
);

-- 8. Aktivitas tim
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  team_id text not null references teams(id) on delete cascade,
  actor_nim text,
  action text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);

-- 9. Opsi departemen per fakultas (dikelola admin)
create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unique (name)
);

-- RLS: aktif tanpa policy publik. API Next memakai service_role key
-- (melewati RLS) sehingga browser tidak pernah punya akses langsung.
alter table users enable row level security;
alter table schemes enable row level security;
alter table departments enable row level security;
alter table teams enable row level security;
alter table memberships enable row level security;
alter table join_requests enable row level security;
alter table team_documents enable row level security;
alter table team_links enable row level security;
alter table activities enable row level security;

-- Seed skim PKM
insert into schemes (id, name, description) values
  ('PKM-RE', 'PKM Riset Eksakta', 'Riset bidang eksakta'),
  ('PKM-RSH', 'PKM Riset Sosial Humaniora', 'Riset bidang sosial humaniora'),
  ('PKM-K', 'PKM Kewirausahaan', 'Kewirausahaan mahasiswa'),
  ('PKM-PI', 'PKM Penerapan IPTEK', 'Penerapan IPTEK ke masyarakat'),
  ('PKM-PM', 'PKM Pengabdian Masyarakat', 'Pengabdian kepada masyarakat'),
  ('PKM-KC', 'PKM Karsa Cipta', 'Karsa cipta dan karya teknik'),
  ('PKM-KI', 'PKM Karya Inovatif', 'Karya inovatif mahasiswa'),
  ('PKM-VGK', 'PKM Video Gagasan Konstruktif', 'Video gagasan konstruktif'),
  ('PKM-GFT', 'PKM Gagasan Futuristik Tertulis', 'Gagasan futuristik tertulis'),
  ('PKM-AI', 'PKM Artikel Ilmiah', 'Artikel ilmiah mahasiswa')
on conflict (id) do nothing;
