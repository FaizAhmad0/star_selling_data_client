import type { ApiResponse, PaginatedResponse } from "@/types/api";

export interface ProductInput {
  title: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  materials: string[];
  bulletPoints: string[];
  packageContents: string;
}

export interface Product extends ProductInput {
  _id: string;
  createdAt: string;
  categoryId: string | null;
  colors: ProductColor[];
  variantCount: number;
  totalStock: number;
}

export interface ProductVariant {
  _id: string;
  sku: string;
  size: string;
  stock: number;
  dimensions?: { length: number | null; width: number | null; height: number | null };
  estimatedCostPrice: number | null;
  estimatedSellingPrice: number | null;
  estimatedCostPriceOOI: number | null;
  estimatedSalePriceOOI: number | null;
}

export interface ProductColor {
  _id: string;
  color: string;
  images: string[];
  variants: ProductVariant[];
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  material?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
}

export type ProductListResponse = ApiResponse<PaginatedResponse<Product>>;

export type ProductImportCell = string | number | boolean | null;

export interface ProductImportRow {
  rowNumber: number;
  data: Record<string, ProductImportCell>;
}

export interface ProductImportFailure extends ProductImportRow {
  reason: string;
}

export interface ProductImportResult {
  total: number;
  created: number;
  updated: number;
  successful: {
    rowNumber: number;
    sku: string;
    productId: string;
    colorId: string;
    variantId: string;
    status: "created" | "updated";
  }[];
  failed: ProductImportFailure[];
}
