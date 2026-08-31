"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateManager } from "@/features/managers/hooks/use-managers";
import { usePlatforms } from "@/features/platforms/hooks/use-platforms";
import {
  createManagerSchema,
  type CreateManagerFormInput,
} from "@/features/managers/schemas/manager.schema";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./modal";

interface AddManagerModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddManagerModal({ open, onClose }: AddManagerModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const createManager = useCreateManager();

  const { data: platformsData } = usePlatforms({ limit: 100, status: "active" });
  const platforms = useMemo(
    () => platformsData?.data?.data ?? [],
    [platformsData]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateManagerFormInput>({
    resolver: zodResolver(createManagerSchema),
    defaultValues: {
      name: "",
      email: "",
      primaryContact: "",
      password: "",
      platform: "",
    },
  });

  const onSubmit = (data: CreateManagerFormInput) => {
    createManager.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (createManager.isPending) return;
    reset();
    setShowPassword(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} className="max-h-[90vh]">
      <ModalHeader
        title="Add New Manager"
        description="Create a new manager account with login credentials."
        onClose={handleClose}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter manager's full name"
                disabled={createManager.isPending}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="manager@example.com"
                disabled={createManager.isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryContact">Phone Number</Label>
              <Input
                id="primaryContact"
                type="tel"
                placeholder="+91 98765 43210"
                disabled={createManager.isPending}
                {...register("primaryContact")}
              />
              {errors.primaryContact && (
                <p className="text-xs text-destructive">
                  {errors.primaryContact.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <select
                id="platform"
                disabled={createManager.isPending}
                {...register("platform")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a platform</option>
                {platforms.map((platform) => (
                  <option key={platform._id} value={platform._id}>
                    {platform.name}
                  </option>
                ))}
              </select>
              {errors.platform && (
                <p className="text-xs text-destructive">
                  {errors.platform.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  disabled={createManager.isPending}
                  className="pr-9"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
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
            disabled={createManager.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createManager.isPending}>
            {createManager.isPending ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="mr-1.5 size-3.5" />
                Create Manager
              </>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
