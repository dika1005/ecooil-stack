import { type Component, type JSX, Show, onMount, createSignal } from "solid-js";
import { Sidebar } from "./Sidebar";
import { authStore } from "~/lib/auth";
import { useNavigate } from "@solidjs/router";
import { Loader2 } from "lucide-solid";

export const DashboardLayout: Component<{ children: JSX.Element }> = (props) => {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = createSignal(false);

  onMount(() => {
    setIsMounted(true);
    if (!authStore.isAuthenticated()) {
      navigate("/login");
    }
  });

  return (
    <Show
      when={isMounted() && authStore.isAuthenticated()}
      fallback={
        <div class="flex h-screen w-screen items-center justify-center bg-slate-50">
          <Loader2 class="text-primary-600 h-8 w-8 animate-spin" />
        </div>
      }
    >
      <div class="flex min-h-screen bg-slate-50">
        <Sidebar class="hidden lg:flex" />

        {/* Mobile Header (TODO) */}

        <main class="flex-1 overflow-auto">
          <div class="container mx-auto p-4 lg:p-8">{props.children}</div>
        </main>
      </div>
    </Show>
  );
};
