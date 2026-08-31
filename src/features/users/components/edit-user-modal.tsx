"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateUser } from "@/features/users/hooks/use-users";
import { usePlatforms } from "@/features/platforms/hooks/use-platforms";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/features/managers/components/modal";
import type { User } from "@/features/users/types";

const editUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  primaryContact: z.string().min(1, "Phone number is required").min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
  platforms: z.array(z.string()).optional(),
});

type EditUserFormInput = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export function EditUserModal({ open, onClose, user }: EditUserModalProps) {
  const updateUser = useUpdateUser();
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
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditUserFormInput>({
    resolver: zodResolver(editUserSchema),
  });

  const watchPlatforms = watch("platforms");
  const selectedPlatforms = useMemo(() => watchPlatforms || [], [watchPlatforms]);

  const filteredPlatforms = useMemo(() => {
    if (!platformSearch) return platforms;
    return platforms.filter((p) =>
      p.name.toLowerCase().includes(platformSearch.toLowerCase())
    );
  }, [platforms, platformSearch]);

  const selectedPlatformObjects = useMemo(
    () => platforms.filter((p) => selectedPlatforms.includes(p._id)),
    [platforms, selectedPlatforms]
  );

  useEffect(() => {
    if (user && open) {
      reset({
        name: user.name,
        email: user.email,
        primaryContact: user.primaryContact || "",
        platforms: user.platforms?.map((p) => (typeof p === "string" ? p : p._id)) || [],
      });
      setPlatformSearch("");
    }
  }, [user, open, reset]);

  const addPlatform = (platformId: string) => {
    if (!selectedPlatforms.includes(platformId)) {
      setValue("platforms", [...selectedPlatforms, platformId], { shouldValidate: true });
    }
    setPlatformSearch("");
    setShowPlatformDropdown(false);
  };

  const removePlatform = (platformId: string) => {
    setValue(
      "platforms",
      selectedPlatforms.filter((id) => id !== platformId),
      { shouldValidate: true }
    );
  };

  const onSubmit = (data: EditUserFormInput) => {
    if (!user) return;
    updateUser.mutate({ id: user._id, data }, { onSuccess: () => onClose() });
  };

  const handleClose = () => {
    if (updateUser.isPending) return;
    setPlatformSearch("");
    setShowPlatformDropdown(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} className="max-h-[90vh]">
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

            <div className="space-y-2">
              <Label>Platforms</Label>
              <Controller
                name="platforms"
                control={control}
                render={() => (
                  <div className="space-y-2">
                    {selectedPlatformObjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPlatformObjects.map((platform) => (
                          <span
                            key={platform._id}
                            className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground"
                          >
                            {platform.name}
                            <button
                              type="button"
                              onClick={() => removePlatform(platform._id)}
                              className="ml-0.5 text-muted-foreground hover:text-foreground"
                              tabIndex={-1}
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <Input
                        placeholder="Search platforms to add..."
                        value={platformSearch}
                        onChange={(e) => {
                          setPlatformSearch(e.target.value);
                          setShowPlatformDropdown(true);
                        }}
                        onFocus={() => setShowPlatformDropdown(true)}
                        onBlur={() => {
                          setTimeout(() => setShowPlatformDropdown(false), 200);
                        }}
                        disabled={updateUser.isPending}
                      />
                      {showPlatformDropdown && (
                        <div className="absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-md border border-border bg-card shadow-lg">
                          {filteredPlatforms.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-muted-foreground">
                              No platforms found
                            </div>
                          ) : (
                            filteredPlatforms.map((platform) => {
                              const isSelected = selectedPlatforms.includes(platform._id);
                              return (
                                <button
                                  key={platform._id}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    if (!isSelected) addPlatform(platform._id);
                                  }}
                                  className={`flex w-full items-center px-3 py-2 text-left text-xs hover:bg-muted ${isSelected ? "opacity-50 cursor-not-allowed" : ""}`}
                                  disabled={isSelected}
                                >
                                  {platform.name}
                                  {isSelected && <span className="ml-auto text-muted-foreground">added</span>}
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              />
              {errors.platforms && <p className="text-xs text-destructive">{errors.platforms.message}</p>}
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
