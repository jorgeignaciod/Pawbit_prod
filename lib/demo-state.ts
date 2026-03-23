export type DemoState = "default" | "loading" | "empty" | "error" | "success";

export function resolveDemoState(value?: string | null): DemoState {
  if (value === "loading" || value === "empty" || value === "error" || value === "success") {
    return value;
  }

  return "default";
}
