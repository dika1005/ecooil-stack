import { createResource, Show } from "solid-js";
import { PublicLayout } from "~/components/layout/PublicLayout";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { api } from "~/lib/api";
import { formatRupiah } from "~/lib/utils";
import { A } from "@solidjs/router";
import { ArrowRight, Recycle, TrendingUp, Users } from "lucide-solid";

// Fetchers
const fetchStats = async () =>
  api.get<{ total_liter_terkumpul: number; total_pesanan_selesai: number; total_user: number }>(
    "/api/public/stats"
  );
const fetchPrice = async () => api.get<{ harga_beli_per_liter: number }>("/api/public/harga");

export default function Home() {
  const [stats] = createResource(fetchStats);
  const [price] = createResource(fetchPrice);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section class="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white py-20 lg:py-32">
        <div class="relative z-10 container mx-auto px-4 text-center">
          <h1 class="text-secondary-900 animate-fade-in mb-6 text-4xl font-bold md:text-6xl">
            Ubah Jelantah Jadi <span class="text-primary-600">Rupiah</span>
          </h1>
          <p class="text-secondary-600 animate-slide-up mx-auto mb-8 max-w-2xl text-lg md:text-xl">
            Platform pengumpulan minyak jelantah terpercaya. Kami menjemput, menimbang, dan membayar
            jelantah Anda dengan harga terbaik.
          </p>
          <div class="animate-slide-up flex flex-col items-center justify-center gap-4 sm:flex-row">
            <A href="/register">
              <Button size="lg" class="w-full sm:w-auto">
                Mulai Setor <ArrowRight class="ml-2 h-5 w-5" />
              </Button>
            </A>
            <A href="/login">
              <Button variant="outline" size="lg" class="w-full sm:w-auto">
                Masuk ke Akun
              </Button>
            </A>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section class="bg-white py-16">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card class="bg-primary-50 border-primary-100">
              <CardHeader class="flex flex-row items-center justify-between pb-2">
                <CardTitle class="text-primary-900 text-lg font-medium">Harga Hari Ini</CardTitle>
                <TrendingUp class="text-primary-600 h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div class="text-primary-700 text-3xl font-bold">
                  <Show when={price()} fallback="Loading...">
                    {formatRupiah(price()?.harga_beli_per_liter || 0)}/L
                  </Show>
                </div>
                <p class="text-primary-600 mt-1 text-xs">Update setiap hari</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="flex flex-row items-center justify-between pb-2">
                <CardTitle class="text-lg font-medium">Total Terkumpul</CardTitle>
                <Recycle class="text-secondary-500 h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div class="text-secondary-900 text-3xl font-bold">
                  <Show when={stats()} fallback="...">
                    {stats()?.total_liter_terkumpul || 0} L
                  </Show>
                </div>
                <p class="text-secondary-500 mt-1 text-xs">Minyak jelantah diselamatkan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="flex flex-row items-center justify-between pb-2">
                <CardTitle class="text-lg font-medium">Mitra Bergabung</CardTitle>
                <Users class="text-secondary-500 h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div class="text-secondary-900 text-3xl font-bold">
                  <Show when={stats()} fallback="...">
                    {stats()?.total_user || 0}
                  </Show>
                </div>
                <p class="text-secondary-500 mt-1 text-xs">Rumah tangga & bisnis</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
