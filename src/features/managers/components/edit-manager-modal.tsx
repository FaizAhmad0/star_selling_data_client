"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateManager } from "@/features/managers/hooks/use-managers";
import { usePlatforms } from "@/features/platforms/hooks/use-platforms";
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
  platform: z.string().optional(),
});

type EditManagerFormInput = z.infer<typeof editManagerSchema>;

interface EditManagerModalProps {
  open: boolean;
  onClose: () => void;
  manager: Manager | null;
}

export function EditManagerModal({ open, onClose, manager }: EditManagerModalProps) {
  const updateManager = useUpdateManager();
  const [platformSearch, setPlatformSearch] = useState("");
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);

  const { data: platformsData } = usePlatforms({ limit: 100, status: "active" });
  const platforms = useMemo(
    () => platformsData?.data?.data ?? [],
    [platformsData]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditManagerFormInput>({
    resolver: zodResolver(editManagerSchema),
  });

  const selectedPlatformId = watch("platform");

  const filteredPlatforms = useMemo(() => {
    if (!platformSearch) return platforms;
    return platforms.filter((p) =>
      p.name.toLowerCase().includes(platformSearch.toLowerCase())
    );
  }, [platforms, platformSearch]);

  const selectedPlatformName = useMemo(
    () => platforms.find((p) => p._id === selectedPlatformId)?.name ?? "",
    [platforms, selectedPlatformId]
  );

  useEffect(() => {
    if (manager && open) {
      reset({
        name: manager.name,
        email: manager.email,
        primaryContact: manager.primaryContact || "",
        platform: manager.platform?._id || "",
      });
      setPlatformSearch("");
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
    setPlatformSearch("");
    setShowPlatformDropdown(false);
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

            <div className="space-y-2">
              <Label>Platform</Label>
              <div className="relative">
                {selectedPlatformId ? (
                  <div className="flex h-9 items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-xs">
                    <span>{selectedPlatformName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setValue("platform", "", { shouldValidate: true });
                        setPlatformSearch("");
                      }}
                      className="text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <Input
                    placeholder="Search platforms..."
                    value={platformSearch}
                    onChange={(e) => {
                      setPlatformSearch(e.target.value);
                      setShowPlatformDropdown(true);
                    }}
                    onFocus={() => setShowPlatformDropdown(true)}
                    onBlur={() => {
                      setTimeout(() => setShowPlatformDropdown(false), 200);
                    }}
                    disabled={updateManager.isPending}
                  />
                )}
                {showPlatformDropdown && !selectedPlatformId && (
                  <div className="absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-md border border-border bg-card shadow-lg">
                    {filteredPlatforms.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        No platforms found
                      </div>
                    ) : (
                      filteredPlatforms.map((platform) => (
                        <button
                          key={platform._id}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setValue("platform", platform._id, { shouldValidate: true });
                            setPlatformSearch("");
                            setShowPlatformDropdown(false);
                          }}
                          className="flex w-full items-center px-3 py-2 text-left text-xs hover:bg-muted"
                        >
                          {platform.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {errors.platform && (
                <p className="text-xs text-destructive">{errors.platform.message}</p>
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
