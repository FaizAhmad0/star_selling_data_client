"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangeSupervisorPassword } from "@/features/supervisors/hooks/use-supervisors";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./modal";
import type { Supervisor } from "@/features/supervisors/types";

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

type PasswordFormInput = z.infer<typeof passwordSchema>;

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  supervisor: Supervisor | null;
}

export function ChangePasswordModal({ open, onClose, supervisor }: ChangePasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const changePassword = useChangeSupervisorPassword();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (data: PasswordFormInput) => {
    if (!supervisor) return;
    changePassword.mutate({ id: supervisor._id, password: data.password }, { onSuccess: () => { reset(); onClose(); } });
  };

  const handleClose = () => {
    if (changePassword.isPending) return;
    reset();
    setShowPassword(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader title="Change Password" description={`Set a new password for ${supervisor?.name ?? ""}`} onClose={handleClose} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input id="new-password" type={showPassword ? "text" : "password"} placeholder="Minimum 6 characters" disabled={changePassword.isPending} className="pr-9" {...register("password")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground" tabIndex={-1}>
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={changePassword.isPending}>Cancel</Button>
          <Button type="submit" disabled={changePassword.isPending}>
            {changePassword.isPending ? (<><Loader2 className="mr-1.5 size-3.5 animate-spin" />Updating...</>) : (<><KeyRound className="mr-1.5 size-3.5" />Update Password</>)}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
