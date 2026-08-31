"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdatePlatform } from "@/features/platforms/hooks/use-platforms";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/features/managers/components/modal";
import type { Platform } from "@/features/platforms/types";

const editPlatformSchema = z.object({
  name: z.string().min(1, "Platform name is required").max(100, "Name is too long"),
  status: z.enum(["active", "inactive"]).optional(),
});

type EditPlatformFormInput = z.infer<typeof editPlatformSchema>;

interface EditPlatformModalProps {
  open: boolean;
  onClose: () => void;
  platform: Platform | null;
}

export function EditPlatformModal({ open, onClose, platform }: EditPlatformModalProps) {
  const updatePlatform = useUpdatePlatform();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditPlatformFormInput>({
    resolver: zodResolver(editPlatformSchema),
  });

  useEffect(() => {
    if (platform && open) {
      reset({
        name: platform.name,
        status: platform.status,
      });
    }
  }, [platform, open, reset]);

  const onSubmit = (data: EditPlatformFormInput) => {
    if (!platform) return;
    updatePlatform.mutate(
      { id: platform._id, data },
      { onSuccess: () => onClose() }
    );
  };

  const handleClose = () => {
    if (updatePlatform.isPending) return;
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader
        title="Edit Platform"
        description={`Update details for ${platform?.name ?? ""}`}
        onClose={handleClose}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Platform Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter platform name"
                disabled={updatePlatform.isPending}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                disabled={updatePlatform.isPending}
                {...register("status")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-xs text-destructive">{errors.status.message}</p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={updatePlatform.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={updatePlatform.isPending}>
            {updatePlatform.isPending ? (
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
