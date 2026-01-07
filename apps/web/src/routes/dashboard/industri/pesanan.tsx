import { createSignal, Show, For, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { ArrowLeft, Package, RefreshCw, Clock, Factory } from "lucide-solid";
import { formatDate } from "~/lib/utils";
import { api } from "~/lib/api";

interface PesananIndustri {
  id: number;
  volume: number;
  status: string;
  tanggal: string;
}

interface PesananResponse {
  success: boolean;
  data: PesananIndustri[];
  meta: { total: number };
}

export default function PesananIndustriPage() {
  const [pesanan, setPesanan] = createSignal<PesananIndustri[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getFullResponse<PesananResponse>("/api/industri/pesanan");
      setPesanan(res.data || []);
    } catch (e) {
      console.error("Error:", e);
      // Set empty if endpoint doesn't exist yet
      setPesanan([]);
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
      case "DIPROSES":
        return "warning";
      default:
        return "secondary";
    }
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
            <h1 class="text-secondary-900 text-2xl font-bold">Pesanan Bulk</h1>
            <p class="text-secondary-500">Riwayat pesanan minyak jelantah Anda</p>
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

      <Show when={loading()}>
        <Card class="text-secondary-400 flex min-h-[300px] items-center justify-center">
          Memuat data...
        </Card>
      </Show>

      <Show when={!loading() && pesanan().length === 0}>
        <Card class="text-secondary-400 flex min-h-[300px] flex-col items-center justify-center border-dashed">
          <Package class="mb-4 h-12 w-12" />
          <p>Belum ada pesanan bulk</p>
          <p class="mt-2 text-sm">Fitur pemesanan bulk akan segera hadir</p>
        </Card>
      </Show>

      <Show when={!loading() && pesanan().length > 0}>
        <div class="grid gap-4 md:grid-cols-2">
          <For each={pesanan()}>
            {(p) => (
              <Card>
                <CardHeader class="flex flex-row items-start justify-between pb-2">
                  <Badge variant={getStatusVariant(p.status)}>{p.status}</Badge>
                  <span class="text-secondary-400 flex items-center text-xs">
                    <Clock class="mr-1 h-3 w-3" />
                    {formatDate(p.tanggal)}
                  </span>
                </CardHeader>
                <CardContent class="space-y-3">
                  <div class="flex items-center space-x-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                      <Factory class="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p class="font-semibold">Pesanan #{p.id}</p>
                      <p class="text-secondary-900 text-2xl font-bold">{p.volume} L</p>
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
