-- Migrasi 03: role admin + tabel departments.
-- Jalankan di Supabase Dashboard -> SQL Editor SETELAH migration-02.sql.

-- 1. Role user.
alter table users add column if not exists role text not null default 'user';

-- 2. Akun admin (NIM ADMIN001, password admin123).
insert into users (nim, name, faculty, department, role, password_hash) values
  ('ADMIN001', 'Admin OKFT', 'Teknik', 'Informatika', 'admin', 'scrypt$16384$8$1$5f75f72ed81ba40629107e72eaf8e848$5b656f3f9730ff0ba63dc01584da3cadb6bc70cd7648659e426937f8e3166eb9036b58be86e88dc8fc7e724b91887bcd4976c40b10429d126a265c2b64aa44f4')
on conflict (nim) do update set role = 'admin';

-- 3. Tabel departments (opsi dropdown departemen per fakultas).
create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  faculty text not null,
  name text not null,
  unique (faculty, name)
);

insert into departments (faculty, name) values
  ('Teknik', 'Arsitektur'),
  ('Teknik', 'Informatika'),
  ('Teknik', 'Teknik Elektro'),
  ('Teknik', 'Teknik Geologi'),
  ('Teknik', 'Teknik Industri'),
  ('Teknik', 'Teknik Lingkungan'),
  ('Teknik', 'Teknik Mesin'),
  ('Teknik', 'Teknik Perkapalan'),
  ('Teknik', 'Teknik Sipil')
on conflict (faculty, name) do nothing;

alter table departments enable row level security;
