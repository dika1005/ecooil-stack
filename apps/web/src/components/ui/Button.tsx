import { type Component, type JSX, splitProps } from "solid-js";
import { Loader2 } from "lucide-solid";
import { cn } from "~/lib/utils";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: Component<ButtonProps> = (props) => {
  const [local, rest] = splitProps(props, [
    "variant",
    "size",
    "isLoading",
    "class",
    "children",
    "disabled",
  ]);

  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
    secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200",
    outline: "border border-secondary-200 bg-transparent hover:bg-secondary-50 text-secondary-900",
    ghost: "bg-transparent hover:bg-secondary-100 text-secondary-700",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button
      class={cn(
        "focus-visible:ring-primary-400 inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[local.variant || "primary"],
        sizes[local.size || "md"],
        local.class
      )}
      disabled={local.disabled || local.isLoading}
      {...rest}
    >
      {local.isLoading && <Loader2 class="mr-2 h-4 w-4 animate-spin" />}
      {local.children}
    </button>
  );
};
