-- CreateTable
CREATE TABLE `users` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `peran` ENUM('USER', 'DRIVER', 'INDUSTRI', 'ADMIN') NOT NULL DEFAULT 'USER',
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `no_hp` VARCHAR(20) NOT NULL,
    `alamat_lengkap` TEXT NULL,
    `koordinat_lat` DECIMAL(10, 8) NULL,
    `koordinat_long` DECIMAL(11, 8) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dompet` (
    `id_dompet` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `saldo_terkini` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `tgl_update` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dompet_id_user_key`(`id_user`),
    PRIMARY KEY (`id_dompet`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `harga_harian` (
    `id_harga` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATE NOT NULL,
    `harga_beli_per_liter` DECIMAL(10, 2) NOT NULL,
    `harga_jual_industri` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id_harga`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanan` (
    `id_pesanan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_driver` INTEGER NULL,
    `tanggal_pesan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status_order` ENUM('MENUNGGU', 'DIJEMPUT', 'SELESAI', 'BATAL') NOT NULL DEFAULT 'MENUNGGU',
    `vol_estimasi` DECIMAL(10, 2) NOT NULL,
    `foto_sampah_base64` LONGTEXT NOT NULL,
    `vol_real` DECIMAL(10, 2) NULL,
    `bukti_timbang_base64` LONGTEXT NULL,
    `harga_per_liter_saat_itu` DECIMAL(10, 2) NULL,
    `total_bayar` DECIMAL(15, 2) NULL,

    PRIMARY KEY (`id_pesanan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penarikan_dana` (
    `id_penarikan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `nominal` DECIMAL(15, 2) NOT NULL,
    `bank_tujuan` VARCHAR(191) NOT NULL,
    `nomor_rekening` VARCHAR(191) NOT NULL,
    `status_transfer` ENUM('PENDING', 'SUKSES', 'GAGAL') NOT NULL DEFAULT 'PENDING',
    `tgl_request` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_penarikan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanan_bulk` (
    `id_bulk` INTEGER NOT NULL AUTO_INCREMENT,
    `id_industri` INTEGER NOT NULL,
    `total_tonase` DECIMAL(10, 2) NOT NULL,
    `total_tagihan` DECIMAL(20, 2) NOT NULL,
    `status_pembayaran` ENUM('BELUM_BAYAR', 'LUNAS') NOT NULL DEFAULT 'BELUM_BAYAR',
    `tgl_order` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_bulk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dompet` ADD CONSTRAINT `dompet_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `pesanan_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `pesanan_id_driver_fkey` FOREIGN KEY (`id_driver`) REFERENCES `users`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penarikan_dana` ADD CONSTRAINT `penarikan_dana_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanan_bulk` ADD CONSTRAINT `pesanan_bulk_id_industri_fkey` FOREIGN KEY (`id_industri`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
