import { createSignal, Show, For, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { Card, CardContent, CardHeader, CardFooter } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { ArrowLeft, Truck, RefreshCw, Clock, MapPin, CheckCircle, Camera, X } from "lucide-solid";
import { formatDate } from "~/lib/utils";
import { api } from "~/lib/api";
import { ENDPOINTS } from "~/lib/endpoints";

interface Tugas {
  id_pesanan: number;
  tanggal_pesan: string;
  vol_estimasi: number;
  vol_real: number | null;
  status_order: string;
  user_penjual?: {
    nama_lengkap: string;
    no_hp: string;
    alamat_lengkap: string | null;
  };
}

interface TugasResponse {
  success: boolean;
  data: Tugas[];
  meta: { total: number };
}

export default function TugasSaya() {
  const [tugas, setTugas] = createSignal<Tugas[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");
  const [completingId, setCompletingId] = createSignal<number | null>(null);
  
  // Modal state
  const [showModal, setShowModal] = createSignal(false);
  const [selectedTask, setSelectedTask] = createSignal<Tugas | null>(null);
  const [volReal, setVolReal] = createSignal("");
  const [photoBase64, setPhotoBase64] = createSignal("");
  const [photoPreview, setPhotoPreview] = createSignal("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getFullResponse<TugasResponse>(ENDPOINTS.DRIVER.TUGAS);
      setTugas(res.data || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchData();
  });

  const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPhotoBase64(base64);
      setPhotoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const openCompleteModal = (task: Tugas) => {
    setSelectedTask(task);
    setVolReal(String(task.vol_estimasi));
    setPhotoBase64("");
    setPhotoPreview("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
    setVolReal("");
    setPhotoBase64("");
    setPhotoPreview("");
  };

  const handleComplete = async () => {
    const task = selectedTask();
    if (!task) return;

    // Validation
    if (!volReal() || Number(volReal()) <= 0) {
      alert("Volume harus lebih dari 0!");
      return;
    }

    if (!photoBase64()) {
      alert("Foto bukti timbang wajib diupload!");
      return;
    }

    setCompletingId(task.id_pesanan);
    try {
      await api.put(ENDPOINTS.DRIVER.COMPLETE(task.id_pesanan), {
        vol_real: Number(volReal()),
        bukti_timbang_base64: photoBase64(),
      });
      closeModal();
      fetchData();
      alert("Pesanan berhasil diselesaikan!");
    } catch (e) {
      alert("Gagal menyelesaikan pesanan: " + (e as Error).message);
    } finally {
      setCompletingId(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "SELESAI":
        return "success";
      case "DIJEMPUT":
        return "info";
      default:
        return "secondary";
    }
  };

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
            <h1 class="text-secondary-900 text-2xl font-bold">Tugas Saya</h1>
            <p class="text-secondary-500">Pesanan yang sudah Anda ambil</p>
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

      <Show when={!loading() && tugas().length === 0}>
        <Card class="text-secondary-400 flex min-h-[300px] flex-col items-center justify-center border-dashed">
          <Truck class="mb-4 h-12 w-12" />
          <p>Belum ada tugas yang diambil</p>
          <A href="/dashboard/driver" class="text-primary-600 mt-4 text-sm hover:underline">
            Lihat Job Radar &rarr;
          </A>
        </Card>
      </Show>

      <Show when={!loading() && tugas().length > 0}>
        <div class="grid gap-4 md:grid-cols-2">
          <For each={tugas()}>
            {(t) => (
              <Card>
                <CardHeader class="flex flex-row items-start justify-between pb-2">
                  <Badge variant={getStatusVariant(t.status_order)}>{t.status_order}</Badge>
                  <span class="text-secondary-400 flex items-center text-xs">
                    <Clock class="mr-1 h-3 w-3" />
                    {formatDate(t.tanggal_pesan)}
                  </span>
                </CardHeader>
                <CardContent class="space-y-3">
                  <div>
                    <h3 class="font-medium">{t.user_penjual?.nama_lengkap || "User"}</h3>
                    <p class="text-secondary-500 text-sm">{t.user_penjual?.no_hp || "-"}</p>
                  </div>
                  <div class="text-secondary-600 flex items-start">
                    <MapPin class="mt-0.5 mr-2 h-4 w-4 shrink-0" />
                    <p class="line-clamp-2 text-sm">{t.user_penjual?.alamat_lengkap || "-"}</p>
                  </div>
                  <div class="text-sm">
                    Volume: <span class="font-bold">{t.vol_real || t.vol_estimasi} L</span>
                    {!t.vol_real && <span class="text-secondary-400 ml-1">(Est)</span>}
                  </div>
                </CardContent>
                <Show when={t.status_order === "DIJEMPUT"}>
                  <CardFooter>
                    <Button
                      class="w-full"
                      onClick={() => openCompleteModal(t)}
                      isLoading={completingId() === t.id_pesanan}
                    >
                      <CheckCircle class="mr-2 h-4 w-4" />
                      Selesaikan
                    </Button>
                  </CardFooter>
                </Show>
              </Card>
            )}
          </For>
        </div>
      </Show>

      {/* Complete Order Modal */}
      <Show when={showModal()}>
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-bold">Selesaikan Pesanan</h2>
              <button
                onClick={closeModal}
                class="text-secondary-400 hover:text-secondary-600 rounded p-1 transition-colors"
              >
                <X class="h-5 w-5" />
              </button>
            </div>

            <div class="space-y-4">
              {/* Volume Input */}
              <div>
                <label class="text-secondary-700 mb-1 block text-sm font-medium">
                  Volume Aktual (Liter) <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={volReal()}
                  onInput={(e) => setVolReal(e.currentTarget.value)}
                  placeholder="Masukkan volume hasil timbang"
                  class="border-secondary-300 focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border px-3 py-2"
                />
                <p class="text-secondary-500 mt-1 text-xs">
                  Estimasi: {selectedTask()?.vol_estimasi} L
                </p>
              </div>

              {/* Photo Upload */}
              <div>
                <label class="text-secondary-700 mb-1 block text-sm font-medium">
                  Foto Bukti Timbang <span class="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  class="border-secondary-300 w-full rounded-lg border px-3 py-2 text-sm"
                />
                <p class="text-secondary-500 mt-1 text-xs">
                  Format: JPG, PNG. Maks 5MB
                </p>
              </div>

              {/* Photo Preview */}
              <Show when={photoPreview()}>
                <div class="border-secondary-200 overflow-hidden rounded-lg border">
                  <img
                    src={photoPreview()}
                    alt="Preview"
                    class="h-48 w-full object-cover"
                  />
                </div>
              </Show>

              {/* Buttons */}
              <div class="flex space-x-3 pt-2">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  class="flex-1"
                  disabled={completingId() !== null}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleComplete}
                  class="flex-1"
                  isLoading={completingId() !== null}
                >
                  <Camera class="mr-2 h-4 w-4" />
                  Selesaikan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
