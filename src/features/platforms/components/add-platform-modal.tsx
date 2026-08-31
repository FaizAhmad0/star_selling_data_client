"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreatePlatform } from "@/features/platforms/hooks/use-platforms";
import {
  createPlatformSchema,
  type CreatePlatformFormInput,
} from "@/features/platforms/schemas/platform.schema";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/features/managers/components/modal";

interface AddPlatformModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddPlatformModal({ open, onClose }: AddPlatformModalProps) {
  const createPlatform = useCreatePlatform();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePlatformFormInput>({
    resolver: zodResolver(createPlatformSchema),
    defaultValues: {
      name: "",
      status: "active",
    },
  });

  const onSubmit = (data: CreatePlatformFormInput) => {
    createPlatform.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (createPlatform.isPending) return;
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader
        title="Create Platform"
        description="Add a new platform to the system."
        onClose={handleClose}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Platform Name</Label>
              <Input
                id="name"
                placeholder="Enter platform name"
                disabled={createPlatform.isPending}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                disabled={createPlatform.isPending}
                {...register("status")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-xs text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={createPlatform.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createPlatform.isPending}>
            {createPlatform.isPending ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-1.5 size-3.5" />
                Create Platform
              </>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
