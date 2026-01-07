import { type Component, For } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { authStore } from "~/lib/auth";
import { cn } from "~/lib/utils";
import {
  Users,
  DollarSign,
  Briefcase,
  Wallet,
  Factory,
  LayoutDashboard,
  LogOut,
  MapPin,
} from "lucide-solid";
import type { Peran } from "~/types";

const MENUS: Record<
  Peran | "SUPER_ADMIN",
  { label: string; href: string; icon: Component<{ class?: string }> }[]
> = {
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Kelola User", href: "/dashboard/admin/users", icon: Users },
    { label: "Atur Harga", href: "/dashboard/admin/harga", icon: DollarSign },
    { label: "Penarikan", href: "/dashboard/admin/penarikan", icon: Wallet },
  ],
  USER: [
    { label: "Beranda", href: "/dashboard/user", icon: LayoutDashboard },
    { label: "Pesanan Saya", href: "/dashboard/user/pesanan", icon: Briefcase },
    { label: "Dompet", href: "/dashboard/user/dompet", icon: Wallet },
  ],
  DRIVER: [
    { label: "Job Radar", href: "/dashboard/driver", icon: MapPin },
    { label: "Riwayat", href: "/dashboard/driver/history", icon: Briefcase },
  ],
  INDUSTRI: [
    { label: "Beranda", href: "/dashboard/industri", icon: LayoutDashboard },
    { label: "Stok Minyak", href: "/dashboard/industri/stok", icon: Factory },
  ],
  SUPER_ADMIN: [],
};

export const Sidebar: Component<{ class?: string }> = (props) => {
  const location = useLocation();
  const user = () => authStore.user();

  const activeMenus = () => {
    const role = user()?.peran;
    return role ? MENUS[role] : [];
  };

  return (
    <aside
      class={cn(
        "border-secondary-200 sticky top-0 flex h-screen w-64 flex-col border-r bg-white",
        props.class
      )}
    >
      <div class="border-secondary-200 flex h-16 items-center border-b px-6">
        <span class="text-primary-600 text-xl font-bold tracking-tight">EcoOil</span>
      </div>

      <div class="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        <For each={activeMenus()}>
          {(menu) => (
            <A
              href={menu.href}
              class={cn(
                "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === menu.href
                  ? "bg-primary-50 text-primary-700"
                  : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
              )}
            >
              <menu.icon class="h-5 w-5" />
              <span>{menu.label}</span>
            </A>
          )}
        </For>
      </div>

      <div class="border-secondary-200 border-t p-4">
        <div class="mb-4 flex items-center space-x-3 px-2">
          <div class="bg-primary-100 text-primary-700 flex h-8 w-8 items-center justify-center rounded-full font-bold">
            {user()?.nama_lengkap.charAt(0)}
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="text-secondary-900 truncate text-sm font-medium">{user()?.nama_lengkap}</p>
            <p class="text-secondary-500 truncate text-xs">{user()?.email}</p>
          </div>
        </div>
        <button
          onClick={() => authStore.logout()}
          class="flex w-full items-center space-x-2 rounded-md px-2 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut class="h-4 w-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
