"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Table, Tooltip, Button, Popconfirm, Space } from "antd";
import type { TableProps } from "antd";
import { EditOutlined, DeleteOutlined, KeyOutlined } from "@ant-design/icons";
import { useDeleteSupervisor } from "@/features/supervisors/hooks/use-supervisors";
import { EditSupervisorModal } from "./edit-supervisor-modal";
import { ChangePasswordModal } from "./change-password-modal";
import type { Supervisor } from "@/features/supervisors/types";

interface SupervisorsTableProps {
  supervisors: Supervisor[];
  meta: { page: number; limit: number; total: number; totalPages: number };
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function SupervisorsTable({ supervisors, meta, isLoading, onPageChange }: SupervisorsTableProps) {
  const deleteSupervisor = useDeleteSupervisor();
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null);
  const [passwordSupervisor, setPasswordSupervisor] = useState<Supervisor | null>(null);

  const columns: TableProps<Supervisor>["columns"] = [
    {
      title: "Supervisor",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        const initials = record.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
        return (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{initials}</div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">{record.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{record.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
      responsive: ["sm"],
      render: (uid: number) => <span className="font-mono text-xs font-medium text-foreground">{uid ? `UID${uid}` : "—"}</span>,
    },
    {
      title: "Contact",
      dataIndex: "primaryContact",
      key: "primaryContact",
      responsive: ["md"],
      render: (val: string) => <span className="text-xs text-muted-foreground">{val || "—"}</span>,
    },
    {
      title: "Status",
      key: "status",
      responsive: ["sm"],
      render: () => <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">Active</span>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["lg"],
      render: (val: string) => <span className="text-xs text-muted-foreground">{val ? format(new Date(val), "MMM d, yyyy") : "—"}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Edit" placement="top">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => setEditingSupervisor(record)} className="text-muted-foreground hover:!text-foreground" />
          </Tooltip>
          <Tooltip title="Change Password" placement="top">
            <Button type="text" size="small" icon={<KeyOutlined />} onClick={() => setPasswordSupervisor(record)} className="text-muted-foreground hover:!text-foreground" />
          </Tooltip>
          <Popconfirm title="Delete supervisor" description="This action cannot be undone." onConfirm={() => deleteSupervisor.mutate(record._id)} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
            <Tooltip title="Delete" placement="top">
              <Button type="text" size="small" icon={<DeleteOutlined />} className="text-muted-foreground hover:!text-destructive" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table<Supervisor> columns={columns} dataSource={supervisors} bordered rowKey="_id" loading={isLoading}
          pagination={{ current: meta.page, pageSize: meta.limit, total: meta.total, showSizeChanger: false, showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} supervisors`, onChange: (page) => onPageChange(page) }}
          scroll={{ x: 700 }} size="middle" />
      </div>
      <EditSupervisorModal open={!!editingSupervisor} onClose={() => setEditingSupervisor(null)} supervisor={editingSupervisor} />
      <ChangePasswordModal open={!!passwordSupervisor} onClose={() => setPasswordSupervisor(null)} supervisor={passwordSupervisor} />
    </>
  );
}
