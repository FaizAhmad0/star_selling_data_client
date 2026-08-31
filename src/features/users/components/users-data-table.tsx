"use client";

import { Table, Tooltip, Button, Popconfirm, Space } from "antd";
import type { TableProps } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { User, ManagerRef, PlatformRef } from "@/features/users/types";

function getManagerName(manager: ManagerRef | string | undefined): string {
  if (!manager) return "—";
  if (typeof manager === "string") return manager;
  return manager.name || "—";
}

function getAllEnrollments(user: User): { platform: string; id: string }[] {
  const enrollments: { platform: string; id: string }[] = [];
  if (user.enrollmentIdAmazon) enrollments.push({ platform: "Amazon", id: user.enrollmentIdAmazon });
  if (user.enrollmentIdWebsite) enrollments.push({ platform: "Website", id: user.enrollmentIdWebsite });
  if (user.enrollmentIdEtsy) enrollments.push({ platform: "Etsy", id: user.enrollmentIdEtsy });
  return enrollments;
}

function getBatch(user: User): string {
  return user.batchAmazon || user.batchWebsite || user.batchEtsy || "—";
}

function getJoiningDate(user: User): string {
  return user.dateAmazon || user.dateWebsite || user.dateEtsy || "—";
}

function getManager(user: User): string {
  return getManagerName(user.amazonManager || user.websiteManager || user.etsyManager);
}

function PlatformsCell({ platforms }: { platforms?: PlatformRef[] }) {
  if (!platforms || platforms.length === 0) return <span className="text-xs text-muted-foreground">—</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {platforms.map((p) => (
        <span
          key={p._id}
          className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
        >
          {p.name}
        </span>
      ))}
    </div>
  );
}

interface UsersTableProps {
  users: User[];
  meta: { page: number; limit: number; total: number; totalPages: number };
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({ users, meta, isLoading, onPageChange, onView, onEdit, onDelete }: UsersTableProps) {
  const columns: TableProps<User>["columns"] = [
    {
      title: "User",
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
      render: (val: number) => <span className="font-mono text-xs text-foreground">{val ? `UID${val}`: "—"}</span>,
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      responsive: ["sm"],
      render: (val: string) => <span className="font-mono text-xs text-foreground">{val || "—"}</span>,
    },
    {
      title: "Enrollment",
      key: "enrollment",
      responsive: ["sm"],
      render: (_, record) => {
        const enrollments = getAllEnrollments(record);
        if (enrollments.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {enrollments.map((e) => (
              <span
                key={e.platform}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
              >
                <span className="text-muted-foreground">{e.platform}:</span>
                <span className="font-mono">{e.id}</span>
              </span>
            ))}
          </div>
        );
      },
    },
    {
      title: "Contact",
      dataIndex: "primaryContact",
      key: "primaryContact",
      responsive: ["md"],
      render: (val: string) => <span className="text-xs text-muted-foreground">{val || "—"}</span>,
    },
    {
      title: "Platforms",
      key: "platforms",
      responsive: ["lg"],
      render: (_, record) => <PlatformsCell platforms={record.platforms} />,
    },
    {
      title: "Manager",
      key: "manager",
      responsive: ["lg"],
      render: (_, record) => <span className="text-xs text-muted-foreground">{getManager(record)}</span>,
    },
    {
      title: "Batch",
      key: "batch",
      responsive: ["lg"],
      render: (_, record) => <span className="text-xs text-muted-foreground">{getBatch(record)}</span>,
    },
    // {
    //   title: "Joining Date",
    //   key: "joiningDate",
    //   responsive: ["xl"],
    //   render: (_, record) => {
    //     const date = getJoiningDate(record);
    //     return <span className="text-xs text-muted-foreground">{date !== "—" ? date : "—"}</span>;
    //   },
    // },
    // {
    //   title: "Status",
    //   key: "status",
    //   responsive: ["sm"],
    //   render: (_, record) => {
    //     const isActive = record.tokenVersion >= 0;
    //     return (
    //       <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"}`}>
    //         {isActive ? "Active" : "Inactive"}
    //       </span>
    //     );
    //   },
    // },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="View" placement="top">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(record)} className="text-muted-foreground hover:!text-foreground" />
          </Tooltip>
          <Tooltip title="Edit" placement="top">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} className="text-muted-foreground hover:!text-foreground" />
          </Tooltip>
          <Popconfirm title="Delete user" description="This action cannot be undone." onConfirm={() => onDelete(record)} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
            <Tooltip title="Delete" placement="top">
              <Button type="text" size="small" icon={<DeleteOutlined />} className="text-muted-foreground hover:!text-destructive" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table<User>
        columns={columns}
        dataSource={users}
        bordered
        rowKey="_id"
        loading={isLoading}
        pagination={{
          current: meta.page,
          pageSize: meta.limit,
          total: meta.total,
          showSizeChanger: false,
          showTotal: (total, range) => `Showing ${range[0]}\u2013${range[1]} of ${total} users`,
          onChange: (page) => onPageChange(page),
        }}
        scroll={{ x: 1000 }}
        size="middle"
      />
    </div>
  );
}
