import { createSignal, Show, For, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import {
  ArrowLeft,
  History,
  RefreshCw,
  Clock,
  MapPin,
  Recycle,
  CheckCircle,
  User,
} from "lucide-solid";
import { formatDate } from "~/lib/utils";
import { api } from "~/lib/api";
import { ENDPOINTS } from "~/lib/endpoints";

interface Riwayat {
  id_pesanan: number;
  alamat_jemput: string;
  tanggal_pesan: string;
  tgl_selesai?: string;
  vol_estimasi: number;
  vol_real: number | null;
  status_order: string;
  user?: {
    nama_lengkap: string;
    no_hp: string;
  };
}

interface RiwayatResponse {
  success: boolean;
  data: Riwayat[];
  meta: { total: number };
}

export default function DriverHistory() {
  const [riwayat, setRiwayat] = createSignal<Riwayat[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      // Mengambil semua riwayat pesanan driver (termasuk yang sudah selesai)
      const res = await api.getFullResponse<RiwayatResponse>(ENDPOINTS.DRIVER.ORDERS);
      setRiwayat(res.data || []);
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
      case "DIJEMPUT":
        return "info";
      case "BATAL":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const completedTasks = () => riwayat().filter((r) => r.status_order === "SELESAI");
  const totalVolume = () => completedTasks().reduce((acc, r) => acc + (r.vol_real || 0), 0);

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <A
            href="/dashboard/driver"
            class="hover:bg-secondary-100 rounded-lg p-2 transition-colors"
          >
            <ArrowLeft class="text-secondary-600 h-5 w-5" />
          </A>
          <div>
            <h1 class="text-secondary-900 text-2xl font-bold">Riwayat Pengantaran</h1>
            <p class="text-secondary-500">Semua tugas penjemputan minyak jelantah</p>
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

      {/* Stats */}
      <div class="grid gap-4 md:grid-cols-3">
        <Card class="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-100">Total Selesai</p>
                <p class="mt-1 text-2xl font-bold">
                  <Show when={!loading()} fallback="...">
                    {completedTasks().length}
                  </Show>
                </p>
              </div>
              <CheckCircle class="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card class="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-100">Total Volume</p>
                <p class="mt-1 text-2xl font-bold">
                  <Show when={!loading()} fallback="...">
                    {totalVolume()} L
                  </Show>
                </p>
              </div>
              <Recycle class="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card class="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-purple-100">Total Tugas</p>
                <p class="mt-1 text-2xl font-bold">
                  <Show when={!loading()} fallback="...">
                    {riwayat().length}
                  </Show>
                </p>
              </div>
              <History class="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Riwayat List */}
      <Show when={loading()}>
        <Card class="text-secondary-400 flex min-h-[300px] items-center justify-center">
          Memuat data...
        </Card>
      </Show>

      <Show when={!loading() && riwayat().length === 0}>
        <Card class="text-secondary-400 flex min-h-[300px] flex-col items-center justify-center border-dashed">
          <History class="mb-4 h-12 w-12" />
          <p>Belum ada riwayat pengantaran</p>
          <A href="/dashboard/driver" class="text-primary-600 mt-4 text-sm hover:underline">
            Lihat Job Radar &rarr;
          </A>
        </Card>
      </Show>

      <Show when={!loading() && riwayat().length > 0}>
        <div class="space-y-4">
          <For each={riwayat()}>
            {(r) => (
              <Card class="overflow-hidden">
                <CardHeader class="bg-secondary-50 flex flex-row items-center justify-between px-4 py-3">
                  <div class="flex items-center space-x-3">
                    <Badge variant={getStatusVariant(r.status_order)}>{r.status_order}</Badge>
                    <span class="text-secondary-600 text-sm">#{r.id_pesanan}</span>
                  </div>
                  <span class="text-secondary-400 flex items-center text-xs">
                    <Clock class="mr-1 h-3 w-3" />
                    {formatDate(r.tanggal_pesan)}
                  </span>
                </CardHeader>
                <CardContent class="p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex-1 space-y-3">
                      <div class="flex items-center space-x-3">
                        <div class="bg-secondary-100 flex h-10 w-10 items-center justify-center rounded-full">
                          <User class="text-secondary-600 h-5 w-5" />
                        </div>
                        <div>
                          <h3 class="font-medium">{r.user?.nama_lengkap || "User"}</h3>
                          <p class="text-secondary-500 text-sm">{r.user?.no_hp || "-"}</p>
                        </div>
                      </div>
                      <div class="text-secondary-600 flex items-start">
                        <MapPin class="mt-0.5 mr-2 h-4 w-4 shrink-0" />
                        <p class="text-sm">{r.alamat_jemput || "-"}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-secondary-900 text-2xl font-bold">
                        {r.vol_real || r.vol_estimasi} L
                      </p>
                      {!r.vol_real && <p class="text-secondary-400 text-xs">(Estimasi)</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
