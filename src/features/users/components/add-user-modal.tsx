"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUser } from "@/features/users/hooks/use-users";
import { useManagers } from "@/features/managers/hooks/use-managers";
import { createUserSchema, type CreateUserFormInput } from "@/features/users/schemas/user.schema";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/features/managers/components/modal";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddUserModal({ open, onClose }: AddUserModalProps) {
  const createUser = useCreateUser();
  const { data: managersData, isLoading: managersLoading } = useManagers({ limit: 1000 });
  const managers = managersData?.data?.data ?? [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserFormInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      enrollment: "",
      primaryContact: "",
      date: "",
      batch: "",
      manager: "",
      enrolledBy: "",
    },
  });

  const onSubmit = (data: CreateUserFormInput) => {
    createUser.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (createUser.isPending) return;
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader title="Add New User" description="Create a new user account with enrollment details." onClose={handleClose} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" disabled={createUser.isPending} {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="user@example.com" disabled={createUser.isPending} {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="enrollment">Enrollment Number</Label>
                <Input id="enrollment" placeholder="e.g. AZ001, WB002" disabled={createUser.isPending} {...register("enrollment")} />
                {errors.enrollment && <p className="text-xs text-destructive">{errors.enrollment.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryContact">Phone Number</Label>
                <Input id="primaryContact" type="tel" placeholder="+91 98765 43210" disabled={createUser.isPending} {...register("primaryContact")} />
                {errors.primaryContact && <p className="text-xs text-destructive">{errors.primaryContact.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Joining Date</Label>
                <Input id="date" type="date" disabled={createUser.isPending} {...register("date")} />
                {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Input id="batch" placeholder="e.g. Batch-2024-A" disabled={createUser.isPending} {...register("batch")} />
                {errors.batch && <p className="text-xs text-destructive">{errors.batch.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <div className="relative">
                  <select
                    id="manager"
                    disabled={createUser.isPending || managersLoading}
                    {...register("manager")}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8"
                  >
                    <option value="">{managersLoading ? "Loading managers..." : "Select a manager"}</option>
                    {managers.map((m) => (
                      <option key={m._id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
                {errors.manager && <p className="text-xs text-destructive">{errors.manager.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrolledBy">Enrolled By</Label>
                <Input id="enrolledBy" placeholder="Optional" disabled={createUser.isPending} {...register("enrolledBy")} />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={createUser.isPending}>Cancel</Button>
          <Button type="submit" disabled={createUser.isPending}>
            {createUser.isPending ? (<><Loader2 className="mr-1.5 size-3.5 animate-spin" />Creating...</>) : (<><UserPlus className="mr-1.5 size-3.5" />Create User</>)}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}