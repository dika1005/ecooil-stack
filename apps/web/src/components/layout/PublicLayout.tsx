import { type Component, type JSX } from "solid-js";
import { A } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Droplet } from "lucide-solid";

export const PublicLayout: Component<{ children: JSX.Element }> = (props) => {
  return (
    <div class="flex min-h-screen flex-col bg-slate-50">
      <header class="border-secondary-200 sticky top-0 z-50 border-b bg-white">
        <div class="container mx-auto flex h-16 items-center justify-between px-4">
          <A href="/" class="text-primary-600 flex items-center space-x-2">
            <Droplet class="h-8 w-8" />
            <span class="text-xl font-bold tracking-tight">EcoOil Connect</span>
          </A>
          <nav class="hidden items-center space-x-4 md:flex">
            <A href="/login">
              <Button variant="ghost">Masuk</Button>
            </A>
            <A href="/register">
              <Button>Daftar</Button>
            </A>
          </nav>
        </div>
      </header>
      <main class="flex-1">{props.children}</main>
      <footer class="border-secondary-200 border-t bg-white py-8">
        <div class="text-secondary-500 container mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} EcoOil Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
