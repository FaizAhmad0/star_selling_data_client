"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/features/managers/components/modal";
import { useBulkImportProducts } from "../hooks/use-products";
import { downloadFailedProducts, readProductSpreadsheet } from "../lib/product-spreadsheet";
import type { ProductImportFailure, ProductImportRow } from "../types";

interface BulkImportProductsModalProps {
  onClose: () => void;
  onDownloadSample: () => void;
}

export function BulkImportProductsModal({ onClose, onDownloadSample }: BulkImportProductsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ProductImportRow[]>([]);
  const [parseError, setParseError] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const readVersion = useRef(0);
  const bulkImport = useBulkImportProducts();
  const result = bulkImport.data?.data;

  useEffect(() => () => { readVersion.current += 1; }, []);

  const handleFile = async (selectedFile: File) => {
    if (bulkImport.isPending) return;
    const version = ++readVersion.current;
    setFile(selectedFile);
    setRows([]);
    setParseError("");
    setIsReading(true);
    bulkImport.reset();
    try {
      const parsed = await readProductSpreadsheet(selectedFile);
      if (readVersion.current === version) setRows(parsed);
    } catch (error) {
      if (readVersion.current === version) setParseError(error instanceof Error ? error.message : "Could not read the spreadsheet.");
    } finally {
      if (readVersion.current === version) setIsReading(false);
    }
  };

  const downloadReport = (failures: ProductImportFailure[]) => {
    try {
      downloadFailedProducts(failures);
    } catch {
      toast.error("Could not download the report. Use Download Failed Rows to try again.");
    }
  };

  const requestFailures = bulkImport.error ? rows.map((row) => ({
    ...row,
    reason: `Import could not be confirmed: ${bulkImport.error.message}. Retry this row with the same SKU to avoid duplicate stock.`,
  })) : [];
  const failures = result?.failed ?? requestFailures;
  const handleUpload = () => {
    if (!rows.length || bulkImport.isPending || result) return;
    bulkImport.mutate(rows, {
      onSuccess: (response) => downloadReport(response.data.failed),
      onError: (error) => downloadReport(rows.map((row) => ({
        ...row, reason: `Import could not be confirmed: ${error.message}. Retry this row with the same SKU to avoid duplicate stock.`,
      }))),
    });
  };
  const handleClose = () => { if (!bulkImport.isPending) onClose(); };

  return (
    <Modal open onClose={handleClose}>
      <ModalHeader title="Bulk Import Products" description="Import products, colors, sizes, prices, and stock using the sample template." onClose={handleClose} />
      <ModalBody>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onDownloadSample} className="gap-1.5">
              <Download className="size-3.5" />Download Sample
            </Button>
            <span className="text-[10px] text-muted-foreground">Use all 26 template columns</span>
          </div>
          <button
            type="button"
            disabled={bulkImport.isPending}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => { event.preventDefault(); if (!bulkImport.isPending) setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragOver(false);
              const selectedFile = event.dataTransfer.files[0];
              if (selectedFile) void handleFile(selectedFile);
            }}
            className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}
          >
            {isReading ? <Loader2 className="size-8 animate-spin text-muted-foreground" /> : <FileSpreadsheet className="size-8 text-muted-foreground" />}
            <span className="max-w-full truncate text-xs font-medium text-foreground">{file?.name || "Click to upload or drag and drop"}</span>
            <span className="text-[10px] text-muted-foreground">.xlsx, .xls, or .csv · Up to 500 rows · 10 MB</span>
          </button>
          <input ref={fileInputRef} type="file" aria-label="Product spreadsheet" accept=".xlsx,.xls,.csv" disabled={bulkImport.isPending} className="hidden" onChange={(event) => {
            const selectedFile = event.target.files?.[0];
            if (selectedFile) void handleFile(selectedFile);
            event.target.value = "";
          }} />
          <p className="text-[10px] text-muted-foreground">SKU, title, category, color, size, and stock are required. Existing SKUs have their stock and prices replaced. Existing product details and color images are reused.</p>
          {parseError && <p role="alert" className="text-xs text-destructive">{parseError}</p>}
          {rows.length > 0 && !result && !bulkImport.error && (
            <div className="flex items-center gap-2 rounded-md bg-primary/5 px-3 py-2 text-xs text-primary" aria-live="polite">
              {bulkImport.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
              {bulkImport.isPending ? `Importing ${rows.length} rows…` : `${rows.length} rows ready for server validation and import`}
            </div>
          )}
          {bulkImport.error && <p role="alert" className="text-xs text-destructive">{bulkImport.error.message} Some rows may already have been saved. Retrying the same SKUs replaces stock without adding it again.</p>}
          {result && (
            <div className="rounded-md bg-muted px-3 py-2 text-xs text-foreground" role="status">
              {result.created} variants created, {result.updated} updated, {result.failed.length} rows failed.
            </div>
          )}
          {failures.length > 0 && (
            <div className="space-y-2">
              <div className="max-h-32 space-y-1 overflow-y-auto rounded-md bg-red-50 px-3 py-2 dark:bg-red-500/10">
                {failures.map((failure) => (
                  <div key={failure.rowNumber} className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 size-3 shrink-0 text-red-500" />
                    <span className="text-[10px] text-red-700 dark:text-red-400">Row {failure.rowNumber}: {failure.reason}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => downloadReport(failures)} className="gap-1.5">
                <Download className="size-3.5" />Download Failed Rows
              </Button>
              <p className="text-[10px] text-muted-foreground">The report keeps every column and adds the row number and error. Correct the failed rows, then upload that file again.</p>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={handleClose} disabled={bulkImport.isPending}>{result ? "Close" : "Cancel"}</Button>
        <Button onClick={handleUpload} disabled={!rows.length || isReading || bulkImport.isPending || Boolean(result)} className="gap-1.5">
          {bulkImport.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
          {bulkImport.isPending ? "Importing…" : `Import ${rows.length} Row${rows.length === 1 ? "" : "s"}`}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
