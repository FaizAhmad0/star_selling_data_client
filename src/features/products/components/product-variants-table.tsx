"use client";

import { Table } from "antd";
import type { TableProps } from "antd";
import type { Product, ProductVariant } from "../types";
import { ProductStock } from "./product-stock";

type VariantRow = ProductVariant & { color: string };
const price = (value: number | null) => value == null ? "—" : value.toLocaleString("en-IN", { maximumFractionDigits: 2 });

const columns: TableProps<VariantRow>["columns"] = [
  { title: "SKU", dataIndex: "sku", key: "sku", width: 180 },
  { title: "Color", dataIndex: "color", key: "color" },
  { title: "Size", dataIndex: "size", key: "size" },
  { title: "Stock", dataIndex: "stock", key: "stock", render: (stock: number) => <ProductStock stock={stock} /> },
  {
    title: "Dimensions (L × W × H)", key: "dimensions",
    render: (_, variant) => [variant.dimensions?.length, variant.dimensions?.width, variant.dimensions?.height].map((value) => value ?? "—").join(" × "),
  },
  { title: "Est. Cost Price", dataIndex: "estimatedCostPrice", key: "estimatedCostPrice", render: price },
  { title: "Est. Selling Price", dataIndex: "estimatedSellingPrice", key: "estimatedSellingPrice", render: price },
  { title: "Est. Cost Price OOI", dataIndex: "estimatedCostPriceOOI", key: "estimatedCostPriceOOI", render: price },
  { title: "Est. Sale Price OOI", dataIndex: "estimatedSalePriceOOI", key: "estimatedSalePriceOOI", render: price },
];

export function ProductVariantsTable({ product }: { product: Product }) {
  const variants = product.colors.flatMap((color) => color.variants.map((variant) => ({ ...variant, color: color.color })));
  return (
    <div className="space-y-2 p-2">
      <p className="text-xs font-medium text-foreground">Variants for {product.title}</p>
      <Table<VariantRow>
        columns={columns}
        dataSource={variants}
        rowKey="_id"
        pagination={false}
        size="small"
        scroll={{ x: 1100 }}
        className="[&_.ant-table-cell]:text-xs"
      />
    </div>
  );
}
