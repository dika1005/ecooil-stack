import { createSignal, For, Show, onMount } from "solid-js";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/Card";
import { formatRupiah, formatDate } from "~/lib/utils";

interface Harga {
  id_harga: number;
  tanggal: string;
  harga_beli_per_liter: number | string;
  harga_jual_industri: number | string;
}

interface PaginatedResponse {
  success: boolean;
  message: string;
  data: Harga[];
  meta: { total: number; page: number; limit: number };
}

export default function AdminHarga() {
  const [history, setHistory] = createSignal<Harga[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [submitting, setSubmitting] = createSignal(false);
  const [error, setError] = createSignal("");

  // Form
  const [hargaBeli, setHargaBeli] = createSignal<number | "">("");
  const [hargaJual, setHargaJual] = createSignal<number | "">("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await api.getFullResponse<PaginatedResponse>("/api/admin/harga");
      console.log("Harga response:", result);
      setHistory(result.data || []);
    } catch (e) {
      console.error("Error fetching harga:", e);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch on client-side mount
  onMount(() => {
    fetchHistory();
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/admin/harga", {
        harga_beli_per_liter: Number(hargaBeli()),
        harga_jual_industri: Number(hargaJual()),
      });
      setHargaBeli("");
      setHargaJual("");
      fetchHistory(); // Refetch data
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div class="space-y-6">
      <h1 class="text-secondary-900 text-2xl font-bold">Atur Harga Minyak</h1>

      <div class="grid gap-6 md:grid-cols-2">
        {/* Form Update Harga */}
        <Card>
          <CardHeader>
            <CardTitle>Update Harga Baru</CardTitle>
            <CardDescription>Harga ini akan berlaku mulai detik ini juga</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Harga Beli (dari User)</label>
                <Input
                  type="number"
                  min="1"
                  value={hargaBeli()}
                  onInput={(e) => setHargaBeli(Number(e.currentTarget.value))}
                  placeholder="Rp 6.500"
                  required
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Harga Jual (ke Industri)</label>
                <Input
                  type="number"
                  min="1"
                  value={hargaJual()}
                  onInput={(e) => setHargaJual(Number(e.currentTarget.value))}
                  placeholder="Rp 8.000"
                  required
                />
              </div>
              <Button type="submit" class="w-full" disabled={submitting()}>
                {submitting() ? "Menyimpan..." : "Update Harga"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Riwayat Harga */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Perubahan</CardTitle>
          </CardHeader>
          <CardContent>
            <Show when={error()}>
              <div class="py-4 text-center text-red-500">{error()}</div>
            </Show>
            <div class="max-h-[300px] overflow-y-auto">
              <table class="w-full text-sm">
                <thead class="text-secondary-500 bg-secondary-50 sticky top-0 text-xs uppercase">
                  <tr>
                    <th class="px-3 py-2 text-left">Tanggal</th>
                    <th class="px-3 py-2 text-right">Beli</th>
                    <th class="px-3 py-2 text-right">Jual</th>
                  </tr>
                </thead>
                <tbody>
                  <Show when={loading()}>
                    <tr>
                      <td colspan="3" class="py-4 text-center">
                        Memuat data...
                      </td>
                    </tr>
                  </Show>
                  <Show when={!loading() && history().length === 0 && !error()}>
                    <tr>
                      <td colspan="3" class="text-secondary-500 py-4 text-center">
                        Belum ada data harga.
                      </td>
                    </tr>
                  </Show>
                  <Show when={!loading() && history().length > 0}>
                    <For each={history()}>
                      {(item) => (
                        <tr class="border-b">
                          <td class="px-3 py-2">{formatDate(item.tanggal)}</td>
                          <td class="px-3 py-2 text-right font-medium text-emerald-600">
                            {formatRupiah(Number(item.harga_beli_per_liter))}
                          </td>
                          <td class="px-3 py-2 text-right font-medium text-blue-600">
                            {formatRupiah(Number(item.harga_jual_industri))}
                          </td>
                        </tr>
                      )}
                    </For>
                  </Show>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
