"use client";

import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/features/managers/components/modal";
import type { Product, ProductInput } from "../types";

interface ProductModalProps {
  product: Product | null;
  readOnly: boolean;
  onClose: () => void;
  onSave?: (input: ProductInput) => void;
}

const fields = [
  { name: "title", label: "Product Title", placeholder: "Enter product title", required: true },
  { name: "category", label: "Category", placeholder: "Enter category", required: true },
  { name: "shortDescription", label: "Short Description", placeholder: "Brief product description" },
  { name: "longDescription", label: "Long Description", placeholder: "Detailed product description", multiline: true },
  { name: "materials", label: "Materials", placeholder: "Enter product materials", hint: "Up to 3 materials, separated by semicolons." },
  { name: "bulletPoints", label: "Bullet Points", placeholder: "Enter product highlights", hint: "Up to 4 bullet points, separated by semicolons.", multiline: true },
  { name: "packageContents", label: "Package Contents", placeholder: "Enter package contents" },
] as const;

export function ProductModal({ product, readOnly, onClose, onSave }: ProductModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (readOnly || !onSave) return;
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) || "").trim();
    const list = (key: string) => value(key).split(";").map((item) => item.trim()).filter(Boolean);
    const input: ProductInput = {
      title: value("title"),
      category: value("category"),
      shortDescription: value("shortDescription"),
      longDescription: value("longDescription"),
      materials: list("materials"),
      bulletPoints: list("bulletPoints"),
      packageContents: value("packageContents"),
    };
    if (!input.title || !input.category) { setError("Product title and category are required."); return; }
    if (input.materials.length > 3) { setError("Use a maximum of 3 materials."); return; }
    if (input.bulletPoints.length > 4) { setError("Use a maximum of 4 bullet points."); return; }
    onSave(input);
  };

  return (
    <Modal open onClose={onClose}>
      <ModalHeader
        title={readOnly ? "Product Details" : product ? "Edit Product" : "Add New Product"}
        description={readOnly ? "View product information." : "Changes are temporary and reset when you reload or leave this page."}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
        <ModalBody>
          <div className="space-y-4">
            {fields.map((field) => {
              const current = product?.[field.name];
              const props = {
                id: `product-${field.name}`,
                name: field.name,
                placeholder: field.placeholder,
                required: "required" in field && field.required,
                readOnly,
                defaultValue: Array.isArray(current) ? current.join("; ") : current || "",
              };
              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={props.id}>{field.label}{"required" in field ? " *" : ""}</Label>
                  {"multiline" in field ? (
                    <textarea {...props} rows={3} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                  ) : <Input {...props} />}
                  {"hint" in field && !readOnly && <p className="text-[10px] text-muted-foreground">{field.hint}</p>}
                </div>
              );
            })}
            {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>{readOnly ? "Close" : "Cancel"}</Button>
          {!readOnly && (
            <Button type="submit" disabled={!onSave} className="gap-1.5">
              {product ? <Save className="size-3.5" /> : <Plus className="size-3.5" />}
              {product ? "Save Changes" : "Create Product"}
            </Button>
          )}
        </ModalFooter>
      </form>
    </Modal>
  );
}
