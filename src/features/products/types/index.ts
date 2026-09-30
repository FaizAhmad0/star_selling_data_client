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
}

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
