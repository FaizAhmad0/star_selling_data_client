import { apiPost } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { ProductImportResult, ProductImportRow } from "../types";

export function bulkImportProducts(rows: ProductImportRow[]) {
  return apiPost<ApiResponse<ProductImportResult>>("/products/bulk-import", { rows }, { timeout: 180_000 });
}
