import { Show, For } from "solid-js";
import { A } from "@solidjs/router";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { ArrowLeft, Recycle, RefreshCw, Clock, MapPin } from "lucide-solid";
import { formatDate } from "~/lib/utils";
import { usePesanan, type Pesanan } from "~/hooks/usePesanan";

export default function RiwayatPesanan() {
  const { data: pesananRes, loading, error, refetch } = usePesanan();
  const pesanan = () => pesananRes()?.data || [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "SELESAI":
        return "success";
      case "DIJEMPUT":
        return "info";
      case "MENUNGGU":
        return "warning";
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
            <h1 class="text-secondary-900 text-2xl font-bold">Riwayat Pesanan</h1>
            <p class="text-secondary-500">Semua transaksi setor jelantah Anda</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading()}>
          <RefreshCw class={`mr-2 h-4 w-4 ${loading() ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Show when={error()}>
        <div class="rounded-lg bg-red-50 p-4 text-red-600">{error()}</div>
      </Show>

      <Show when={loading()}>
        <Card class="text-secondary-400 flex min-h-[300px] items-center justify-center">
          Memuat data...
        </Card>
      </Show>

      <Show when={!loading() && pesanan().length === 0}>
        <Card class="text-secondary-400 flex min-h-[300px] flex-col items-center justify-center border-dashed">
          <Recycle class="mb-4 h-12 w-12" />
          <p>Belum ada riwayat pesanan</p>
          <A href="/dashboard/user/setor" class="text-primary-600 mt-4 text-sm hover:underline">
            Setor jelantah pertama Anda &rarr;
          </A>
        </Card>
      </Show>

      <Show when={!loading() && pesanan().length > 0}>
        <div class="space-y-4">
          <For each={pesanan()}>
            {(p: Pesanan) => (
              <Card class="p-4">
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-4">
                    <div class="bg-primary-100 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                      <Recycle class="text-primary-600 h-6 w-6" />
                    </div>
                    <div class="space-y-1">
                      <div class="flex items-center space-x-2">
                        <p class="text-secondary-900 font-semibold">
                          Setor Jelantah #{p.id_pesanan}
                        </p>
                        <Badge variant={getStatusVariant(p.status_order)}>{p.status_order}</Badge>
                      </div>
                      <div class="text-secondary-500 flex items-center text-sm">
                        <Clock class="mr-1 h-3.5 w-3.5" />
                        {formatDate(p.tanggal_pesan)}
                      </div>
                      <Show when={p.driver_penjemput}>
                        <div class="text-secondary-500 flex items-start text-sm">
                          <MapPin class="mt-0.5 mr-1 h-3.5 w-3.5" />
                          <span class="line-clamp-1">Driver: {p.driver_penjemput?.nama_lengkap}</span>
                        </div>
                      </Show>
                    </div>
                  </div>

                  <div class="text-right">
                    <p class="text-secondary-900 text-lg font-bold">
                      {p.vol_real ? `${p.vol_real} L` : `${p.vol_estimasi} L`}
                    </p>
                    <p class="text-secondary-400 text-xs">
                      {p.vol_real ? "Volume Aktual" : "Estimasi"}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
