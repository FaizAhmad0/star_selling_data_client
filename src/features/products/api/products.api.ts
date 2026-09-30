import { apiGet, apiPost } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { ProductImportResult, ProductImportRow, ProductListResponse, ProductQueryParams } from "../types";

export function getProducts(params: ProductQueryParams = {}, signal?: AbortSignal) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const queryString = query.toString();
  return apiGet<ProductListResponse>(`/products${queryString ? `?${queryString}` : ""}`, { signal });
}

export function bulkImportProducts(rows: ProductImportRow[]) {
  return apiPost<ApiResponse<ProductImportResult>>("/products/bulk-import", { rows }, { timeout: 180_000 });
}
