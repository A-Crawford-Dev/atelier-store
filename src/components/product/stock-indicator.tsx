import type { StockState } from "@/lib/products";

const dot: Record<StockState["status"], string> = {
  in_stock: "bg-success",
  low_stock: "bg-accent",
  sold_out: "bg-subtle",
};

export function StockIndicator({ state }: { state: StockState }) {
  return (
    <p className="flex items-center gap-2 text-sm">
      <span aria-hidden="true" className={`size-1.5 rounded-full ${dot[state.status]}`} />
      <span className={state.status === "sold_out" ? "text-muted" : undefined}>{state.label}</span>
    </p>
  );
}
