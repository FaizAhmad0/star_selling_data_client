"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Table, Tooltip, Button, Popconfirm, Space } from "antd";
import type { TableProps } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDeletePlatform } from "@/features/platforms/hooks/use-platforms";
import { EditPlatformModal } from "./edit-platform-modal";
import type { Platform } from "@/features/platforms/types";

interface PlatformsTableProps {
  platforms: Platform[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function PlatformsTable({
  platforms,
  meta,
  isLoading,
  onPageChange,
}: PlatformsTableProps) {
  const deletePlatform = useDeletePlatform();
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);

  const columns: TableProps<Platform>["columns"] = [
    {
      title: "Platform Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="text-xs font-medium text-foreground">{name}</span>
      ),
    },
    {
      title: "Status",
      key: "status",
      responsive: ["sm"],
      render: (_, record) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            record.status === "active"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {record.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md"],
      render: (val: string) => (
        <span className="text-xs text-muted-foreground">
          {val ? format(new Date(val), "MMM d, yyyy") : "—"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Edit" placement="top">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => setEditingPlatform(record)}
              className="text-muted-foreground hover:!text-foreground"
            />
          </Tooltip>
          <Popconfirm
            title="Delete platform"
            description="This action cannot be undone."
            onConfirm={() => deletePlatform.mutate(record._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete" placement="top">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                className="text-muted-foreground hover:!text-destructive"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table<Platform>
          columns={columns}
          dataSource={platforms}
          bordered
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: meta.page,
            pageSize: meta.limit,
            total: meta.total,
            showSizeChanger: false,
            showTotal: (total, range) =>
              `Showing ${range[0]}–${range[1]} of ${total} platforms`,
            onChange: (page) => onPageChange(page),
          }}
          scroll={{ x: 500 }}
          size="middle"
        />
      </div>

      <EditPlatformModal
        open={!!editingPlatform}
        onClose={() => setEditingPlatform(null)}
        platform={editingPlatform}
      />
    </>
  );
}
