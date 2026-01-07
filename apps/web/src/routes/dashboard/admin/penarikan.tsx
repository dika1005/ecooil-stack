import { createSignal, For, Show, onMount } from "solid-js";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { formatRupiah, formatDate } from "~/lib/utils";
import { Check, X } from "lucide-solid";

interface Penarikan {
  id_penarikan: number;
  id_user: number;
  nominal: number | string;
  bank_tujuan: string;
  nomor_rekening: string;
  nama_rekening: string;
  status_transfer: string;
  tgl_request: string;
  user?: { nama_lengkap: string };
}

interface PaginatedResponse {
  success: boolean;
  message: string;
  data: Penarikan[];
  meta: { total: number; page: number; limit: number };
}

export default function AdminPenarikan() {
  const [withdrawals, setWithdrawals] = createSignal<Penarikan[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await api.getFullResponse<PaginatedResponse>("/api/admin/penarikan");
      console.log("Penarikan response:", result);
      setWithdrawals(result.data || []);
    } catch (e) {
      console.error("Error fetching penarikan:", e);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch on client-side mount
  onMount(() => {
    fetchWithdrawals();
  });

  const handleAction = async (id: number, action: "approve" | "reject") => {
    if (!confirm(`Yakin ingin ${action === "approve" ? "menyetujui" : "menolak"} penarikan ini?`))
      return;

    try {
      await api.put(`/api/admin/penarikan/${id}/${action}`, {});
      fetchWithdrawals(); // Refetch data
    } catch (e) {
      alert((e as Error).message);
    }
  };

  return (
    <div class="space-y-6">
      <h1 class="text-secondary-900 text-2xl font-bold">Persetujuan Penarikan</h1>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Permintaan</CardTitle>
        </CardHeader>
        <CardContent>
          <Show when={error()}>
            <div class="py-4 text-center text-red-500">{error()}</div>
          </Show>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="text-secondary-500 bg-secondary-50 text-xs uppercase">
                <tr>
                  <th class="px-4 py-3">Tanggal</th>
                  <th class="px-4 py-3">User</th>
                  <th class="px-4 py-3">Bank Info</th>
                  <th class="px-4 py-3 text-right">Nominal</th>
                  <th class="px-4 py-3 text-center">Status</th>
                  <th class="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <Show when={loading()}>
                  <tr>
                    <td colspan="6" class="py-4 text-center">
                      Memuat data...
                    </td>
                  </tr>
                </Show>
                <Show when={!loading() && withdrawals().length === 0 && !error()}>
                  <tr>
                    <td colspan="6" class="text-secondary-500 py-8 text-center">
                      Tidak ada data penarikan.
                    </td>
                  </tr>
                </Show>
                <Show when={!loading() && withdrawals().length > 0}>
                  <For each={withdrawals()}>
                    {(item) => (
                      <tr class="hover:bg-secondary-50 border-b">
                        <td class="px-4 py-3">{formatDate(item.tgl_request)}</td>
                        <td class="px-4 py-3 font-medium">{item.user?.nama_lengkap || "-"}</td>
                        <td class="px-4 py-3">
                          <div class="font-medium">{item.bank_tujuan}</div>
                          <div class="text-secondary-500 text-xs">{item.nomor_rekening}</div>
                        </td>
                        <td class="text-secondary-900 px-4 py-3 text-right font-bold">
                          {formatRupiah(Number(item.nominal))}
                        </td>
                        <td class="px-4 py-3 text-center">
                          <Badge
                            variant={
                              item.status_transfer === "SUKSES"
                                ? "success"
                                : item.status_transfer === "GAGAL"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {item.status_transfer}
                          </Badge>
                        </td>
                        <td class="px-4 py-3 text-center">
                          <Show when={item.status_transfer === "PENDING"}>
                            <div class="flex justify-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                class="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                                onClick={() => handleAction(item.id_penarikan, "approve")}
                              >
                                <Check class="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                class="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleAction(item.id_penarikan, "reject")}
                              >
                                <X class="h-4 w-4" />
                              </Button>
                            </div>
                          </Show>
                          <Show when={item.status_transfer !== "PENDING"}>
                            <span class="text-secondary-400 text-xs">-</span>
                          </Show>
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
  );
}
