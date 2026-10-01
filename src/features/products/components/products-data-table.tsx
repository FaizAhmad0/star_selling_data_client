"use client";

import { Button, Popconfirm, Space, Table, Tooltip } from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { ShoppingBag } from "lucide-react";
import type { Product } from "../types";
import { ProductVariantsTable } from "./product-variants-table";
import { ProductStock } from "./product-stock";

interface ProductsTableProps {
  products: Product[];
  meta: { page: number; limit: number; total: number };
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onView: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductsTable({ products, meta, isLoading, onPageChange, onView, onEdit, onDelete }: ProductsTableProps) {
  const columns: TableProps<Product>["columns"] = [
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      render: (_, product) => (
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingBag className="size-3.5" />
          </div>
          <div className="min-w-0">
            <p className="max-w-64 truncate text-xs font-medium text-foreground" title={product.title}>{product.title}</p>
            <p className="max-w-64 truncate text-[11px] text-muted-foreground" title={product.shortDescription}>{product.shortDescription || "No description"}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      responsive: ["sm"],
      render: (category: string) => (
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{category || "Uncategorized"}</span>
      ),
    },
    {
      title: "Colors", key: "colors", responsive: ["md"],
      render: (_, product) => (
        <div className="flex flex-wrap gap-1">
          {product.colors.length ? product.colors.map((color) => (
            <span key={color._id} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{color.color}</span>
          )) : <span className="text-xs text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      title: "Variants", dataIndex: "variantCount", key: "variantCount", responsive: ["sm"],
      render: (count: number) => <span className="text-xs text-foreground">{count}</span>,
    },
    {
      title: "Stock", dataIndex: "totalStock", key: "totalStock",
      render: (stock: number, product) => <ProductStock stock={stock} showStatus={product.variantCount > 0} />,
    },
    {
      title: "Materials",
      dataIndex: "materials",
      key: "materials",
      responsive: ["md"],
      render: (materials: string[]) => <span className="text-xs text-muted-foreground">{materials.join(", ") || "—"}</span>,
    },
    {
      title: "Package Contents",
      dataIndex: "packageContents",
      key: "packageContents",
      responsive: ["lg"],
      render: (contents: string) => <p className="max-w-48 truncate text-xs text-muted-foreground" title={contents}>{contents || "—"}</p>,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["sm"],
      render: (date: string) => <span className="text-xs text-muted-foreground">{date?.slice(0, 10) || "—"}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, product) => (
        <Space size={4}>
          <Tooltip title="View" placement="top">
            <Button type="text" size="small" aria-label={`View ${product.title}`} icon={<EyeOutlined />} onClick={() => onView(product)} className="text-muted-foreground hover:!text-foreground" />
          </Tooltip>
          <Tooltip title={onEdit ? "Edit" : "Editing is not available yet"} placement="top">
            <span><Button type="text" size="small" disabled={!onEdit} aria-label={`Edit ${product.title}`} icon={<EditOutlined />} onClick={() => onEdit?.(product)} className="text-muted-foreground hover:!text-foreground" /></span>
          </Tooltip>
          <Popconfirm disabled={!onDelete} title="Delete product" description="This action cannot be undone." onConfirm={() => onDelete?.(product)} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
            <Tooltip title={onDelete ? "Delete" : "Deleting is not available yet"} placement="top">
              <span><Button type="text" size="small" disabled={!onDelete} aria-label={`Delete ${product.title}`} icon={<DeleteOutlined />} className="text-muted-foreground hover:!text-destructive" /></span>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table<Product>
        columns={columns}
        dataSource={products}
        bordered
        rowKey="_id"
        loading={isLoading}
        locale={{ emptyText: "No products found" }}
        expandable={{
          rowExpandable: (product) => product.variantCount > 0,
          expandedRowRender: (product) => <ProductVariantsTable product={product} />,
        }}
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          total: meta.total,
          showSizeChanger: false,
          showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} products`,
          onChange: onPageChange,
        }}
        scroll={{ x: 1300 }}
        size="middle"
      />
    </div>
  );
}
