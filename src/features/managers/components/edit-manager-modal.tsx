"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateManager } from "@/features/managers/hooks/use-managers";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./modal";
import type { Manager } from "@/features/managers/types";

const editManagerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  primaryContact: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
});

type EditManagerFormInput = z.infer<typeof editManagerSchema>;

interface EditManagerModalProps {
  open: boolean;
  onClose: () => void;
  manager: Manager | null;
}

export function EditManagerModal({ open, onClose, manager }: EditManagerModalProps) {
  const updateManager = useUpdateManager();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditManagerFormInput>({
    resolver: zodResolver(editManagerSchema),
  });

  useEffect(() => {
    if (manager && open) {
      reset({
        name: manager.name,
        email: manager.email,
        primaryContact: manager.primaryContact || "",
      });
    }
  }, [manager, open, reset]);

  const onSubmit = (data: EditManagerFormInput) => {
    if (!manager) return;
    updateManager.mutate(
      { id: manager._id, data },
      { onSuccess: () => onClose() }
    );
  };

  const handleClose = () => {
    if (updateManager.isPending) return;
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader
        title="Edit Manager"
        description={`Update details for ${manager?.name ?? ""}`}
        onClose={handleClose}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter manager's full name"
                disabled={updateManager.isPending}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="manager@example.com"
                disabled={updateManager.isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                type="tel"
                placeholder="+91 98765 43210"
                disabled={updateManager.isPending}
                {...register("primaryContact")}
              />
              {errors.primaryContact && (
                <p className="text-xs text-destructive">
                  {errors.primaryContact.message}
                </p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={updateManager.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateManager.isPending}>
            {updateManager.isPending ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Pencil className="mr-1.5 size-3.5" />
                Save Changes
              </>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
