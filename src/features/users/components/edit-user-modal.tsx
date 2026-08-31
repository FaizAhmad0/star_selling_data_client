"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateUser } from "@/features/users/hooks/use-users";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/features/managers/components/modal";
import type { User } from "@/features/users/types";

const editUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  primaryContact: z.string().min(1, "Phone number is required").min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
});

type EditUserFormInput = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export function EditUserModal({ open, onClose, user }: EditUserModalProps) {
  const updateUser = useUpdateUser();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditUserFormInput>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (user && open) {
      reset({
        name: user.name,
        email: user.email,
        primaryContact: user.primaryContact || "",
      });
    }
  }, [user, open, reset]);

  const onSubmit = (data: EditUserFormInput) => {
    if (!user) return;
    updateUser.mutate({ id: user._id, data }, { onSuccess: () => onClose() });
  };

  const handleClose = () => {
    if (updateUser.isPending) return;
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader title="Edit User" description={`Update details for ${user?.name ?? ""}`} onClose={handleClose} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" placeholder="Enter user's full name" disabled={updateUser.isPending} {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input id="edit-email" type="email" placeholder="user@example.com" disabled={updateUser.isPending} {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input id="edit-phone" type="tel" placeholder="+91 98765 43210" disabled={updateUser.isPending} {...register("primaryContact")} />
              {errors.primaryContact && <p className="text-xs text-destructive">{errors.primaryContact.message}</p>}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={updateUser.isPending}>Cancel</Button>
          <Button type="submit" disabled={updateUser.isPending}>
            {updateUser.isPending ? (<><Loader2 className="mr-1.5 size-3.5 animate-spin" />Saving...</>) : (<><Pencil className="mr-1.5 size-3.5" />Save Changes</>)}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
