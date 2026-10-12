-- Migrasi 05: hapus Fakultas. Departemen jadi daftar nama dari DB.
-- Jalankan di Supabase Dashboard -> SQL Editor SETELAH migration-04.sql.

alter table users drop column if exists faculty;

alter table departments drop column if exists faculty;
alter table departments add constraint departments_name_unique unique (name);
