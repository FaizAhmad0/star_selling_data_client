"use client";

import { useState } from "react";
import { Download, Plus, Search, ShoppingBag, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UsersFilter } from "@/features/users/components/users-filter";
import { ProductsTable } from "@/features/products/components/products-data-table";
import { ProductModal } from "@/features/products/components/product-modal";
import type { Product, ProductInput } from "@/features/products/types";

export default function AdminProductsPage() {
  // Client-only records entered by the user; no sample data or API calls.
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const limit = 10;

  const query = search.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesSearch = [product.title, product.category, product.shortDescription, ...product.materials]
      .some((value) => value.toLowerCase().includes(query));
    const createdDate = product.createdAt.slice(0, 10);
    return matchesSearch
      && (!filters.category || product.category.toLowerCase().includes(filters.category.trim().toLowerCase()))
      && (!filters.material || product.materials.some((material) => material.toLowerCase().includes(filters.material.trim().toLowerCase())))
      && (!filters.createdAtFrom || createdDate >= filters.createdAtFrom)
      && (!filters.createdAtTo || createdDate <= filters.createdAtTo);
  });
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filteredProducts.length / limit)));

  const closeProductModal = () => {
    setIsAddModalOpen(false);
    setSelectedProduct(null);
    setIsViewing(false);
  };

  const saveProduct = (input: ProductInput) => {
    if (selectedProduct) {
      setProducts((current) => current.map((product) => product._id === selectedProduct._id ? { ...product, ...input } : product));
    } else {
      const product = { ...input, _id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      setProducts((current) => [product, ...current]);
      setSearch("");
      setFilters({});
      setPage(1);
    }
    toast.success(selectedProduct ? "Product updated for this session" : "Product added for this session");
    closeProductModal();
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
          <span title="Bulk product upload will be added in the next step.">
            <Button variant="outline" size="sm" disabled className="gap-1.5">
              <Upload className="size-3.5" />
              Bulk Upload
            </Button>
          </span>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1.5">
            <Plus className="size-3.5" />
            Add New Product
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search products"
            placeholder="Search by title, category, or material..."
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
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
            activeFilters={filters}
            onFilterChange={(key, value) => { setFilters((current) => ({ ...current, [key]: value })); setPage(1); }}
            onApplyFilters={() => setPage(1)}
            onClearFilters={() => { setFilters({}); setPage(1); }}
          />
        </div>
      </div>

      <ProductsTable
        products={filteredProducts.slice((currentPage - 1) * limit, currentPage * limit)}
        meta={{ page: currentPage, limit, total: filteredProducts.length }}
        onPageChange={setPage}
        onView={(product) => { setSelectedProduct(product); setIsViewing(true); }}
        onEdit={(product) => { setSelectedProduct(product); setIsViewing(false); }}
        onDelete={(product) => {
          setProducts((current) => current.filter((item) => item._id !== product._id));
          setPage(currentPage);
          toast.success("Product removed from this session");
        }}
      />

      {(isAddModalOpen || selectedProduct) && (
        <ProductModal product={selectedProduct} readOnly={isViewing} onClose={closeProductModal} onSave={saveProduct} />
      )}
    </div>
  );
}
