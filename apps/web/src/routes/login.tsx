import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Droplet } from "lucide-solid";
import { api } from "~/lib/api";
import { authStore } from "~/lib/auth";
import type { User } from "~/types";

// Login response type - token is now in httpOnly cookie
interface LoginResponse {
  user: User;
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await api.post<LoginResponse>("/api/auth/login", {
        email: email(),
        password: password(),
      });

      // Token is now in httpOnly cookie, we just save user to local state
      authStore.login(result.user);

      // Redirect based on role
      switch (result.user.peran) {
        case "ADMIN":
          navigate("/dashboard/admin");
          break;
        case "DRIVER":
          navigate("/dashboard/driver");
          break;
        case "INDUSTRI":
          navigate("/dashboard/industri");
          break;
        default:
          navigate("/dashboard/user");
      }
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Periksa kembali email dan password.");
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
            <h2 class="text-secondary-900 text-3xl font-bold tracking-tight">Selamat Datang</h2>
            <p class="text-secondary-600 mt-2">Masuk untuk mengelola akun Anda</p>
          </div>

          <form onSubmit={handleLogin} class="space-y-6">
            <div class="space-y-4">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="nama@email.com"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                required
              />
              <Input
                id="password"
                type="password"
                label="Password"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                required
              />
            </div>

            {error() && <div class="rounded-md bg-red-50 p-3 text-sm text-red-600">{error()}</div>}

            <Button type="submit" class="w-full" size="lg" isLoading={isLoading()}>
              Masuk
            </Button>
          </form>

          <p class="text-secondary-600 text-center text-sm">
            Belum punya akun?{" "}
            <A href="/register" class="text-primary-600 hover:text-primary-500 font-medium">
              Daftar sekarang
            </A>
          </p>
        </div>
      </div>

      {/* Right: Feature Image */}
      <div class="bg-primary-900 relative hidden overflow-hidden lg:block">
        <div class="from-primary-900 to-primary-800 absolute inset-0 bg-gradient-to-tr opacity-90" />
        <div class="absolute inset-0 z-10 flex items-center justify-center p-12 text-white">
          <div class="max-w-xl space-y-6">
            <h2 class="text-4xl font-bold">Bersama Menjaga Lingkungan</h2>
            <p class="text-primary-100 text-lg">
              Setiap tetes minyak jelantah yang Anda kumpulkan membantu mengurangi pencemaran air
              dan tanah. Bergabunglah dengan ribuan pahlawan lingkungan lainnya sekarang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
