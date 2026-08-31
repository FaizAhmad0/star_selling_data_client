"use client";

import { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import { Loader2, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBulkCreateUsers } from "@/features/users/hooks/use-users";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/features/managers/components/modal";

interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
}

interface ParsedRow {
  name: string;
  email: string;
  enrollment: string;
  primaryContact: string;
  date: string;
  batch: string;
  manager: string;
  enrolledBy?: string;
}

interface ValidationResult {
  valid: ParsedRow[];
  invalid: { row: number; reason: string }[];
}

function validateRows(rows: Record<string, unknown>[]): ValidationResult {
  const valid: ParsedRow[] = [];
  const invalid: { row: number; reason: string }[] = [];

  rows.forEach((row, index) => {
    const name = String(row["Name"] || row["name"] || "").trim();
    const email = String(row["Email"] || row["email"] || "").trim();
    const enrollment = String(row["Enrollment"] || row["enrollment"] || "").trim();
    const primaryContact = String(row["PrimaryContact"] || row["primaryContact"] || row["Phone"] || row["phone"] || "").trim();
    const date = String(row["Date"] || row["date"] || row["JoiningDate"] || row["joiningDate"] || "").trim();
    const batch = String(row["Batch"] || row["batch"] || "").trim();
    const manager = String(row["Manager"] || row["manager"] || "").trim();
    const enrolledBy = String(row["EnrolledBy"] || row["enrolledBy"] || "").trim() || undefined;

    const errors: string[] = [];
    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Invalid email");
    if (!enrollment) errors.push("Enrollment is required");
    if (!primaryContact) errors.push("Phone is required");
    if (!date) errors.push("Date is required");
    if (!batch) errors.push("Batch is required");
    if (!manager) errors.push("Manager is required");

    if (errors.length > 0) {
      invalid.push({ row: index + 2, reason: errors.join(", ") });
    } else {
      valid.push({ name, email, enrollment, primaryContact, date, batch, manager, enrolledBy });
    }
  });

  return { valid, invalid };
}

export function BulkUploadModal({ open, onClose }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkCreate = useBulkCreateUsers();

  const handleFile = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setValidation(null);

    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (ext !== "xlsx" && ext !== "xls" && ext !== "csv") {
      setValidation({ valid: [], invalid: [{ row: 0, reason: "Please select an Excel (.xlsx, .xls) or CSV file" }] });
      return;
    }

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      if (jsonData.length === 0) {
        setValidation({ valid: [], invalid: [{ row: 0, reason: "File is empty or has no data rows" }] });
        return;
      }

      const result = validateRows(jsonData as Record<string, unknown>[]);
      setValidation(result);
    } catch {
      setValidation({ valid: [], invalid: [{ row: 0, reason: "Failed to parse file. Please check the format." }] });
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleUpload = () => {
    if (!validation || validation.valid.length === 0) return;
    bulkCreate.mutate(validation.valid, {
      onSuccess: () => {
        resetState();
        onClose();
      },
    });
  };

  const resetState = () => {
    setFile(null);
    setValidation(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    if (bulkCreate.isPending) return;
    resetState();
    onClose();
  };

  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = "/testdata.xlsx";
    link.download = "testdata.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalHeader title="Bulk Upload Users" description="Upload an Excel file to create multiple users at once." onClose={handleClose} />
      <ModalBody>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleDownloadSample} className="gap-1.5">
              <Download className="size-3.5" />
              Download Sample
            </Button>
            <span className="text-[10px] text-muted-foreground">Get the template file</span>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors ${isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}
          >
            <FileSpreadsheet className="size-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">
                {file ? file.name : "Click to upload or drag and drop"}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                .xlsx, .xls, or .csv files accepted
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
              className="hidden"
            />
          </div>

          {validation && (
            <div className="space-y-2">
              {validation.valid.length > 0 && (
                <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 dark:bg-emerald-500/10">
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs text-emerald-700 dark:text-emerald-400">
                    {validation.valid.length} valid user{validation.valid.length !== 1 ? "s" : ""} ready to upload
                  </span>
                </div>
              )}
              {validation.invalid.length > 0 && (
                <div className="max-h-32 space-y-1 overflow-y-auto rounded-md bg-red-50 px-3 py-2 dark:bg-red-500/10">
                  {validation.invalid.map((err, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 size-3 shrink-0 text-red-500" />
                      <span className="text-[10px] text-red-700 dark:text-red-400">
                        {err.row > 0 ? `Row ${err.row}: ` : ""}{err.reason}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="outline" onClick={handleClose} disabled={bulkCreate.isPending}>Cancel</Button>
        <Button
          type="button"
          onClick={handleUpload}
          disabled={bulkCreate.isPending || !validation || validation.valid.length === 0}
        >
          {bulkCreate.isPending ? (<><Loader2 className="mr-1.5 size-3.5 animate-spin" />Uploading...</>) : (<><Upload className="mr-1.5 size-3.5" />Upload {validation?.valid.length || 0} User{(validation?.valid.length || 0) !== 1 ? "s" : ""}</>)}
        </Button>
      </ModalFooter>
    </Modal>
  );
}