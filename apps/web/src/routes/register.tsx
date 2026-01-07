import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Droplet } from "lucide-solid";
import { api } from "~/lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = createSignal({
    email: "",
    password: "",
    nama_lengkap: "",
    no_hp: "",
  });
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const handleChange = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [target.id]: target.value }));
  };

  const handleRegister = async (e: Event) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await api.post("/api/auth/register", {
        ...formData(),
        // Default role based on registration form (usually USER for public register)
        // We could add a select box if we want to allow other roles, but for now defaults to USER
        peran: "USER",
      });

      // Auto login after register? Or redirect to login?
      // For simplicity, let's redirect to login for now with a success message (or auto login if API supported it directly)
      // Since login requires a separate call, let's just redirect.
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="grid min-h-screen lg:grid-cols-2">
      {/* Left: Form */}
      <div class="flex items-center justify-center bg-white p-8">
        <div class="w-full max-w-md space-y-8">
          <div class="text-center">
            <A href="/" class="text-primary-600 mb-8 inline-flex items-center space-x-2">
              <Droplet class="h-8 w-8" />
              <span class="text-xl font-bold">EcoOil Connect</span>
            </A>
            <h2 class="text-secondary-900 text-3xl font-bold tracking-tight">Buat Akun Baru</h2>
            <p class="text-secondary-600 mt-2">Mulai setorkan minyak jelantah Anda hari ini</p>
          </div>

          <form onSubmit={handleRegister} class="space-y-6">
            <div class="space-y-4">
              <Input
                id="nama_lengkap"
                label="Nama Lengkap"
                placeholder="Nama Anda"
                value={formData().nama_lengkap}
                onInput={handleChange}
                required
              />
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="nama@email.com"
                value={formData().email}
                onInput={handleChange}
                required
              />
              <Input
                id="no_hp"
                type="tel"
                label="Nomor HP"
                placeholder="08..."
                value={formData().no_hp}
                onInput={handleChange}
                required
              />
              <Input
                id="password"
                type="password"
                label="Password"
                value={formData().password}
                onInput={handleChange}
                required
                minlength={6}
              />
            </div>

            {error() && <div class="rounded-md bg-red-50 p-3 text-sm text-red-600">{error()}</div>}

            <Button type="submit" class="w-full" size="lg" isLoading={isLoading()}>
              Daftar Sekarang
            </Button>
          </form>

          <p class="text-secondary-600 text-center text-sm">
            Sudah punya akun?{" "}
            <A href="/login" class="text-primary-600 hover:text-primary-500 font-medium">
              Masuk disini
            </A>
          </p>
        </div>
      </div>

      {/* Right: Feature Image */}
      <div class="bg-secondary-900 relative hidden overflow-hidden lg:block">
        <div class="from-secondary-900 to-secondary-800 absolute inset-0 bg-gradient-to-br opacity-90" />
        <div class="absolute inset-0 z-10 flex items-center justify-center p-12 text-white">
          <div class="max-w-xl space-y-6">
            <h2 class="text-4xl font-bold">Dampak Nyata</h2>
            <p class="text-secondary-200 text-lg">
              Bergabunglah dengan komunitas yang peduli. Setiap liter yang Anda setor tidak hanya
              menghasilkan uang, tapi juga melindungi ekosistem air kita.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
