-- Migrasi 02: hapus Nama Tim, tambah Fakultas + Departemen.
-- Jalankan di Supabase Dashboard -> SQL Editor SETELAH schema.sql + seed.sql.

-- 1. Users: tambah fakultas + departemen.
alter table users add column if not exists faculty text not null default '';
alter table users add column if not exists department text not null default '';

update users set faculty = 'Teknik', department = 'Teknik Elektro' where nim = 'D041231098';
update users set faculty = 'Teknik', department = 'Informatika' where nim = 'D041231099';
update users set faculty = 'Teknik', department = 'Teknik Elektro' where nim = 'D041231100';
update users set faculty = 'MIPA', department = 'Ilmu Komputer' where nim = 'D041231101';
update users set faculty = 'Teknik', department = 'Teknik Mesin' where nim = 'D041231102';
update users set faculty = 'Ekonomi dan Bisnis', department = 'Manajemen' where nim = 'D041231103';

-- 2. Teams: judul ide jadi satu-satunya judul, kolom name dihapus.
update teams set title = name where title is null;
alter table teams alter column title set not null;
alter table teams drop column if exists name;
