import "dotenv/config";
import prisma from "./lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await Bun.password.hash("admin123", {
    algorithm: "bcrypt",
    cost: 10,
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@ecooil.id" },
    update: {},
    create: {
      email: "admin@ecooil.id",
      password: adminPassword,
      nama_lengkap: "Admin EcoOil",
      no_hp: "081234567890",
      peran: "ADMIN",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create sample user
  const userPassword = await Bun.password.hash("user123", {
    algorithm: "bcrypt",
    cost: 10,
  });

  const user = await prisma.user.upsert({
    where: { email: "user@ecooil.id" },
    update: {},
    create: {
      email: "user@ecooil.id",
      password: userPassword,
      nama_lengkap: "Budi Santoso",
      no_hp: "081234567891",
      peran: "USER",
      alamat_lengkap: "Jl. Merdeka No. 123, Jakarta Selatan",
      koordinat_lat: -6.2088,
      koordinat_long: 106.8456,
    },
  });
  console.log("✅ User created:", user.email);

  // Create dompet for user
  await prisma.dompet.upsert({
    where: { id_user: user.id_user },
    update: {},
    create: {
      id_user: user.id_user,
      saldo_terkini: 0,
    },
  });
  console.log("✅ Dompet created for user");

  // Create sample driver
  const driverPassword = await Bun.password.hash("driver123", {
    algorithm: "bcrypt",
    cost: 10,
  });

  const driver = await prisma.user.upsert({
    where: { email: "driver@ecooil.id" },
    update: {},
    create: {
      email: "driver@ecooil.id",
      password: driverPassword,
      nama_lengkap: "Agus Driver",
      no_hp: "081234567892",
      peran: "DRIVER",
      koordinat_lat: -6.2,
      koordinat_long: 106.85,
    },
  });
  console.log("✅ Driver created:", driver.email);

  // Create sample industry
  const industriPassword = await Bun.password.hash("industri123", {
    algorithm: "bcrypt",
    cost: 10,
  });

  const industri = await prisma.user.upsert({
    where: { email: "pabrik@ecooil.id" },
    update: {},
    create: {
      email: "pabrik@ecooil.id",
      password: industriPassword,
      nama_lengkap: "PT Biodiesel Nusantara",
      no_hp: "081234567893",
      peran: "INDUSTRI",
      alamat_lengkap: "Kawasan Industri Cikarang, Bekasi",
    },
  });
  console.log("✅ Industry created:", industri.email);

  // Create today's price
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.hargaHarian.upsert({
    where: { id_harga: 1 },
    update: {
      harga_beli_per_liter: 5000,
      harga_jual_industri: 7000,
    },
    create: {
      tanggal: today,
      harga_beli_per_liter: 5000,
      harga_jual_industri: 7000,
    },
  });
  console.log("✅ Daily price set: Rp 5.000/liter (buy), Rp 7.000/liter (sell)");

  // Create sample pesanan with different statuses
  const sampleImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  // 1. Pesanan MENUNGGU (waiting for driver)
  await prisma.pesanan.create({
    data: {
      id_user: user.id_user,
      vol_estimasi: 5.0,
      foto_sampah_base64: sampleImage,
      status_order: "MENUNGGU",
    },
  });
  console.log("✅ Sample pesanan MENUNGGU created");

  // 2. Pesanan DIJEMPUT (being picked up by driver)
  await prisma.pesanan.create({
    data: {
      id_user: user.id_user,
      id_driver: driver.id_user,
      vol_estimasi: 3.5,
      foto_sampah_base64: sampleImage,
      status_order: "DIJEMPUT",
    },
  });
  console.log("✅ Sample pesanan DIJEMPUT created");

  // 3. Pesanan SELESAI (completed, with real volume and payment)
  await prisma.pesanan.create({
    data: {
      id_user: user.id_user,
      id_driver: driver.id_user,
      vol_estimasi: 4.0,
      vol_real: 4.2,
      foto_sampah_base64: sampleImage,
      bukti_timbang_base64: sampleImage,
      harga_per_liter_saat_itu: 5000,
      total_bayar: 21000, // 4.2 * 5000
      status_order: "SELESAI",
    },
  });
  console.log("✅ Sample pesanan SELESAI created");

  // Update user's wallet with payment from completed order
  await prisma.dompet.update({
    where: { id_user: user.id_user },
    data: { saldo_terkini: 21000 },
  });
  console.log("✅ User wallet updated with Rp 21.000");

  // 4. Pesanan BATAL (cancelled)
  await prisma.pesanan.create({
    data: {
      id_user: user.id_user,
      vol_estimasi: 2.0,
      foto_sampah_base64: sampleImage,
      status_order: "BATAL",
    },
  });
  console.log("✅ Sample pesanan BATAL created");

  console.log("\n🎉 Seeding complete!");
  console.log("\n📝 Test accounts:");
  console.log("   Admin:    admin@ecooil.id / admin123");
  console.log("   User:     user@ecooil.id / user123");
  console.log("   Driver:   driver@ecooil.id / driver123");
  console.log("   Industry: pabrik@ecooil.id / industri123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
