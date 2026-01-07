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

export default function TarikTunai() {
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  // Form State
  const [nominal, setNominal] = createSignal<number | "">("");
  const [bank, setBank] = createSignal("");
  const [rekening, setRekening] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!nominal() || !bank() || !rekening()) {
        throw new Error("Mohon lengkapi semua data");
      }

      if (Number(nominal()) < 10000) {
        throw new Error("Minimal penarikan Rp 10.000");
      }

      await api.post(ENDPOINTS.USER.PENARIKAN, {
        nominal: Number(nominal()),
        bank_tujuan: bank(),
        nomor_rekening: rekening(),
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
          <CardTitle>Tarik Tunai</CardTitle>
          <CardDescription>Cairkan saldo dompet Anda ke rekening bank</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent class="space-y-4">
            {error() && <div class="rounded-md bg-red-50 p-3 text-sm text-red-600">{error()}</div>}

            <div class="space-y-2">
              <label class="text-secondary-700 text-sm font-medium">Nominal Penarikan (Rp)</label>
              <Input
                type="number"
                min="10000"
                placeholder="Min. 10.000"
                value={nominal()}
                onInput={(e) => setNominal(Number(e.currentTarget.value))}
                required
              />
            </div>

            <div class="space-y-2">
              <label class="text-secondary-700 text-sm font-medium">Bank Tujuan</label>
              <Input
                placeholder="BCA, Mandiri, BRI, dll"
                value={bank()}
                onInput={(e) => setBank(e.currentTarget.value)}
                required
              />
            </div>

            <div class="space-y-2">
              <label class="text-secondary-700 text-sm font-medium">Nomor Rekening</label>
              <Input
                placeholder="1234xxxxxx"
                value={rekening()}
                onInput={(e) => setRekening(e.currentTarget.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter class="flex justify-between">
            <Button variant="ghost" type="button" onClick={() => navigate("/dashboard/user")}>
              Batal
            </Button>
            <Button type="submit" disabled={loading()}>
              {loading() ? "Proses..." : "Ajukan Penarikan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
