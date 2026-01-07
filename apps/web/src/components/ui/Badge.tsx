import { type Component, type JSX, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

interface BadgeProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
}

export const Badge: Component<BadgeProps> = (props) => {
  const [local, rest] = splitProps(props, ["variant", "class", "children"]);

  const variants = {
    default: "border-transparent bg-primary-500 text-white shadow hover:bg-primary-600",
    secondary: "border-transparent bg-secondary-100 text-secondary-900 hover:bg-secondary-200",
    destructive: "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
    success: "border-transparent bg-green-500 text-white shadow hover:bg-green-600",
    warning: "border-transparent bg-amber-500 text-white shadow hover:bg-amber-600",
    info: "border-transparent bg-blue-500 text-white shadow hover:bg-blue-600",
    outline: "text-secondary-900",
  };

  return (
    <div
      class={cn(
        "focus:ring-secondary-400 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none",
        variants[local.variant || "default"],
        local.class
      )}
      {...rest}
    >
      {local.children}
    </div>
  );
};
