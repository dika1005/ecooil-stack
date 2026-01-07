import { createSignal, Show, For, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { ArrowLeft, Wallet, RefreshCw, Clock, CreditCard } from "lucide-solid";
import { formatRupiah, formatDate } from "~/lib/utils";
import { api } from "~/lib/api";
import { ENDPOINTS } from "~/lib/endpoints";

interface Penarikan {
  id_penarikan: number;
  nominal: number;
  bank_tujuan: string;
  nomor_rekening: string;
  status_transfer: string;
  tgl_request: string;
}

interface PenarikanResponse {
  success: boolean;
  data: Penarikan[];
  meta: { total: number };
}

export default function RiwayatPenarikan() {
  const [penarikan, setPenarikan] = createSignal<Penarikan[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getFullResponse<PenarikanResponse>(ENDPOINTS.USER.PENARIKAN);
      setPenarikan(res.data || []);
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
            <h1 class="text-secondary-900 text-2xl font-bold">Riwayat Penarikan</h1>
            <p class="text-secondary-500">Semua transaksi penarikan tunai Anda</p>
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

      <Show when={!loading() && penarikan().length === 0}>
        <Card class="text-secondary-400 flex min-h-[300px] flex-col items-center justify-center border-dashed">
          <Wallet class="mb-4 h-12 w-12" />
          <p>Belum ada riwayat penarikan</p>
          <A href="/dashboard/user/tarik" class="text-primary-600 mt-4 text-sm hover:underline">
            Ajukan penarikan pertama &rarr;
          </A>
        </Card>
      </Show>

      <Show when={!loading() && penarikan().length > 0}>
        <div class="space-y-4">
          <For each={penarikan()}>
            {(p) => (
              <Card class="p-4">
                <div class="flex items-start justify-between">
                  <div class="flex items-start space-x-4">
                    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <CreditCard class="h-6 w-6 text-green-600" />
                    </div>
                    <div class="space-y-1">
                      <div class="flex items-center space-x-2">
                        <p class="text-secondary-900 font-semibold">Penarikan #{p.id_penarikan}</p>
                        <Badge variant={getStatusVariant(p.status_transfer)}>{p.status_transfer}</Badge>
                      </div>
                      <div class="text-secondary-500 flex items-center text-sm">
                        <Clock class="mr-1 h-3.5 w-3.5" />
                        {formatDate(p.tgl_request)}
                      </div>
                      <p class="text-secondary-500 text-sm">
                        {p.bank_tujuan} - {p.nomor_rekening}
                      </p>
                    </div>
                  </div>

                  <div class="text-right">
                    <p class="text-lg font-bold text-green-600">{formatRupiah(p.nominal)}</p>
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
