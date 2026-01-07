import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { api } from "~/lib/api";
import { ENDPOINTS } from "~/lib/endpoints";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/Card";
import { Upload } from "lucide-solid";

export default function SetorJelantah() {
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  // Form State
  const [volEstimasi, setVolEstimasi] = createSignal<number | "">("");
  const [alamat, setAlamat] = createSignal("");
  const [fotoBase64, setFotoBase64] = createSignal("");

  const handleFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!volEstimasi() || !alamat() || !fotoBase64()) {
        throw new Error("Mohon lengkapi semua data");
      }

      await api.post(ENDPOINTS.USER.SETOR, {
        vol_estimasi: Number(volEstimasi()),
        alamat_lengkap: alamat(),
        foto_sampah_base64: fotoBase64(),
        // Koordinat optional for now
      });

      navigate("/dashboard/user");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="mx-auto max-w-md py-6">
      <Card>
        <CardHeader>
          <CardTitle>Setor Jelantah</CardTitle>
          <CardDescription>Buat pesanan penjemputan minyak jelantah Anda</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent class="space-y-4">
            {error() && <div class="rounded-md bg-red-50 p-3 text-sm text-red-600">{error()}</div>}

            <div class="space-y-2">
              <label class="text-secondary-700 text-sm font-medium">Estimasi Volume (Liter)</label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.0"
                value={volEstimasi()}
                onInput={(e) => setVolEstimasi(Number(e.currentTarget.value))}
                required
              />
            </div>

            <div class="space-y-2">
              <label class="text-secondary-700 text-sm font-medium">Alamat Penjemputan</label>
              <Input
                placeholder="Jl. Contoh No. 123"
                value={alamat()}
                onInput={(e) => setAlamat(e.currentTarget.value)}
                required
              />
            </div>

            <div class="space-y-2">
              <label class="text-secondary-700 text-sm font-medium">Foto Bukti</label>
              <div class="border-secondary-200 hover:bg-secondary-50 relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  class="absolute inset-0 cursor-pointer opacity-0"
                  onChange={handleFileChange}
                  required
                />
                {fotoBase64() ? (
                  <img src={fotoBase64()} class="h-32 rounded-md object-cover" />
                ) : (
                  <>
                    <Upload class="text-secondary-400 mb-2 h-8 w-8" />
                    <p class="text-secondary-500 text-xs">Klik untuk upload foto</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex justify-between">
            <Button variant="ghost" type="button" onClick={() => navigate("/dashboard/user")}>
              Batal
            </Button>
            <Button type="submit" disabled={loading()}>
              {loading() ? "Mengirim..." : "Kirim Pesanan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
