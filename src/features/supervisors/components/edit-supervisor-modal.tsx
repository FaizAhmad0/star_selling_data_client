"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateSupervisor } from "@/features/supervisors/hooks/use-supervisors";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./modal";
import type { Supervisor } from "@/features/supervisors/types";

const editSupervisorSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  primaryContact: z.string().min(1, "Phone number is required").min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
});

type EditSupervisorFormInput = z.infer<typeof editSupervisorSchema>;

interface EditSupervisorModalProps {
  open: boolean;
  onClose: () => void;
  supervisor: Supervisor | null;
}

export function EditSupervisorModal({ open, onClose, supervisor }: EditSupervisorModalProps) {
  const updateSupervisor = useUpdateSupervisor();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditSupervisorFormInput>({
    resolver: zodResolver(editSupervisorSchema),
  });

  useEffect(() => {
    if (supervisor && open) {
      reset({ name: supervisor.name, email: supervisor.email, primaryContact: supervisor.primaryContact || "" });
    }
  }, [supervisor, open, reset]);

  const onSubmit = (data: EditSupervisorFormInput) => {
    if (!supervisor) return;
    updateSupervisor.mutate({ id: supervisor._id, data }, { onSuccess: () => onClose() });
  };

  const handleClose = () => {
    if (updateSupervisor.isPending) return;
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader title="Edit Supervisor" description={`Update details for ${supervisor?.name ?? ""}`} onClose={handleClose} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" placeholder="Enter supervisor's full name" disabled={updateSupervisor.isPending} {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input id="edit-email" type="email" placeholder="supervisor@example.com" disabled={updateSupervisor.isPending} {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input id="edit-phone" type="tel" placeholder="+91 98765 43210" disabled={updateSupervisor.isPending} {...register("primaryContact")} />
              {errors.primaryContact && <p className="text-xs text-destructive">{errors.primaryContact.message}</p>}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={updateSupervisor.isPending}>Cancel</Button>
          <Button type="submit" disabled={updateSupervisor.isPending}>
            {updateSupervisor.isPending ? (<><Loader2 className="mr-1.5 size-3.5 animate-spin" />Saving...</>) : (<><Pencil className="mr-1.5 size-3.5" />Save Changes</>)}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
