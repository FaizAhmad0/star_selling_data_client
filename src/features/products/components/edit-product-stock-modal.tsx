"use client";

import { useState } from "react";
import { Loader2, PackageX, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/features/managers/components/modal";
import { useUpdateProductStock } from "../hooks/use-products";
import { ProductStock } from "./product-stock";
import type { Product } from "../types";

interface EditProductStockModalProps {
  product: Product;
  onClose: () => void;
}

const selectClassName = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function EditProductStockModal({ product, onClose }: EditProductStockModalProps) {
  const [colorId, setColorId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [stock, setStock] = useState("");
  const [validationError, setValidationError] = useState("");
  const updateStock = useUpdateProductStock();
  const variants = product.colors.flatMap((color) => color.variants.map((variant) => ({ ...variant, colorId: color._id, color: color.color })));
  const selectedVariant = variants.find((variant) => variant._id === variantId);
  const selectedColor = product.colors.find((color) => color._id === colorId);

  const chooseVariant = (id: string) => {
    const variant = variants.find((item) => item._id === id);
    setVariantId(variant?._id || "");
    if (variant) setColorId(variant.colorId);
    setStock(variant ? String(variant.stock) : "");
    setValidationError("");
    updateStock.reset();
  };

  const saveStock = (quantity: number) => {
    if (updateStock.isPending) return;
    if (!selectedVariant) { setValidationError("Select a color, size, and SKU first."); return; }
    if (!Number.isSafeInteger(quantity) || quantity < 0) { setValidationError("Stock must be a non-negative whole number."); return; }
    setValidationError("");
    updateStock.mutate({ productId: product._id, variantId: selectedVariant._id, stock: quantity }, { onSuccess: () => onClose() });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stock.trim()) { setValidationError("Enter a stock quantity."); return; }
    saveStock(Number(stock));
  };
  const handleClose = () => { if (!updateStock.isPending) onClose(); };

  return (
    <Modal open onClose={handleClose}>
      <ModalHeader title="Edit Product Stock" description={product.title} onClose={handleClose} />
      {variants.length === 0 ? (
        <>
          <ModalBody><p className="text-xs text-muted-foreground">This product has no variants. Use Bulk Upload to add a color, size, and SKU before setting stock.</p></ModalBody>
          <ModalFooter><Button variant="outline" onClick={handleClose}>Close</Button></ModalFooter>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <ModalBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stock-color">Color *</Label>
                  <select id="stock-color" required value={colorId} disabled={updateStock.isPending} className={selectClassName} onChange={(event) => {
                    setColorId(event.target.value);
                    chooseVariant("");
                  }}>
                    <option value="">Select color</option>
                    {product.colors.filter((color) => color.variants.length > 0).map((color) => <option key={color._id} value={color._id}>{color.color}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock-size">Size *</Label>
                  <select id="stock-size" required value={variantId} disabled={!selectedColor || updateStock.isPending} className={selectClassName} onChange={(event) => chooseVariant(event.target.value)}>
                    <option value="">Select size</option>
                    {selectedColor?.variants.map((variant) => <option key={variant._id} value={variant._id}>{variant.size}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock-sku">SKU *</Label>
                <select id="stock-sku" required value={variantId} disabled={updateStock.isPending} className={selectClassName} onChange={(event) => chooseVariant(event.target.value)}>
                  <option value="">Select SKU</option>
                  {variants.map((variant) => <option key={variant._id} value={variant._id}>{variant.sku} ({variant.color} / {variant.size})</option>)}
                </select>
                <p className="text-[10px] text-muted-foreground">Choose a color and size, or select a SKU to fill both automatically.</p>
              </div>
              {selectedVariant && (
                <div className="flex items-center justify-between gap-2 rounded-md bg-muted px-3 py-2">
                  <span className="text-xs text-muted-foreground">Current stock</span>
                  <ProductStock stock={selectedVariant.stock} />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="stock-quantity">Stock Quantity *</Label>
                <Input
                  id="stock-quantity" type="number" min={0} max={Number.MAX_SAFE_INTEGER} step={1} required
                  value={stock} disabled={!selectedVariant || updateStock.isPending}
                  onChange={(event) => { setStock(event.target.value); setValidationError(""); }}
                  placeholder="Enter available quantity" aria-describedby="stock-help"
                />
                <p id="stock-help" className="text-[10px] text-muted-foreground">Sets the available quantity for this SKU. Enter 0 for out of stock, or a positive quantity to restock.</p>
              </div>
              {(validationError || updateStock.error) && <p role="alert" className="text-xs text-destructive">{validationError || updateStock.error?.message}</p>}
              <Button type="button" variant="destructive" disabled={!selectedVariant || selectedVariant.stock === 0 || updateStock.isPending} onClick={() => saveStock(0)} className="gap-1.5">
                <PackageX className="size-3.5" />Mark Out of Stock
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" disabled={updateStock.isPending} onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={!selectedVariant || updateStock.isPending} className="gap-1.5">
              {updateStock.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              {updateStock.isPending ? "Saving…" : "Save Stock"}
            </Button>
          </ModalFooter>
        </form>
      )}
    </Modal>
  );
}
