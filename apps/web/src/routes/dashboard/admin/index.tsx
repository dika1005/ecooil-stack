import { createSignal, Show, onMount } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Users, DollarSign, Wallet, TrendingUp } from "lucide-solid";
import { api } from "~/lib/api";
import { formatRupiah } from "~/lib/utils";

interface Stats {
  total_liter_terkumpul: number;
  total_pesanan_selesai: number;
  total_user: number;
}

interface Price {
  harga_beli_per_liter: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = createSignal<Stats | null>(null);
  const [price, setPrice] = createSignal<Price | null>(null);
  const [pendingWithdrawals, setPendingWithdrawals] = createSignal<number>(0);
  const [loading, setLoading] = createSignal(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, priceRes] = await Promise.all([
        api.get<Stats>("/api/public/stats"),
        api.get<Price>("/api/public/harga"),
      ]);
      setStats(statsRes);
      setPrice(priceRes);

      // Fetch pending withdrawals (requires auth)
      try {
        const pendingRes = await api.get<{ data: any[]; meta: { total: number } }>(
          "/api/admin/penarikan/pending"
        );
        setPendingWithdrawals(pendingRes.meta?.total || 0);
      } catch {
        setPendingWithdrawals(0);
      }
    } catch (e) {
      console.error("Failed to fetch dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch on client-side mount
  onMount(() => {
    fetchData();
  });

  return (
    <div class="space-y-6">
      <h1 class="text-secondary-900 text-2xl font-bold">Admin Overview</h1>

      <div class="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-secondary-500 text-sm font-medium">Total User</CardTitle>
            <Users class="text-secondary-500 h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <Show when={!loading()} fallback="...">
                {stats()?.total_user || 0}
              </Show>
            </div>
            <p class="text-secondary-500 text-xs">Mitra terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-secondary-500 text-sm font-medium">Harga Beli</CardTitle>
            <DollarSign class="text-secondary-500 h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <Show when={!loading()} fallback="...">
                {formatRupiah(price()?.harga_beli_per_liter || 0)}
              </Show>
            </div>
            <p class="text-secondary-500 text-xs">Per liter hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-secondary-500 text-sm font-medium">Pending Penarikan</CardTitle>
            <Wallet class="text-secondary-500 h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <Show when={!loading()} fallback="...">
                {pendingWithdrawals()}
              </Show>
            </div>
            <p class="text-xs text-amber-500">Perlu persetujuan</p>
          </CardContent>
        </Card>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statistik Pengumpulan</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center space-x-2 text-emerald-600">
              <TrendingUp class="h-5 w-5" />
              <span class="text-2xl font-bold">
                <Show when={!loading()} fallback="...">
                  {stats()?.total_liter_terkumpul || 0} L
                </Show>
              </span>
            </div>
            <p class="text-secondary-500 mt-2 text-sm">
              Total volume minyak jelantah terkumpul dari seluruh mitra.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
