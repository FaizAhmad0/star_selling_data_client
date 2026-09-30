"use client";

import { Button, Popconfirm, Space, Table, Tooltip } from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { ShoppingBag } from "lucide-react";
import type { Product } from "../types";

interface ProductsTableProps {
  products: Product[];
  meta: { page: number; limit: number; total: number };
  onPageChange: (page: number) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsTable({ products, meta, onPageChange, onView, onEdit, onDelete }: ProductsTableProps) {
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
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{category}</span>
      ),
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
      render: (date: string) => <span className="text-xs text-muted-foreground">{date.slice(0, 10)}</span>,
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
          <Tooltip title="Edit" placement="top">
            <Button type="text" size="small" aria-label={`Edit ${product.title}`} icon={<EditOutlined />} onClick={() => onEdit(product)} className="text-muted-foreground hover:!text-foreground" />
          </Tooltip>
          <Popconfirm title="Delete product" description="This action cannot be undone." onConfirm={() => onDelete(product)} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
            <Tooltip title="Delete" placement="top">
              <Button type="text" size="small" aria-label={`Delete ${product.title}`} icon={<DeleteOutlined />} className="text-muted-foreground hover:!text-destructive" />
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
        locale={{ emptyText: "No products found" }}
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          total: meta.total,
          showSizeChanger: false,
          showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} products`,
          onChange: onPageChange,
        }}
        scroll={{ x: 1000 }}
        size="middle"
      />
    </div>
  );
}
