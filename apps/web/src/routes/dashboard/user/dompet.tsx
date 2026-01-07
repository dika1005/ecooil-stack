import { createSignal, Show, For, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import {
  ArrowLeft,
  Wallet,
  RefreshCw,
  Clock,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Recycle,
} from "lucide-solid";
import { formatRupiah, formatDate } from "~/lib/utils";
import { api } from "~/lib/api";
import { ENDPOINTS } from "~/lib/endpoints";

interface Transaksi {
  id: number;
  tipe: "masuk" | "keluar";
  nominal: number;
  keterangan: string;
  tanggal: string;
}

interface DompetData {
  saldo_terkini: number;
  total_masuk?: number;
  total_keluar?: number;
  transaksi?: Transaksi[];
}

interface PenarikanData {
  id_penarikan: number;
  nominal: number;
  status_transfer: string;
  tgl_request: string;
}

interface PesananData {
  id_pesanan: number;
  vol_real: number | null;
  status_order: string;
  tanggal_pesan: string;
}

export default function DompetPage() {
  const [dompet, setDompet] = createSignal<DompetData>({ saldo_terkini: 0 });
  const [penarikan, setPenarikan] = createSignal<PenarikanData[]>([]);
  const [pesanan, setPesanan] = createSignal<PesananData[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dompetRes, penarikanRes, pesananRes] = await Promise.all([
        api.getFullResponse<{ success: boolean; data: DompetData }>(ENDPOINTS.USER.DOMPET),
        api.getFullResponse<{ success: boolean; data: PenarikanData[] }>(ENDPOINTS.USER.PENARIKAN),
        api.getFullResponse<{ success: boolean; data: PesananData[] }>(ENDPOINTS.USER.PESANAN),
      ]);

      setDompet(dompetRes.data || { saldo_terkini: 0 });
      setPenarikan(penarikanRes.data || []);
      setPesanan(pesananRes.data || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchData();
  });

  // Gabungkan semua transaksi untuk timeline
  const allActivity = () => {
    const activities: Array<{
      id: string;
      tipe: "masuk" | "keluar";
      nominal: number;
      keterangan: string;
      tanggal: string;
      status?: string;
    }> = [];

    // Tambah setoran (pesanan selesai)
    pesanan()
      .filter((p) => p.status_order === "SELESAI" && p.vol_real)
      .forEach((p) => {
        activities.push({
          id: `pesanan-${p.id_pesanan}`,
          tipe: "masuk",
          nominal: p.vol_real! * 5000, // Asumsi harga per liter
          keterangan: `Setoran Jelantah ${p.vol_real} L`,
          tanggal: p.tanggal_pesan,
        });
      });

    // Tambah penarikan
    penarikan().forEach((p) => {
      activities.push({
        id: `penarikan-${p.id_penarikan}`,
        tipe: "keluar",
        nominal: p.nominal,
        keterangan: "Penarikan Tunai",
        tanggal: p.tgl_request,
        status: p.status_transfer,
      });
    });

    // Sort by date (newest first)
    return activities.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  };

  const totalMasuk = () => {
    return pesanan()
      .filter((p) => p.status_order === "SELESAI" && p.vol_real)
      .reduce((acc, p) => acc + p.vol_real! * 5000, 0);
  };

  const totalKeluar = () => {
    return penarikan()
      .filter((p) => p.status_transfer === "SUKSES")
      .reduce((acc, p) => acc + p.nominal, 0);
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case "SELESAI":
        return "success";
      case "DIPROSES":
        return "warning";
      case "DITOLAK":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <A href="/dashboard/user" class="hover:bg-secondary-100 rounded-lg p-2 transition-colors">
            <ArrowLeft class="text-secondary-600 h-5 w-5" />
          </A>
          <div>
            <h1 class="text-secondary-900 text-2xl font-bold">Dompet Saya</h1>
            <p class="text-secondary-500">Riwayat saldo dan transaksi Anda</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchData()} disabled={loading()}>
          <RefreshCw class={`mr-2 h-4 w-4 ${loading() ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Show when={error()}>
        <div class="rounded-lg bg-red-50 p-4 text-red-600">{error()}</div>
      </Show>

      {/* Saldo Card */}
      <Card class="from-primary-500 to-primary-700 overflow-hidden bg-gradient-to-br text-white">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-primary-100 text-sm">Saldo Tersedia</p>
              <p class="mt-1 text-3xl font-bold">
                <Show when={!loading()} fallback="...">
                  {formatRupiah(dompet()?.saldo_terkini || 0)}
                </Show>
              </p>
            </div>
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <Wallet class="h-7 w-7" />
            </div>
          </div>
          <div class="mt-4 flex space-x-4">
            <A
              href="/dashboard/user/tarik"
              class="flex-1 rounded-lg bg-white/20 px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-white/30"
            >
              Tarik Tunai
            </A>
            <A
              href="/dashboard/user/setor"
              class="hover:bg-primary-50 text-primary-700 flex-1 rounded-lg bg-white px-4 py-2.5 text-center text-sm font-medium transition-colors"
            >
              Setor Jelantah
            </A>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-secondary-500 text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp class="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-green-600">
              <Show when={!loading()} fallback="...">
                {formatRupiah(totalMasuk())}
              </Show>
            </div>
            <p class="text-secondary-500 mt-1 text-xs">Dari setoran jelantah</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-secondary-500 text-sm font-medium">Total Penarikan</CardTitle>
            <TrendingDown class="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-red-500">
              <Show when={!loading()} fallback="...">
                {formatRupiah(totalKeluar())}
              </Show>
            </div>
            <p class="text-secondary-500 mt-1 text-xs">Sudah dicairkan</p>
          </CardContent>
        </Card>
      </div>

      {/* Riwayat Aktivitas */}
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-secondary-900 text-lg font-semibold">Riwayat Aktivitas</h2>
          <A href="/dashboard/user/penarikan" class="text-primary-600 text-sm hover:underline">
            Lihat Semua &rarr;
          </A>
        </div>

        <Show when={loading()}>
          <Card class="text-secondary-400 flex min-h-[200px] items-center justify-center">
            Memuat data...
          </Card>
        </Show>

        <Show when={!loading() && allActivity().length === 0}>
          <Card class="text-secondary-400 flex min-h-[200px] flex-col items-center justify-center border-dashed">
            <Wallet class="mb-4 h-12 w-12" />
            <p>Belum ada aktivitas</p>
          </Card>
        </Show>

        <Show when={!loading() && allActivity().length > 0}>
          <div class="space-y-3">
            <For each={allActivity().slice(0, 10)}>
              {(activity) => (
                <Card class="p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4">
                      <div
                        class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          activity.tipe === "masuk" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {activity.tipe === "masuk" ? (
                          <Recycle class="h-5 w-5 text-green-600" />
                        ) : (
                          <CreditCard class="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div class="space-y-1">
                        <div class="flex items-center space-x-2">
                          <p class="text-secondary-900 font-medium">{activity.keterangan}</p>
                          {activity.status && (
                            <Badge variant={getStatusVariant(activity.status)} class="text-xs">
                              {activity.status}
                            </Badge>
                          )}
                        </div>
                        <div class="text-secondary-500 flex items-center text-sm">
                          <Clock class="mr-1 h-3.5 w-3.5" />
                          {formatDate(activity.tanggal)}
                        </div>
                      </div>
                    </div>
                    <p
                      class={`text-lg font-bold ${
                        activity.tipe === "masuk" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {activity.tipe === "masuk" ? "+" : "-"}
                      {formatRupiah(activity.nominal)}
                    </p>
                  </div>
                </Card>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}
