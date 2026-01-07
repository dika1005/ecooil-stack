import { createSignal, Show, For, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { Card, CardContent } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { ArrowLeft, Factory, RefreshCw, Package, Truck, Calendar, TrendingUp } from "lucide-solid";
import { formatDate } from "~/lib/utils";
import { api } from "~/lib/api";
import { ENDPOINTS } from "~/lib/endpoints";

interface StokData {
  total_stok: number;
  pending_orders: number;
  stok_history?: StokHistoryItem[];
}

interface StokHistoryItem {
  id: number;
  tanggal: string;
  volume: number;
  tipe: "masuk" | "keluar";
  keterangan: string;
}

interface PesananIndustri {
  id_pesanan: number;
  volume: number;
  status: string;
  tgl_dibuat: string;
  tgl_selesai?: string;
}

interface StokResponse {
  success: boolean;
  data: StokData;
}

interface PesananResponse {
  success: boolean;
  data: PesananIndustri[];
}

export default function StokIndustri() {
  const [stok, setStok] = createSignal<StokData>({ total_stok: 0, pending_orders: 0 });
  const [pesanan, setPesanan] = createSignal<PesananIndustri[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [stokRes, pesananRes] = await Promise.all([
        api.getFullResponse<StokResponse>(ENDPOINTS.INDUSTRI.STOK),
        api.getFullResponse<PesananResponse>(ENDPOINTS.INDUSTRI.BULK).catch(() => ({ data: [] })),
      ]);

      setStok(stokRes.data || { total_stok: 0, pending_orders: 0 });
      setPesanan((pesananRes as PesananResponse).data || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchData();
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "SELESAI":
        return "success";
      case "DIKIRIM":
        return "info";
      case "MENUNGGU":
        return "warning";
      case "BATAL":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const totalVolumePesanan = () => {
    return pesanan()
      .filter((p) => p.status === "SELESAI")
      .reduce((acc, p) => acc + p.volume, 0);
  };

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <A
            href="/dashboard/industri"
            class="hover:bg-secondary-100 rounded-lg p-2 transition-colors"
          >
            <ArrowLeft class="text-secondary-600 h-5 w-5" />
          </A>
          <div>
            <h1 class="text-secondary-900 text-2xl font-bold">Stok Minyak Jelantah</h1>
            <p class="text-secondary-500">Pantau ketersediaan stok minyak jelantah</p>
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

      {/* Stats Cards */}
      <div class="grid gap-4 md:grid-cols-3">
        <Card class="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent class="p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-100">Stok Tersedia</p>
                <p class="mt-1 text-3xl font-bold">
                  <Show when={!loading()} fallback="...">
                    {stok()?.total_stok || 0} L
                  </Show>
                </p>
              </div>
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <Package class="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent class="p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-100">Pesanan Aktif</p>
                <p class="mt-1 text-3xl font-bold">
                  <Show when={!loading()} fallback="...">
                    {stok()?.pending_orders || 0}
                  </Show>
                </p>
              </div>
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <Truck class="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent class="p-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-purple-100">Total Diterima</p>
                <p class="mt-1 text-3xl font-bold">
                  <Show when={!loading()} fallback="...">
                    {totalVolumePesanan()} L
                  </Show>
                </p>
              </div>
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <TrendingUp class="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Riwayat Pesanan */}
      <div class="space-y-4">
        <h2 class="text-secondary-900 text-lg font-semibold">Riwayat Pesanan</h2>

        <Show when={loading()}>
          <Card class="text-secondary-400 flex min-h-[200px] items-center justify-center">
            Memuat data...
          </Card>
        </Show>

        <Show when={!loading() && pesanan().length === 0}>
          <Card class="text-secondary-400 flex min-h-[200px] flex-col items-center justify-center border-dashed">
            <Factory class="mb-4 h-12 w-12" />
            <p>Belum ada riwayat pesanan</p>
            <p class="mt-2 text-sm">Hubungi admin untuk pemesanan bulk</p>
          </Card>
        </Show>

        <Show when={!loading() && pesanan().length > 0}>
          <div class="space-y-3">
            <For each={pesanan()}>
              {(p) => (
                <Card class="p-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <div class="bg-secondary-100 flex h-12 w-12 items-center justify-center rounded-full">
                        <Truck class="text-secondary-600 h-6 w-6" />
                      </div>
                      <div class="space-y-1">
                        <div class="flex items-center space-x-2">
                          <p class="text-secondary-900 font-semibold">Pesanan #{p.id_pesanan}</p>
                          <Badge variant={getStatusVariant(p.status)}>{p.status}</Badge>
                        </div>
                        <div class="text-secondary-500 flex items-center text-sm">
                          <Calendar class="mr-1 h-3.5 w-3.5" />
                          {formatDate(p.tgl_dibuat)}
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-secondary-900 text-2xl font-bold">{p.volume} L</p>
                    </div>
                  </div>
                </Card>
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* Info Box */}
      <Card class="border-blue-100 bg-blue-50">
        <CardContent class="p-4">
          <div class="flex items-start space-x-3">
            <Factory class="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <h3 class="font-medium text-blue-900">Ingin memesan dalam jumlah besar?</h3>
              <p class="mt-1 text-sm text-blue-700">
                Hubungi admin kami untuk pemesanan bulk dengan harga khusus industri.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
