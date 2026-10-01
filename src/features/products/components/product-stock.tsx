export function ProductStock({
  stock,
  showStatus = true,
}: {
  stock: number;
  showStatus?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-foreground">
        {stock.toLocaleString("en-IN")}
      </span>
      {showStatus && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${stock === 0 ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"}`}
        >
          {stock === 0 ? "Out of stock" : "In stock"}
        </span>
      )}
    </div>
  );
}
