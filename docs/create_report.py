#!/usr/bin/env python3
"""
Script untuk menghasilkan Laporan Dokumentasi Sistem EcoOil dalam format Word (.docx)
"""

from docx import Document
from docx.shared import Inches, Pt, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml.ns import qn


def add_heading_styled(doc, text, level=1):
    """Tambahkan heading dengan style yang bagus"""
    heading = doc.add_heading(text, level=level)
    return heading


def add_paragraph_styled(doc, text, bold=False):
    """Tambahkan paragraf dengan style yang rapi"""
    para = doc.add_paragraph()
    run = para.add_run(text)
    run.bold = bold
    para.paragraph_format.line_spacing = 1.5
    para.paragraph_format.space_after = Pt(12)
    return para


def create_ecooil_report():
    doc = Document()
    
    # =====================
    # HALAMAN JUDUL
    # =====================
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run("\n\n\nLAPORAN DOKUMENTASI SISTEM\n")
    run.bold = True
    run.font.size = Pt(24)
    
    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run2 = subtitle.add_run("ECOOIL\nSistem Manajemen Minyak Jelantah Terintegrasi")
    run2.bold = True
    run2.font.size = Pt(18)
    
    doc.add_paragraph("\n\n\n\n")
    
    desc = doc.add_paragraph()
    desc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    desc.add_run("Dokumentasi Use Case, Activity Diagram, Sequence Diagram,\nClass Diagram, dan Penjelasan Fitur Aplikasi")
    
    doc.add_page_break()
    
    # =====================
    # DAFTAR ISI
    # =====================
    add_heading_styled(doc, "DAFTAR ISI", 1)
    toc_items = [
        "1. Pendahuluan",
        "2. Penjelasan Aktor dalam Sistem",
        "3. Use Case Diagram",
        "4. Activity Diagram",
        "   4.1. Activity Diagram User",
        "   4.2. Activity Diagram Driver", 
        "   4.3. Activity Diagram Industri",
        "5. Sequence Diagram",
        "   5.1. Sequence Diagram User",
        "   5.2. Sequence Diagram Driver",
        "   5.3. Sequence Diagram Industri",
        "6. Class Diagram",
        "7. Penjelasan Fitur Aplikasi",
        "8. Kesimpulan"
    ]
    for item in toc_items:
        doc.add_paragraph(item)
    
    doc.add_page_break()
    
    # =====================
    # BAB 1: PENDAHULUAN
    # =====================
    add_heading_styled(doc, "1. Pendahuluan", 1)
    
    pendahuluan_text = """EcoOil merupakan sebuah platform digital inovatif yang dirancang untuk mengelola proses pengumpulan, distribusi, dan monetisasi minyak jelantah (bekas pakai) secara efisien dan berkelanjutan. Sistem ini hadir sebagai solusi atas permasalahan lingkungan yang ditimbulkan oleh pembuangan minyak jelantah sembarangan, sekaligus memberikan nilai ekonomi bagi masyarakat yang menjual limbahnya.

Dalam ekosistem EcoOil, terdapat beberapa pihak yang saling berinteraksi: pengguna rumah tangga yang ingin menyetorkan minyak jelantahnya, mitra driver yang bertugas menjemput dan memverifikasi kualitas minyak, serta industri pengolah yang membeli minyak dalam jumlah besar untuk diproses menjadi produk bernilai seperti biodiesel atau bahan baku industri lainnya. Seluruh aktivitas ini diawasi dan dikelola oleh admin sistem yang memastikan kelancaran operasional.

Dokumen ini bertujuan untuk memberikan gambaran menyeluruh mengenai arsitektur dan alur kerja sistem EcoOil melalui berbagai diagram UML (Unified Modeling Language). Pembaca akan diajak memahami siapa saja aktor yang terlibat, bagaimana mereka berinteraksi dengan sistem, serta fitur-fitur apa saja yang tersedia dalam aplikasi."""
    
    add_paragraph_styled(doc, pendahuluan_text)
    doc.add_page_break()
    
    # =====================
    # BAB 2: PENJELASAN AKTOR
    # =====================
    add_heading_styled(doc, "2. Penjelasan Aktor dalam Sistem", 1)
    
    add_heading_styled(doc, "2.1. User (Rumah Tangga)", 2)
    user_text = """User atau pengguna rumah tangga adalah aktor utama yang menjadi sumber pasokan minyak jelantah dalam ekosistem EcoOil. Mereka adalah individu atau keluarga yang memiliki limbah minyak goreng bekas dari aktivitas memasak sehari-hari.

Peran utama User dalam sistem meliputi:
• Mendaftarkan diri dan membuat akun di platform EcoOil
• Mengajukan permintaan penjemputan minyak jelantah dengan mengunggah foto limbah dan memperkirakan volume
• Menerima pembayaran ke dalam dompet digital setelah transaksi selesai
• Memantau riwayat transaksi yang pernah dilakukan
• Melakukan penarikan saldo ke rekening bank pribadi

Dengan keterlibatan User, EcoOil tidak hanya membantu masyarakat mendapatkan nilai ekonomi dari limbah mereka, tetapi juga berkontribusi pada pelestarian lingkungan dengan mencegah pembuangan minyak jelantah ke saluran air."""
    add_paragraph_styled(doc, user_text)
    
    add_heading_styled(doc, "2.2. Mitra Kolektor (Driver)", 2)
    driver_text = """Mitra Kolektor atau Driver adalah ujung tombak operasional lapangan dalam sistem EcoOil. Mereka bertanggung jawab untuk menjemput minyak jelantah dari lokasi pengguna, melakukan verifikasi kualitas, dan memastikan proses transaksi berjalan dengan tepat.

Tugas dan tanggung jawab Driver meliputi:
• Melihat daftar order yang masuk di area cakupan mereka (Job Radar)
• Mengambil order dan menuju lokasi pengguna untuk menjemput limbah
• Melakukan penimbangan aktual di depan pengguna untuk transparansi
• Memverifikasi kualitas minyak jelantah (menolak jika terdapat oplosan atau kontaminasi)
• Mengunggah bukti timbangan sebagai dokumentasi
• Menyelesaikan transaksi sehingga saldo otomatis masuk ke dompet pengguna

Driver memegang peranan krusial dalam menjaga kepercayaan ekosistem, karena mereka yang menentukan apakah sebuah transaksi layak diterima atau tidak berdasarkan kondisi aktual di lapangan."""
    add_paragraph_styled(doc, driver_text)
    
    add_heading_styled(doc, "2.3. Industri Pengolah", 2)
    industri_text = """Industri Pengolah merupakan aktor yang berperan sebagai pembeli akhir minyak jelantah dalam jumlah besar (bulk). Mereka umumnya adalah pabrik atau perusahaan yang mengolah minyak jelantah menjadi produk bernilai tinggi seperti biodiesel, sabun, atau bahan baku industri lainnya.

Aktivitas Industri dalam sistem EcoOil mencakup:
• Memantau ketersediaan stok minyak jelantah di gudang virtual EcoOil
• Mengajukan pesanan pembelian dalam skala besar (misalnya dalam satuan ton)
• Melakukan pembayaran secara transfer bank dan mengunggah bukti transaksi
• Menerima konfirmasi pengiriman setelah pembayaran terverifikasi
• Mengunduh dokumen invoice dan surat jalan untuk keperluan administrasi

Kehadiran Industri Pengolah memastikan bahwa seluruh minyak jelantah yang terkumpul memiliki tujuan akhir yang jelas dan bermanfaat, menyempurnakan siklus ekonomi sirkular dalam ekosistem EcoOil."""
    add_paragraph_styled(doc, industri_text)
    
    add_heading_styled(doc, "2.4. Admin Sistem", 2)
    admin_text = """Admin Sistem adalah pengelola di balik layar yang memastikan seluruh operasional EcoOil berjalan dengan lancar. Mereka memiliki akses penuh terhadap berbagai aspek manajemen platform.

Wewenang dan tanggung jawab Admin meliputi:
• Mengelola data pengguna, driver, dan industri yang terdaftar
• Menetapkan dan memperbarui harga harian pembelian minyak jelantah
• Memvalidasi pembayaran dari industri sebelum pengiriman diproses
• Menyetujui atau menolak permintaan penarikan dana dari pengguna
• Memantau seluruh aktivitas transaksi dalam sistem

Admin berperan sebagai penjaga integritas sistem, memastikan bahwa setiap transaksi berlangsung secara adil dan sesuai dengan ketentuan yang berlaku."""
    add_paragraph_styled(doc, admin_text)
    
    doc.add_page_break()
    
    # =====================
    # BAB 3: USE CASE DIAGRAM
    # =====================
    add_heading_styled(doc, "3. Use Case Diagram", 1)
    
    usecase_intro = """Use Case Diagram menggambarkan interaksi antara aktor-aktor dengan fungsi-fungsi utama yang tersedia dalam sistem EcoOil. Diagram ini memberikan pandangan tingkat tinggi mengenai apa saja yang dapat dilakukan oleh setiap peran dalam ekosistem."""
    add_paragraph_styled(doc, usecase_intro)
    
    add_heading_styled(doc, "3.1. Deskripsi Use Case", 2)
    
    # Tabel Use Case
    table = doc.add_table(rows=12, cols=3)
    table.style = 'Table Grid'
    
    # Header
    header_cells = table.rows[0].cells
    header_cells[0].text = "Kode"
    header_cells[1].text = "Use Case"
    header_cells[2].text = "Aktor"
    
    # Data
    use_cases = [
        ("UC1", "Login / Register", "User, Driver, Industri"),
        ("UC2", "Request Penjemputan", "User"),
        ("UC3", "Lihat Riwayat Transaksi", "User"),
        ("UC4", "Tarik Saldo (Withdraw)", "User"),
        ("UC5", "Terima Order Jemput", "Driver"),
        ("UC6", "Input Timbangan & Verifikasi", "Driver"),
        ("UC7", "Update Status ke Gudang", "Driver"),
        ("UC8", "Lihat Stok Bulk", "Industri"),
        ("UC9", "Beli Stok Besar (B2B)", "Industri, Admin"),
        ("UC10", "Validasi Pembayaran", "Admin"),
        ("UC11", "Kelola User & Mitra", "Admin"),
    ]
    
    for i, (kode, uc, aktor) in enumerate(use_cases, 1):
        row = table.rows[i].cells
        row[0].text = kode
        row[1].text = uc
        row[2].text = aktor
    
    doc.add_paragraph()
    
    add_heading_styled(doc, "3.2. Penjelasan Detail Use Case", 2)
    
    uc_explanations = """UC1 - Login/Register: Semua aktor harus terlebih dahulu melakukan autentikasi untuk dapat mengakses fitur-fitur yang sesuai dengan peran mereka. Proses registrasi mencakup pengisian data pribadi, validasi email, dan pengaturan kata sandi.

UC2 - Request Penjemputan: Pengguna rumah tangga dapat mengajukan permintaan penjemputan minyak jelantah dengan mengunggah foto limbah, memasukkan estimasi volume, dan memberikan informasi lokasi. Sistem akan meneruskan permintaan ini ke driver terdekat.

UC3 - Lihat Riwayat Transaksi: Pengguna dapat melihat rekam jejak seluruh transaksi yang pernah dilakukan, termasuk status order, volume aktual, dan nominal pembayaran yang diterima.

UC4 - Tarik Saldo: Pengguna yang memiliki saldo di dompet digital dapat mengajukan penarikan ke rekening bank pribadi. Permintaan ini akan diproses oleh admin sistem.

UC5 - Terima Order Jemput: Driver melihat daftar order yang tersedia di sekitar lokasi mereka dan dapat memilih order mana yang akan dikerjakan.

UC6 - Input Timbangan & Verifikasi: Setelah tiba di lokasi pengguna, driver melakukan penimbangan aktual dan memverifikasi kualitas minyak. Data volume real dan bukti foto diunggah ke sistem.

UC7 - Update Status ke Gudang: Setelah transaksi selesai, sistem otomatis memperbarui stok gudang virtual dengan menambahkan volume minyak yang berhasil dikumpulkan.

UC8 - Lihat Stok Bulk: Industri dapat memantau ketersediaan stok minyak jelantah yang ready untuk dibeli, lengkap dengan informasi harga per liter.

UC9 - Beli Stok Besar: Industri mengajukan purchase order dalam jumlah besar. Admin akan memproses pesanan ini setelah pembayaran terkonfirmasi.

UC10 - Validasi Pembayaran: Admin memeriksa bukti transfer dari industri dan memvalidasi apakah pembayaran sudah sesuai sebelum pengiriman dilakukan.

UC11 - Kelola User & Mitra: Admin memiliki wewenang untuk mengelola seluruh akun yang terdaftar, termasuk melakukan suspend, edit data, atau verifikasi akun."""
    add_paragraph_styled(doc, uc_explanations)
    
    doc.add_page_break()
    
    # =====================
    # BAB 4: ACTIVITY DIAGRAM
    # =====================
    add_heading_styled(doc, "4. Activity Diagram", 1)
    
    activity_intro = """Activity Diagram menggambarkan alur kerja atau workflow dari sebuah proses bisnis. Pada sistem EcoOil, terdapat tiga activity diagram utama yang mewakili alur aktivitas dari masing-masing aktor utama: User, Driver, dan Industri."""
    add_paragraph_styled(doc, activity_intro)
    
    add_heading_styled(doc, "4.1. Activity Diagram User (Setor Jelantah)", 2)
    
    activity_user = """Alur aktivitas pengguna dalam menyetorkan minyak jelantah dimulai dari proses login hingga menerima konfirmasi bahwa sistem sedang mencari driver. Berikut adalah tahapan detailnya:

1. Login ke Sistem: Pengguna membuka aplikasi dan melakukan autentikasi menggunakan email dan password yang telah didaftarkan sebelumnya.

2. Masuk ke Dashboard User: Setelah berhasil login, pengguna diarahkan ke halaman dashboard yang menampilkan ringkasan informasi akun, saldo, dan menu-menu yang tersedia.

3. Pilih Menu "Setor Jelantah": Pengguna memilih fitur untuk mengajukan permintaan penjemputan minyak jelantah.

4. Mengisi Form Request: Sistem menampilkan formulir yang meminta pengguna untuk:
   • Mengunggah foto kondisi minyak jelantah
   • Memasukkan estimasi volume dalam liter
   • Mengkonfirmasi alamat lokasi penjemputan

5. Validasi Data: Sistem memeriksa kelengkapan data yang dimasukkan. Jika ada field yang kosong atau tidak valid, sistem menampilkan pesan error.

6. Penyimpanan & Broadcast: Jika data lengkap, sistem menyimpan order ke database dengan status "Menunggu" dan mengirimkan notifikasi ke driver-driver yang berada di area terdekat.

7. Konfirmasi ke User: Pengguna menerima notifikasi bahwa permintaan telah berhasil dibuat dan sistem sedang mencari driver yang tersedia."""
    add_paragraph_styled(doc, activity_user)
    
    add_heading_styled(doc, "4.2. Activity Diagram Driver (Proses Jemput)", 2)
    
    activity_driver = """Alur aktivitas driver menggambarkan proses lengkap dari menerima order hingga menyelesaikan transaksi atau menolak order jika kualitas tidak memenuhi standar:

1. Login ke Sistem: Driver melakukan autentikasi ke dalam aplikasi.

2. Melihat Job Radar: Dashboard driver menampilkan daftar order yang tersedia di sekitar lokasi mereka, lengkap dengan informasi estimasi volume dan jarak.

3. Mengambil Order: Driver memilih salah satu order dan mengklik "Ambil Order" untuk meng-claim tugas tersebut.

4. Update Status OTW: Sistem mengubah status order menjadi "Dijemput" dan menampilkan rute navigasi ke lokasi pengguna.

5. Verifikasi Kualitas: Setelah tiba di lokasi, driver memeriksa kondisi fisik minyak jelantah. Pada tahap ini terdapat dua kemungkinan:

   Jika kualitas layak:
   • Driver melakukan penimbangan di depan pengguna
   • Menginput volume real (hasil timbangan aktual)
   • Mengunggah foto bukti timbangan
   • Mengklik "Selesaikan Order"
   • Sistem menghitung total pembayaran berdasarkan volume dikali harga harian
   • Saldo otomatis ditambahkan ke dompet pengguna
   • Status order berubah menjadi "Selesai"

   Jika kualitas tidak layak (oplosan/kontaminasi):
   • Driver menjelaskan alasan penolakan kepada pengguna
   • Mengklik "Tolak Order" dan mengisi form alasan
   • Sistem mengubah status order menjadi "Batal"
   • Pengguna menerima notifikasi penolakan beserta alasannya"""
    add_paragraph_styled(doc, activity_driver)
    
    add_heading_styled(doc, "4.3. Activity Diagram Industri (Pembelian Bulk)", 2)
    
    activity_industri = """Alur aktivitas industri menggambarkan proses pembelian minyak jelantah dalam skala besar, mulai dari pengecekan stok hingga penerimaan dokumen pengiriman:

1. Login ke Sistem: Perwakilan industri melakukan autentikasi menggunakan akun perusahaan.

2. Melihat Dashboard Industri: Halaman utama menampilkan grafik ketersediaan stok gudang virtual beserta harga jual terkini per liter.

3. Pengecekan Stok: Sistem menampilkan informasi real-time mengenai stok yang tersedia. Jika stok tidak mencukupi kebutuhan, industri harus menunggu hingga stok bertambah.

4. Membuat Pesanan Bulk (PO): Jika stok cukup, industri dapat mengklik "Buat Pesanan Bulk" dan memasukkan jumlah tonase yang diinginkan.

5. Checkout & Invoice: Sistem menghitung total tagihan berdasarkan tonase dikali harga jual, lalu menampilkan halaman pembayaran dengan invoice digital.

6. Proses Pembayaran:
   • Industri melakukan transfer bank sesuai nominal tagihan
   • Mengunggah bukti transfer ke sistem
   • Mengklik "Konfirmasi Bayar"

7. Verifikasi oleh Admin: Tim admin atau sistem otomatis memverifikasi keaslian bukti pembayaran.

   Jika pembayaran valid:
   • Status order diubah menjadi "Lunas/Dikirim"
   • Stok gudang virtual dikurangi sesuai jumlah pesanan
   • Invoice lunas dan surat jalan dikirimkan ke industri
   • Industri menerima notifikasi bahwa pesanan sedang dalam proses pengiriman

   Jika bukti tidak valid:
   • Pembayaran ditolak
   • Industri menerima notifikasi kegagalan beserta alasannya"""
    add_paragraph_styled(doc, activity_industri)
    
    doc.add_page_break()
    
    # =====================
    # BAB 5: SEQUENCE DIAGRAM
    # =====================
    add_heading_styled(doc, "5. Sequence Diagram", 1)
    
    sequence_intro = """Sequence Diagram menunjukkan urutan interaksi antar objek dalam menjalankan suatu skenario use case. Diagram ini menggambarkan bagaimana pesan dikirim dan diterima antara aktor, antarmuka pengguna (UI), dan sistem backend dalam urutan waktu tertentu."""
    add_paragraph_styled(doc, sequence_intro)
    
    add_heading_styled(doc, "5.1. Sequence Diagram User (Request Penjemputan)", 2)
    
    seq_user = """Sequence diagram ini menggambarkan interaksi saat pengguna mengajukan permintaan penjemputan minyak jelantah:

Aktor yang terlibat:
• User (Rumah Tangga): Inisiator proses
• Halaman Request (UI): Antarmuka pengguna
• Sistem Backend (BE): Server yang memproses data

Alur Interaksi:
1. User membuka menu "Setor Jelantah" → UI menampilkan form request
2. User mengisi data (upload foto, estimasi volume) → User mengklik "Request Pickup"
3. UI mengirim data order ke Backend melalui request POST
4. Backend melakukan validasi input data
5. Backend menyimpan order dengan status "Pending"
6. Backend mengirimkan broadcast ke driver-driver di area sekitar
7. Backend mengembalikan konfirmasi sukses ke UI
8. UI menampilkan pesan "Mencari Driver" kepada User

Seluruh proses ini berlangsung secara asinkron, dimana user tidak perlu aktif menunggu hingga driver ditemukan."""
    add_paragraph_styled(doc, seq_user)
    
    add_heading_styled(doc, "5.2. Sequence Diagram Driver (Penyelesaian Order)", 2)
    
    seq_driver = """Sequence diagram ini menggambarkan interaksi saat driver menyelesaikan sebuah order penjemputan:

Aktor yang terlibat:
• Mitra Driver: Aktor yang menjalankan tugas
• Halaman Job (UI): Antarmuka aplikasi driver
• Sistem Backend (BE): Server pemroses transaksi

Alur Interaksi:
1. Driver membuka detail order aktif → UI menampilkan data User (nama, alamat, foto limbah)
2. Driver menginput volume real dan mengunggah foto bukti timbangan
3. Driver mengklik "Selesaikan Order"
4. UI mengirim data finalisasi ke Backend melalui request PUT
5. Backend mengambil data harga harian terbaru dari database
6. Backend menghitung total pembayaran: Volume Real × Harga Per Liter
7. Backend mengupdate saldo dompet digital User dan Driver
8. Backend mengubah status order menjadi "Selesai"
9. Backend mengembalikan data invoice ke UI
10. UI menampilkan notifikasi "Transaksi Berhasil" kepada Driver

Proses kalkulasi dan update saldo dilakukan secara atomik untuk memastikan konsistensi data keuangan."""
    add_paragraph_styled(doc, seq_driver)
    
    add_heading_styled(doc, "5.3. Sequence Diagram Industri (Pembelian Bulk)", 2)
    
    seq_industri = """Sequence diagram ini menggambarkan interaksi saat industri melakukan pembelian minyak jelantah dalam jumlah besar:

Aktor yang terlibat:
• Industri (Pabrik): Pembeli bulk
• Halaman Bulk Order (UI): Antarmuka pemesanan
• Sistem Backend (BE): Server pemroses pesanan

Alur Interaksi:
1. Industri membuka menu "Stok Gudang" → UI menampilkan grafik stok secara live
2. Industri mengklik "Beli Stok" dan memasukkan jumlah (misal: 1000 Liter)
3. UI mengirim request GET untuk cek ketersediaan stok
4. Backend merespons: stok tersedia, harga total Rp 8.000.000
5. Industri mengunggah bukti pembayaran dan mengklik "Konfirmasi Pesanan"
6. UI mengirim data order dan bukti ke Backend melalui request POST
7. Backend memvalidasi bukti pembayaran
8. Backend membuat record "PesananBulk" baru
9. Backend mengurangi stok global sebesar 1000 Liter
10. Backend mengubah status menjadi "Lunas/Shipping"
11. Backend mengembalikan data invoice ke UI
12. UI menampilkan notifikasi "Pembelian Berhasil" kepada Industri

Proses ini melibatkan verifikasi pembayaran yang bisa dilakukan secara otomatis atau manual oleh admin, tergantung kebijakan operasional."""
    add_paragraph_styled(doc, seq_industri)
    
    doc.add_page_break()
    
    # =====================
    # BAB 6: CLASS DIAGRAM
    # =====================
    add_heading_styled(doc, "6. Class Diagram", 1)
    
    class_intro = """Class Diagram menggambarkan struktur statis dari sistem, menunjukkan kelas-kelas yang ada beserta atribut, method, dan hubungan antar kelas. Pada sistem EcoOil, class diagram dibagi menjadi tiga bagian: Enumerations, Entities, dan Services."""
    add_paragraph_styled(doc, class_intro)
    
    add_heading_styled(doc, "6.1. Enumerations", 2)
    
    enum_text = """Enumerations adalah tipe data yang memiliki nilai-nilai terbatas yang telah didefinisikan. Dalam sistem EcoOil terdapat empat enumeration:

1. Peran: Mendefinisikan peran pengguna dalam sistem
   • USER - Pengguna rumah tangga
   • DRIVER - Mitra kolektor/driver
   • INDUSTRI - Pabrik pengolah
   • ADMIN - Administrator sistem

2. StatusOrder: Status dari sebuah pesanan penjemputan
   • MENUNGGU - Order baru, belum ada driver yang mengambil
   • DIJEMPUT - Driver sedang dalam perjalanan ke lokasi
   • SELESAI - Transaksi berhasil diselesaikan
   • BATAL - Order dibatalkan (oleh user atau driver)

3. StatusTransfer: Status penarikan dana
   • PENDING - Permintaan sedang menunggu persetujuan
   • SUKSES - Dana berhasil ditransfer
   • GAGAL - Penarikan ditolak atau gagal diproses

4. StatusBayar: Status pembayaran pesanan bulk
   • BELUM_BAYAR - Invoice belum dilunasi
   • LUNAS - Pembayaran telah terverifikasi"""
    add_paragraph_styled(doc, enum_text)
    
    add_heading_styled(doc, "6.2. Entities (Model Data)", 2)
    
    entities_text = """Entities merepresentasikan objek-objek utama yang menyimpan data dalam sistem:

1. User
   Menyimpan informasi pengguna termasuk email, password (terenkripsi), peran, nama lengkap, nomor HP, alamat, dan koordinat lokasi. Setiap user memiliki timestamp kapan akun dibuat.

2. Dompet
   Menyimpan informasi saldo digital pengguna. Setiap user memiliki tepat satu dompet yang menyimpan saldo terkini dan tanggal update terakhir. Method utama: getBalance(), addBalance(), deductBalance().

3. HargaHarian
   Menyimpan informasi harga pembelian dan penjualan minyak jelantah per hari. Admin dapat mengatur harga beli per liter (dari user) dan harga jual ke industri.

4. Pesanan
   Menyimpan informasi order penjemputan minyak jelantah. Termasuk relasi ke user (penjual), driver (jika sudah di-claim), estimasi dan volume aktual, bukti foto, serta harga dan total pembayaran.

5. PenarikanDana
   Menyimpan permintaan withdrawal dari user. Termasuk nominal, informasi bank tujuan, nomor rekening, status transfer, dan timestamp permintaan.

6. PesananBulk
   Menyimpan pesanan pembelian besar dari industri. Termasuk total tonase yang dipesan, total tagihan, status pembayaran, dan tanggal order."""
    add_paragraph_styled(doc, entities_text)
    
    add_heading_styled(doc, "6.3. Services (Layanan Bisnis)", 2)
    
    services_text = """Services merupakan kelas-kelas yang mengenkapsulasi logika bisnis sistem:

1. AuthService
   Menangani proses autentikasi dan manajemen sesi. Method: register(), login(), getCurrentUser(), hashPassword(), verifyPassword().

2. PesananService
   Mengelola siklus hidup pesanan penjemputan. Method: createOrder(), getUserOrders(), getOrderById(), cancelOrder(), getPendingJobs(), claimOrder(), getActiveTasks(), completeOrder().

3. DompetService
   Mengelola dompet digital pengguna. Method: getBalance(), addBalance(), deductBalance().

4. PenarikanService
   Menangani proses withdrawal dana. Method: requestWithdrawal(), getUserWithdrawals(), getAllWithdrawals(), getPendingWithdrawals(), approveWithdrawal(), rejectWithdrawal().

5. HargaService
   Mengelola pengaturan harga harian. Method: getTodayPrice(), setPrice(), getPriceHistory().

6. BulkService
   Menangani transaksi pembelian bulk oleh industri. Method: getAvailableStock(), createBulkOrder(), getIndustriOrders(), confirmPayment().

7. UserService
   Mengelola profil dan data pengguna. Method: getProfile(), updateProfile(), listUsers(), getUserById()."""
    add_paragraph_styled(doc, services_text)
    
    add_heading_styled(doc, "6.4. Relasi Antar Kelas", 2)
    
    relasi_text = """Berikut adalah hubungan-hubungan penting antar entity dalam sistem:

• User -- Dompet: Satu user memiliki maksimal satu dompet (one-to-one)
• User -- Pesanan: Satu user dapat memiliki banyak pesanan sebagai penjual (one-to-many)
• User -- Pesanan: Satu user (driver) dapat menangani banyak pesanan (one-to-many)
• User -- PenarikanDana: Satu user dapat mengajukan banyak penarikan (one-to-many)
• User -- PesananBulk: Satu user (industri) dapat membuat banyak pesanan bulk (one-to-many)

Selain itu, services terhubung ke entities yang mereka kelola. Misalnya, PesananService mengelola Pesanan dan juga membutuhkan akses ke Dompet (untuk update saldo) dan HargaHarian (untuk kalkulasi pembayaran)."""
    add_paragraph_styled(doc, relasi_text)
    
    doc.add_page_break()
    
    # =====================
    # BAB 7: FITUR APLIKASI
    # =====================
    add_heading_styled(doc, "7. Penjelasan Fitur Aplikasi", 1)
    
    fitur_intro = """Berdasarkan analisis use case dan diagram-diagram yang telah dijelaskan, berikut adalah fitur-fitur utama yang tersedia dalam aplikasi EcoOil:"""
    add_paragraph_styled(doc, fitur_intro)
    
    add_heading_styled(doc, "7.1. Fitur untuk User (Rumah Tangga)", 2)
    
    fitur_user = """1. Registrasi & Login
   Pengguna dapat mendaftarkan akun baru dengan mengisi data pribadi (nama, email, password, nomor HP, alamat). Setelah terdaftar, pengguna dapat login menggunakan email dan password.

2. Dashboard Personal
   Halaman utama yang menampilkan informasi saldo dompet, jumlah transaksi, dan akses cepat ke menu-menu utama.

3. Setor Jelantah (Request Pickup)
   Fitur untuk mengajukan permintaan penjemputan minyak jelantah. Pengguna mengunggah foto kondisi minyak, memasukkan estimasi volume, dan mengkonfirmasi lokasi penjemputan.

4. Riwayat Transaksi
   Menampilkan daftar seluruh transaksi yang pernah dilakukan, termasuk status, tanggal, volume aktual, dan nominal yang diterima.

5. Dompet Digital
   Fitur untuk melihat saldo, riwayat pergerakan saldo, dan mengajukan penarikan ke rekening bank.

6. Tarik Saldo
   Pengguna dapat mencairkan saldo dompet digital ke rekening bank pribadi dengan memasukkan nominal, nama bank, dan nomor rekening tujuan."""
    add_paragraph_styled(doc, fitur_user)
    
    add_heading_styled(doc, "7.2. Fitur untuk Driver (Mitra Kolektor)", 2)
    
    fitur_driver = """1. Login Driver
   Akses ke dashboard khusus driver dengan kredensial yang telah didaftarkan.

2. Job Radar
   Menampilkan daftar order yang tersedia di area sekitar lokasi driver. Informasi meliputi alamat, estimasi volume, dan jarak dari posisi saat ini.

3. Ambil Order
   Driver dapat meng-claim order yang dipilih untuk dikerjakan. Status order akan berubah menjadi "Dijemput".

4. Navigasi ke Lokasi
   Setelah mengambil order, sistem menampilkan rute navigasi ke lokasi pengguna.

5. Input Verifikasi
   Form untuk memasukkan volume aktual hasil penimbangan dan mengunggah foto bukti timbangan di depan pengguna.

6. Selesaikan/Tolak Order
   Driver dapat menyelesaikan transaksi (jika kualitas OK) atau menolak order (jika ada masalah kualitas) dengan mencantumkan alasan.

7. Riwayat Tugas
   Menampilkan daftar order yang pernah ditangani beserta pendapatan yang diperoleh."""
    add_paragraph_styled(doc, fitur_driver)
    
    add_heading_styled(doc, "7.3. Fitur untuk Industri (Pabrik Pengolah)", 2)
    
    fitur_industri = """1. Login Industri
   Akses ke dashboard khusus industri dengan akun perusahaan.

2. Monitoring Stok
   Dashboard yang menampilkan grafik ketersediaan stok minyak jelantah di gudang virtual EcoOil secara real-time.

3. Buat Pesanan Bulk
   Form untuk mengajukan pembelian minyak dalam jumlah besar dengan memasukkan tonase yang diinginkan.

4. Checkout & Pembayaran
   Halaman yang menampilkan invoice dengan total tagihan. Industri dapat mengunggah bukti transfer setelah melakukan pembayaran.

5. Riwayat Pesanan
   Daftar seluruh pesanan bulk yang pernah dibuat beserta statusnya (menunggu pembayaran, lunas, dikirim, selesai).

6. Download Dokumen
   Fitur untuk mengunduh invoice, bukti lunas, dan surat jalan untuk keperluan administrasi."""
    add_paragraph_styled(doc, fitur_industri)
    
    add_heading_styled(doc, "7.4. Fitur untuk Admin Sistem", 2)
    
    fitur_admin = """1. Dashboard Admin
   Halaman overview yang menampilkan statistik sistem: total pengguna, total transaksi, volume terkumpul, dan pendapatan.

2. Kelola Pengguna
   CRUD (Create, Read, Update, Delete) untuk mengelola data user, driver, dan industri yang terdaftar.

3. Pengaturan Harga
   Form untuk menetapkan harga pembelian harian (dari user) dan harga jual (ke industri). Riwayat perubahan harga juga tersimpan.

4. Validasi Pembayaran Industri
   Fitur untuk memeriksa bukti transfer dari industri dan mengkonfirmasi validitas pembayaran.

5. Persetujuan Penarikan
   Daftar permintaan withdrawal dari pengguna beserta tombol untuk menyetujui atau menolak permintaan.

6. Monitoring Transaksi
   Log seluruh aktivitas transaksi dalam sistem untuk keperluan audit dan pemantauan."""
    add_paragraph_styled(doc, fitur_admin)
    
    doc.add_page_break()
    
    # =====================
    # BAB 8: KESIMPULAN
    # =====================
    add_heading_styled(doc, "8. Kesimpulan", 1)
    
    kesimpulan = """Sistem EcoOil dirancang sebagai platform komprehensif yang menghubungkan berbagai pihak dalam ekosistem pengelolaan minyak jelantah. Dengan empat aktor utama—User, Driver, Industri, dan Admin—sistem ini menciptakan alur kerja yang efisien mulai dari pengumpulan di tingkat rumah tangga hingga penjualan ke industri pengolah.

Melalui Use Case Diagram, dapat terlihat bahwa setiap aktor memiliki peran dan fungsi yang jelas dalam sistem. Activity Diagram menunjukkan alur kerja detail dari masing-masing proses bisnis utama, sementara Sequence Diagram menggambarkan bagaimana interaksi antar komponen terjadi dalam urutan waktu tertentu.

Class Diagram memberikan gambaran arsitektur data sistem dengan entitas-entitas seperti User, Dompet, Pesanan, PenarikanDana, dan PesananBulk, beserta service-service yang mengelola logika bisnis. Struktur ini mendukung skalabilitas dan pemeliharaan sistem ke depan.

Fitur-fitur yang tersedia mencakup seluruh kebutuhan dari setiap stakeholder: mulai dari setor jelantah dan tarik saldo untuk pengguna, job radar dan verifikasi untuk driver, pembelian bulk untuk industri, hingga manajemen penuh untuk admin sistem.

Dengan dokumentasi yang terstruktur ini, diharapkan seluruh pihak yang terlibat dalam pengembangan dan operasional sistem EcoOil dapat memahami arsitektur, alur kerja, dan fitur-fitur yang ada dengan lebih baik."""
    add_paragraph_styled(doc, kesimpulan)
    
    # Simpan dokumen
    output_path = "/home/dika/ecooil-stack/docs/Laporan_Dokumentasi_EcoOil.docx"
    doc.save(output_path)
    print(f"Laporan berhasil disimpan ke: {output_path}")
    return output_path


if __name__ == "__main__":
    create_ecooil_report()
