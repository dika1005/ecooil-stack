import { createSignal, For, Show, onMount } from "solid-js";
import { api } from "~/lib/api";
import { Badge } from "~/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { formatDate } from "~/lib/utils";

interface User {
  id_user: number;
  email: string;
  nama_lengkap: string;
  no_hp: string;
  peran: string;
  alamat_lengkap: string | null;
  created_at: string;
}

interface PaginatedResponse {
  success: boolean;
  message: string;
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
}

export default function AdminUsers() {
  const [users, setUsers] = createSignal<User[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");
  const [meta, setMeta] = createSignal<PaginatedResponse["meta"] | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await api.getFullResponse<PaginatedResponse>("/api/admin/users");
      console.log("Users response:", result);
      setUsers(result.data || []);
      setMeta(result.meta);
    } catch (e) {
      console.error("Error fetching users:", e);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchUsers();
  });

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-secondary-900 text-2xl font-bold">Manajemen User</h1>
        <Show when={meta()}>
          <span class="text-secondary-500 text-sm">Total: {meta()?.total} users</span>
        </Show>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <Show when={error()}>
            <div class="py-4 text-center text-red-500">{error()}</div>
          </Show>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="text-secondary-500 bg-secondary-50 text-xs uppercase">
                <tr>
                  <th class="px-4 py-3">Nama</th>
                  <th class="px-4 py-3">Email</th>
                  <th class="px-4 py-3">No HP</th>
                  <th class="px-4 py-3">Peran</th>
                  <th class="px-4 py-3">Tgl Daftar</th>
                </tr>
              </thead>
              <tbody>
                <Show when={loading()}>
                  <tr>
                    <td colspan="5" class="py-4 text-center">
                      Memuat data...
                    </td>
                  </tr>
                </Show>
                <Show when={!loading() && users().length === 0 && !error()}>
                  <tr>
                    <td colspan="5" class="text-secondary-500 py-8 text-center">
                      Tidak ada data user.
                    </td>
                  </tr>
                </Show>
                <Show when={!loading() && users().length > 0}>
                  <For each={users()}>
                    {(user) => (
                      <tr class="border-secondary-100 hover:bg-secondary-50 border-b">
                        <td class="text-secondary-900 px-4 py-3 font-medium">
                          {user.nama_lengkap}
                        </td>
                        <td class="text-secondary-500 px-4 py-3">{user.email}</td>
                        <td class="text-secondary-500 px-4 py-3">{user.no_hp}</td>
                        <td class="px-4 py-3">
                          <Badge
                            variant={
                              user.peran === "ADMIN"
                                ? "destructive"
                                : user.peran === "DRIVER"
                                  ? "warning"
                                  : user.peran === "INDUSTRI"
                                    ? "info"
                                    : "default"
                            }
                          >
                            {user.peran}
                          </Badge>
                        </td>
                        <td class="text-secondary-500 px-4 py-3">{formatDate(user.created_at)}</td>
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
