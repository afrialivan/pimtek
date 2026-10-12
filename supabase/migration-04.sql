-- Migrasi 04: profil data diri (bio, skills, minat, pengalaman).
-- Jalankan di Supabase Dashboard -> SQL Editor SETELAH migration-03.sql.

alter table users add column if not exists bio text not null default '';
alter table users add column if not exists skills text not null default '';
alter table users add column if not exists interests text not null default '';
alter table users add column if not exists experiences text not null default '';

update users set
  bio = 'Mahasiswa Teknik Elektro yang bersemangat dengan minat khusus pada sistem tertanam dan kecerdasan buatan.',
  skills = 'Python, C++, IoT, PCB Design',
  interests = 'Embedded System, Artificial Intelligence',
  experiences = 'Asisten Lab Sistem Tertanam (2024-sekarang)
Juara 1 Kompetisi Robotika Nasional 2022'
where nim = 'D041231098';

update users set
  bio = 'Mahasiswa Ilmu Komputer yang suka mengolah data dan bahasa alami.',
  skills = 'Python, Data Analysis, SQL',
  interests = 'NLP, Machine Learning',
  experiences = 'Proyek analisis opini publik (2024)'
where nim = 'D041231111';

