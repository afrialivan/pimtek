-- Seed awal OKFT-UH. Jalankan SETELAH schema.sql.
-- Password semua akun demo: 111111 (hash scrypt, format scrypt$N$r$p$salt$hash).

insert into users (nim, name, department, role, password_hash) values
  ('ADMIN001', 'Admin OKFT', 'Informatika', 'admin', 'scrypt$16384$8$1$5f75f72ed81ba40629107e72eaf8e848$5b656f3f9730ff0ba63dc01584da3cadb6bc70cd7648659e426937f8e3166eb9036b58be86e88dc8fc7e724b91887bcd4976c40b10429d126a265c2b64aa44f4'),
  ('D041231098', 'Syafaat Ashar', 'Teknik Elektro', 'scrypt$16384$8$1$a1701e5c7676a071d32282031b187141$3dc7e2869274889ed57bbbd0145e15afc1203af2c0d264530cca10e0b8d2ad8910bff02458f1f8021670e77adf699c99846044835b9b1c9872e145488597156a'),
  ('D041231099', 'Andi Habibullah', 'Informatika', 'scrypt$16384$8$1$9b0e9090d4975b629d86e670a90ce75e$447fa5153e5236213630f594d646de12949790f0a1df58837d7315d516f47f42726ebcdca389537689c2528362d0177c4c90714f8146f719afa4c8b6efdef0bb'),
  ('D041231100', 'Fakhiroh Pannyiwi', 'Teknik Elektro', 'scrypt$16384$8$1$06adc19f47467b6c8c95bfba91d47d72$9eae676abc49eab502a5407ac886e01eb7b227e72cff77c9a991eacdc250173f0d73894f305de868ec9b1d28a3c30c655727c6250d64d39546149e1fc0c3e8bd'),
  ('D041231101', 'Megumi Khairunnisa', 'Ilmu Komputer', 'scrypt$16384$8$1$00fc4c15fd26e33411b5e4dc2d11189e$ff30bdc221b9da49ab36d696c6f51939b83f4687e7e4adf1617160a3b77fc1e98a664a88ce610b268fb036910c0e78174d20f24f48715a2a9f53a187ac8073bf'),
  ('D041231102', 'Rizky Pratama', 'Teknik Mesin', 'scrypt$16384$8$1$759ab50f7362b9ed08c7ddf3051c50d9$f5220242d2f1871e1377b24c7ffd137ded4dd5f92e128c34158a7b93fc9b1f5caa7d110327ab582c3275064b4074cdeb8957888dbaa47633cd98914524aa52ad'),
  ('D041231103', 'Siti Rahma', 'Manajemen', 'scrypt$16384$8$1$ade0d8b250019bf4fff69a967cf6ab7e$019f5072d139b79ced4386e4b3c3b112e3a92d36868b2d82ada64e34fd5960e3b5186b347644d9f17f6623765eda8755f70a29fef7e685bc0d11349c1e79a86a')
on conflict (nim) do nothing;

insert into teams (id, title, about, status, leader_nim, created_at, deadline) values
  ('hcs-schematic', 'HCS maaf ya Azril aku lagi cari posisi yang pas buat daftar schematic 2025', 'Tim schematic HCS untuk PIMTEK.', 'Berjalan', 'D041231098', '4 Oktober 2026', 'Oct 21, 2026'),
  ('ijazah', 'ijazahnya mana woy', 'Tim riset dokumen akademik.', 'Berjalan', 'D041231100', '4 Oktober 2026', 'Oct 21, 2026'),
  ('born-to-say', 'Born to say: My kisah. Forced to say: When yh?', 'Tim storytelling dan presentasi.', 'Berjalan', 'D041231101', '4 Oktober 2026', 'Oct 21, 2026'),
  ('stigmaboy', 'fahri bilang nama timnya stigmaboy aja dan kita setuju', 'Tim robotika dan otomasi.', 'Berjalan', 'D041231102', '4 Oktober 2026', 'Oct 21, 2026'),
  ('icc-pisang-molen', 'ICC Pisang Molen', 'Tim kuliner dan kewirausahaan.', 'Berjalan', 'D041231103', '4 Oktober 2026', 'Oct 21, 2026'),
  ('residivis', 'Residivis', 'Tim riset sosial.', 'Berjalan', 'D041231100', '4 Oktober 2026', 'Oct 21, 2026'),
  ('probstat', 'Pak Rila Maaf Kami Izin Probstat Mau Tampil di Depan', 'Tim probabilitas dan statistika.', 'Berjalan', 'D041231103', '4 Oktober 2026', 'Oct 21, 2026'),
  ('petir', 'PETIR kata ko franz jadi singa sirkus atau singa liar', 'Tim energi dan kelistrikan.', 'Berjalan', 'D041231101', '4 Oktober 2026', 'Oct 21, 2026'),
  ('antek-aseng', 'antek antek aseng', 'Tim riset teknologi.', 'Berjalan', 'D041231102', '4 Oktober 2026', 'Oct 21, 2026')
on conflict (id) do nothing;

-- Akun A (D041231098) hanya di tim 1 sebagai Leader, akun B tanpa tim (simulasi join).
insert into memberships (team_id, nim, role) values
  ('hcs-schematic', 'D041231098', 'Leader'),
  ('ijazah', 'D041231100', 'Leader'),
  ('ijazah', 'D041231101', 'Anggota'),
  ('born-to-say', 'D041231101', 'Leader'),
  ('stigmaboy', 'D041231102', 'Leader'),
  ('stigmaboy', 'D041231101', 'Anggota'),
  ('icc-pisang-molen', 'D041231103', 'Leader'),
  ('residivis', 'D041231100', 'Leader'),
  ('residivis', 'D041231103', 'Anggota'),
  ('probstat', 'D041231103', 'Leader'),
  ('probstat', 'D041231100', 'Anggota'),
  ('petir', 'D041231101', 'Leader'),
  ('antek-aseng', 'D041231102', 'Leader'),
  ('antek-aseng', 'D041231103', 'Anggota')
on conflict (team_id, nim) do nothing;

insert into departments (name) values
  ('Arsitektur'),
  ('Informatika'),
  ('Teknik Elektro'),
  ('Teknik Geologi'),
  ('Teknik Industri'),
  ('Teknik Lingkungan'),
  ('Teknik Mesin'),
  ('Teknik Perkapalan'),
  ('Teknik Sipil')
on conflict (name) do nothing;
