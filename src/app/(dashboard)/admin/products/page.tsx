"use client";

import { useEffect, useState } from "react";
import { Download, Plus, Search, ShoppingBag, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorState } from "@/components/shared/error-state";
import { UsersFilter } from "@/features/users/components/users-filter";
import { ProductsTable } from "@/features/products/components/products-data-table";
import { ProductModal } from "@/features/products/components/product-modal";
import { EditProductStockModal } from "@/features/products/components/edit-product-stock-modal";
import { BulkImportProductsModal } from "@/features/products/components/bulk-import-products-modal";
import { useProducts } from "@/features/products/hooks/use-products";
import type { Product } from "@/features/products/types";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [draftFilters, setDraftFilters] = useState<Record<string, string>>({});
  const [filterError, setFilterError] = useState("");
  const [page, setPage] = useState(1);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search.trim()); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isFetching, isError, error, refetch } = useProducts({
    page, limit, search: debouncedSearch,
    category: filters.category, material: filters.material,
    createdAtFrom: filters.createdAtFrom, createdAtTo: filters.createdAtTo,
  });
  const products = data?.data.data ?? [];
  const meta = data?.data.meta ?? { page, limit, total: 0, totalPages: 0 };

  const applyFilters = () => {
    if (draftFilters.createdAtFrom && draftFilters.createdAtTo && draftFilters.createdAtFrom > draftFilters.createdAtTo) {
      setFilterError("The start date must be on or before the end date.");
      return;
    }
    setFilterError("");
    setFilters({ ...draftFilters });
    setPage(1);
  };

  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = "/sample.xlsx";
    link.download = "sample.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingBag className="size-4 text-primary" />
            </div>
            <h1 className="font-heading text-xl font-semibold text-foreground">Products</h1>
          </div>
          <p className="text-xs text-muted-foreground">Manage products, categories, and product details.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadSample} className="gap-1.5">
            <Download className="size-3.5" />
            Download Sample
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsBulkImportOpen(true)} className="gap-1.5">
            <Upload className="size-3.5" />
            Bulk Upload
          </Button>
          <span title="Use Bulk Upload to add products. Individual product creation is not available yet.">
            <Button size="sm" disabled className="gap-1.5">
              <Plus className="size-3.5" />
              Add New Product
            </Button>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search products"
            maxLength={200}
            placeholder="Search by title, SKU, category, or material..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <UsersFilter
            filters={[
              { label: "Category", key: "category", type: "text" },
              { label: "Material", key: "material", type: "text" },
              { label: "Created Date", key: "createdAt", type: "date" },
            ]}
            activeFilters={draftFilters}
            onFilterChange={(key, value) => setDraftFilters((current) => ({ ...current, [key]: value }))}
            onApplyFilters={applyFilters}
            onClearFilters={() => { setDraftFilters({}); setFilters({}); setFilterError(""); setPage(1); }}
          />
        </div>
      </div>

      {filterError && <p role="alert" className="text-xs text-destructive">{filterError}</p>}
      {isError ? (
        <ErrorState title="Failed to load products" message={error?.message || "Please try again."} onRetry={() => { void refetch(); }} />
      ) : (
        <ProductsTable
          products={products}
          meta={meta}
          isLoading={isLoading || isFetching}
          onPageChange={setPage}
          onView={setSelectedProduct}
          onEdit={setEditingProduct}
        />
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} readOnly onClose={() => setSelectedProduct(null)} />
      )}
      {editingProduct && (
        <EditProductStockModal key={editingProduct._id} product={editingProduct} onClose={() => setEditingProduct(null)} />
      )}
      {isBulkImportOpen && (
        <BulkImportProductsModal onClose={() => setIsBulkImportOpen(false)} onDownloadSample={handleDownloadSample} />
      )}
    </div>
  );
}
