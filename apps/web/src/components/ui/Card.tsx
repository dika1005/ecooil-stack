import { type Component, type JSX, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

type CardProps = JSX.HTMLAttributes<HTMLDivElement>;

export const Card: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div
      class={cn(
        "border-secondary-100 text-secondary-900 rounded-xl border bg-white shadow-sm",
        local.class
      )}
      {...rest}
    >
      {local.children}
    </div>
  );
};

export const CardHeader: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div class={cn("flex flex-col space-y-1.5 p-6", local.class)} {...rest}>
      {local.children}
    </div>
  );
};

export const CardTitle: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div class={cn("text-lg leading-none font-semibold tracking-tight", local.class)} {...rest}>
      {local.children}
    </div>
  );
};

export const CardDescription: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <p class={cn("text-secondary-500 text-sm", local.class)} {...rest}>
      {local.children}
    </p>
  );
};

export const CardContent: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div class={cn("p-6 pt-0", local.class)} {...rest}>
      {local.children}
    </div>
  );
};

export const CardFooter: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div class={cn("flex items-center p-6 pt-0", local.class)} {...rest}>
      {local.children}
    </div>
  );
};
