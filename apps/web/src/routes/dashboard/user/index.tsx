import { Show, For } from "solid-js";
import { A } from "@solidjs/router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Plus, Wallet, Recycle } from "lucide-solid";
import { formatRupiah, formatDate } from "~/lib/utils";
import { authStore } from "~/lib/auth";
import { useDompet } from "~/hooks/useDompet";
import { usePesanan, type Pesanan } from "~/hooks/usePesanan";

export default function UserDashboard() {
  const user = () => authStore.user();

  // Menggunakan hooks - tidak ada hardcoded URL!
  const { data: dompet, loading: dompetLoading } = useDompet();
  const { data: pesananRes, loading: pesananLoading } = usePesanan();

  const loading = () => dompetLoading() || pesananLoading();
  const pesanan = () => pesananRes()?.data || [];

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-secondary-900 text-2xl font-bold">
          Halo, {user()?.nama_lengkap || "User"}!
        </h1>
        <A
          href="/dashboard/user/setor"
          class="bg-primary-600 hover:bg-primary-700 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 font-medium text-white shadow-sm transition-colors"
        >
          <Plus class="mr-2 h-4 w-4" />
          Setor Jelantah
        </A>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <Card class="bg-primary-50 border-primary-100">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-primary-700 text-sm font-medium">Saldo Dompet</CardTitle>
            <Wallet class="text-primary-600 h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div class="text-primary-800 text-3xl font-bold">
              <Show when={!loading()} fallback="...">
                {formatRupiah(dompet()?.saldo_terkini || 0)}
              </Show>
            </div>
            <A
              href="/dashboard/user/tarik"
              class="text-primary-700 hover:text-primary-800 mt-2 inline-block text-sm hover:underline"
            >
              Tarik Tunai &rarr;
            </A>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-secondary-500 text-sm font-medium">Total Setoran</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-secondary-900 text-3xl font-bold">
              <Show when={!loading()} fallback="...">
                {pesanan()
                  .filter((p: Pesanan) => p.status_order === "SELESAI")
                  .reduce((acc: number, p: Pesanan) => acc + Number(p.vol_real || 0), 0)
                  .toFixed(1)}{" "}
                L
              </Show>
            </div>
            <p class="text-secondary-500 text-xs">Sejak bergabung</p>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-4">
        <h2 class="text-secondary-900 text-lg font-semibold">Riwayat Terakhir</h2>

        <Show when={loading()}>
          <Card class="text-secondary-400 flex min-h-[200px] items-center justify-center">
            Memuat data...
          </Card>
        </Show>

        <Show when={!loading() && pesanan().length === 0}>
          <Card class="text-secondary-400 flex min-h-[200px] items-center justify-center border-dashed">
            Belum ada riwayat transaksi
          </Card>
        </Show>

        <Show when={!loading() && pesanan().length > 0}>
          <div class="grid gap-4">
            <For each={pesanan().slice(0, 5)}>
              {(p) => (
                <Card class="flex items-center justify-between p-4">
                  <div class="flex items-center space-x-4">
                    <div class="bg-secondary-100 flex h-10 w-10 items-center justify-center rounded-full">
                      <Recycle class="text-secondary-600 h-5 w-5" />
                    </div>
                    <div>
                      <p class="text-secondary-900 font-medium">Setor Jelantah</p>
                      <p class="text-secondary-500 text-xs">{formatDate(p.tanggal_pesan)}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-secondary-900 font-bold">
                      {p.vol_real ? `${p.vol_real} L` : `${p.vol_estimasi} L (Est)`}
                    </p>
                    <Badge
                      variant={
                        p.status_order === "SELESAI"
                          ? "success"
                          : p.status_order === "DIJEMPUT"
                            ? "info"
                            : "secondary"
                      }
                      class="mt-1"
                    >
                      {p.status_order}
                    </Badge>
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
