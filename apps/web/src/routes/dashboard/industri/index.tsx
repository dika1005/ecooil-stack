import { Show } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Factory, Truck, RefreshCw } from "lucide-solid";
import { Button } from "~/components/ui/Button";
import { useIndustriStok } from "~/hooks/useIndustriStok";

export default function IndustriDashboard() {
  // Menggunakan hooks - tidak ada hardcoded URL!
  const { data: stock, loading, error, refetch } = useIndustriStok();

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-secondary-900 text-2xl font-bold">Dashboard Industri</h1>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading()}>
          <RefreshCw class={`mr-2 h-4 w-4 ${loading() ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Show when={error()}>
        <div class="rounded-lg bg-red-50 p-4 text-red-600">{error()}</div>
      </Show>

      <div class="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-secondary-500 text-sm font-medium">
              Stok Tersedia (Global)
            </CardTitle>
            <Factory class="text-secondary-500 h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div class="text-secondary-900 text-3xl font-bold">
              <Show when={!loading()} fallback="...">
                {stock()?.total_stok || 0} L
              </Show>
            </div>
            <p class="text-secondary-500 text-xs">Siap diangkut</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-secondary-500 text-sm font-medium">Pesanan Aktif</CardTitle>
            <Truck class="text-secondary-500 h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div class="text-secondary-900 text-3xl font-bold">
              <Show when={!loading()} fallback="...">
                {stock()?.pending_orders || 0}
              </Show>
            </div>
            <p class="text-secondary-500 text-xs">Dalam pengiriman</p>
          </CardContent>
        </Card>
      </div>

      <Card class="text-secondary-500 border-dashed p-8 text-center">
        <div class="space-y-4">
          <Factory class="text-secondary-300 mx-auto h-12 w-12" />
          <div>
            <h3 class="text-secondary-700 font-medium">Fitur Pemesanan Bulk</h3>
            <p class="text-sm">
              Fitur pemesanan bulk akan segera hadir. Silakan hubungi admin untuk pemesanan manual.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
