import { type Component, type JSX, splitProps, Show } from "solid-js";
import { cn } from "~/lib/utils";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: Component<InputProps> = (props) => {
  const [local, rest] = splitProps(props, ["label", "error", "class", "id"]);

  return (
    <div class="w-full space-y-2">
      <Show when={local.label}>
        <label
          for={local.id}
          class="text-secondary-700 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {local.label}
        </label>
      </Show>
      <input
        class={cn(
          "border-secondary-200 placeholder:text-secondary-400 focus-visible:ring-primary-400 flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          local.error && "border-red-500 focus-visible:ring-red-400",
          local.class
        )}
        id={local.id}
        {...rest}
      />
      <Show when={local.error}>
        <span class="text-xs font-medium text-red-500">{local.error}</span>
      </Show>
    </div>
  );
};
