import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError, ApiResponse } from "@/types/api";
import { bulkImportProducts, getProducts, updateProductVariantStock } from "../api/products.api";
import type { ProductImportResult, ProductImportRow, ProductListResponse, ProductQueryParams, UpdateProductStockInput, UpdateProductStockResponse } from "../types";

export function useUpdateProductStock() {
  const queryClient = useQueryClient();
  return useMutation<UpdateProductStockResponse, ApiError, UpdateProductStockInput>({
    mutationFn: updateProductVariantStock,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message || "Stock updated successfully");
    },
    onError: (error) => toast.error(error.message || "Failed to update stock"),
  });
}

export function useProducts(params: ProductQueryParams = {}) {
  return useQuery<ProductListResponse, ApiError>({
    queryKey: ["products", params],
    queryFn: ({ signal }) => getProducts(params, signal),
    staleTime: 30_000,
  });
}

export function useBulkImportProducts() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ProductImportResult>, ApiError, ProductImportRow[]>({
    mutationFn: bulkImportProducts,
    onSuccess: ({ data }) => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      const message = `${data.created} variants created, ${data.updated} updated, ${data.failed.length} rows failed`;
      if (data.failed.length) toast.warning(message);
      else toast.success(message);
    },
    onError: (error) => toast.error(error.message || "Product import failed"),
  });
}
