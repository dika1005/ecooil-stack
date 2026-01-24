import { Show, For } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardHeader, CardFooter } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { MapPin, Recycle, Clock, RefreshCw } from "lucide-solid";
import { formatDate } from "~/lib/utils";
import { useDriverJobs, useClaimJob } from "~/hooks/useDriverJobs";

export default function JobRadar() {
  // Menggunakan hooks - tidak ada hardcoded URL!
  const { data: jobsRes, loading, error, refetch } = useDriverJobs();
  const { mutate: claimJob, loading: claimingLoading } = useClaimJob();

  const jobs = () => jobsRes()?.data || [];

  const handleClaim = async (id: number) => {
    try {
      await claimJob(id);
      refetch();
    } catch {
      alert("Gagal mengambil pesanan. Mungkin sudah diambil driver lain.");
    }
  };

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-secondary-900 text-2xl font-bold">Job Radar</h1>
          <p class="text-secondary-500">Temukan pesanan minyak jelantah di sekitar Anda.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} size="sm" disabled={loading()}>
          <RefreshCw class={`mr-2 h-4 w-4 ${loading() ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Show when={error()}>
        <div class="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error()}</div>
      </Show>

      <Show when={loading()}>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div class="text-secondary-500 border-secondary-200 col-span-full rounded-lg border bg-white py-12 text-center">
            <p>Memuat data...</p>
          </div>
        </div>
      </Show>

      <Show when={!loading() && jobs().length === 0 && !error()}>
        <div class="text-secondary-500 border-secondary-200 rounded-lg border border-dashed bg-white py-12 text-center">
          <p>Belum ada pesanan masuk saat ini.</p>
        </div>
      </Show>

      <Show when={!loading() && jobs().length > 0}>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <For each={jobs()}>
            {(job) => (
              <Card class="hover:border-primary-200 transition-colors">
                <CardHeader class="flex flex-row items-start justify-between pb-2">
                  <Badge variant="info">Perlu Jemput</Badge>
                  <span class="text-secondary-400 flex items-center text-xs">
                    <Clock class="mr-1 h-3 w-3" />
                    {formatDate(job.tanggal_pesan)}
                  </span>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div>
                    <h3 class="text-lg font-medium">{job.user_penjual?.nama_lengkap || "User"}</h3>
                    <p class="text-secondary-500 text-sm">{job.user_penjual?.no_hp || "-"}</p>
                    <div class="text-secondary-600 mt-2 flex items-start">
                      <MapPin class="mt-0.5 mr-2 h-4 w-4 shrink-0" />
                      <p class="line-clamp-2 text-sm">{job.user_penjual?.alamat_lengkap || "-"}</p>
                    </div>
                  </div>
                  <div class="text-secondary-500 text-sm">
                    Estimasi: <span class="text-secondary-900 font-bold">{job.vol_estimasi} L</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    class="w-full"
                    onClick={() => handleClaim(job.id_pesanan)}
                    isLoading={claimingLoading()}
                  >
                    <Recycle class="mr-2 h-4 w-4" />
                    Ambil Pesanan
                  </Button>
                </CardFooter>
              </Card>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
