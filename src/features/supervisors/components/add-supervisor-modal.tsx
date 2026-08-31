"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSupervisor } from "@/features/supervisors/hooks/use-supervisors";
import { createSupervisorSchema, type CreateSupervisorFormInput } from "@/features/supervisors/schemas/supervisor.schema";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./modal";

interface AddSupervisorModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddSupervisorModal({ open, onClose }: AddSupervisorModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const createSupervisor = useCreateSupervisor();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateSupervisorFormInput>({
    resolver: zodResolver(createSupervisorSchema),
    defaultValues: { name: "", email: "", primaryContact: "", password: "" },
  });

  const onSubmit = (data: CreateSupervisorFormInput) => {
    createSupervisor.mutate(data, { onSuccess: () => { reset(); onClose(); } });
  };

  const handleClose = () => {
    if (createSupervisor.isPending) return;
    reset();
    setShowPassword(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader title="Add New Supervisor" description="Create a new supervisor account with login credentials." onClose={handleClose} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter supervisor's full name" disabled={createSupervisor.isPending} {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="supervisor@example.com" disabled={createSupervisor.isPending} {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryContact">Phone Number</Label>
              <Input id="primaryContact" type="tel" placeholder="+91 98765 43210" disabled={createSupervisor.isPending} {...register("primaryContact")} />
              {errors.primaryContact && <p className="text-xs text-destructive">{errors.primaryContact.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Minimum 6 characters" disabled={createSupervisor.isPending} className="pr-9" {...register("password")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground" tabIndex={-1}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={createSupervisor.isPending}>Cancel</Button>
          <Button type="submit" disabled={createSupervisor.isPending}>
            {createSupervisor.isPending ? (<><Loader2 className="mr-1.5 size-3.5 animate-spin" />Creating...</>) : (<><UserPlus className="mr-1.5 size-3.5" />Create Supervisor</>)}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
