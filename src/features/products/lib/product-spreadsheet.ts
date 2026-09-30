import * as XLSX from "xlsx";
import type { ProductImportCell, ProductImportFailure, ProductImportRow } from "../types";

export const PRODUCT_IMPORT_HEADERS = [
  "SKU", "TITLE", "BULLET POINT 1", "BULLET POINT 2", "BULLET POINT 3", "BULLET POINT 4",
  "SHORT DESCRIPTION", "LONG DESCRIPTION", "DIMENSION", "MATERIAL 1", "MATERIAL 2", "MATERIAL 3",
  "ESTD COST PRICE", "ESTD SELLING PRICE", "ESTD COST PRICE OOI", "ESTD SALE PRICE OOI",
  "PACKAGE CONTENTS", "IMAGE 1", "IMAGE 2", "IMAGE 3", "IMAGE 4", "IMAGE 5",
  "COLOR", "STOCK", "SIZE", "CATEGORY",
];

const normalizeHeader = (header: string) => header.trim().replace(/\s+/g, " ").toUpperCase();
const reportHeaders = new Set(["IMPORT ROW", "IMPORT ERROR"]);

export function parseProductWorksheet(workbook: XLSX.WorkBook): ProductImportRow[] {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet?.["!ref"]) throw new Error("The first worksheet is empty.");
  const range = XLSX.utils.decode_range(sheet["!ref"]);
  if (range.e.r > 500) throw new Error("Maximum 500 spreadsheet rows per import. Split the file into smaller batches.");
  if (range.e.c >= 100) throw new Error("Too many columns. Please use the product sample template.");

  const headers: { name: string; key: string; column: number }[] = [];
  const seen = new Set<string>();
  for (let column = 0; column <= range.e.c; column += 1) {
    const name = String(sheet[XLSX.utils.encode_cell({ r: 0, c: column })]?.v ?? "");
    const key = normalizeHeader(name);
    if (!key || reportHeaders.has(key)) continue;
    if (seen.has(key)) throw new Error(`Duplicate column: ${key}`);
    seen.add(key);
    headers.push({ name, key, column });
  }
  const missing = PRODUCT_IMPORT_HEADERS.filter((header) => !seen.has(header));
  if (missing.length) throw new Error(`Missing columns: ${missing.join(", ")}. Please use the sample template.`);

  const rows: ProductImportRow[] = [];
  for (let rowIndex = 1; rowIndex <= range.e.r; rowIndex += 1) {
    const data = Object.fromEntries(headers.map(({ name, key, column }) => {
      const cell = sheet[XLSX.utils.encode_cell({ r: rowIndex, c: column })];
      // Keep zero-padded numeric SKUs as displayed while sending numeric price/stock cells as numbers.
      const value: ProductImportCell = cell?.t === "e" ? cell.w || "#ERROR!"
        : key === "SKU" && cell?.t === "n" ? cell.w || String(cell.v)
        : cell?.v ?? "";
      return [name, value];
    }));
    if (Object.values(data).some((value) => value !== null && String(value).trim() !== "")) {
      rows.push({ rowNumber: rowIndex + 1, data });
    }
  }
  if (!rows.length) throw new Error("The file has no product rows to import.");
  return rows;
}

export async function readProductSpreadsheet(file: File): Promise<ProductImportRow[]> {
  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) throw new Error("Select an Excel (.xlsx, .xls) or CSV file.");
  if (file.size > 10 * 1024 * 1024) throw new Error("The file must be smaller than 10 MB.");
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const rows = parseProductWorksheet(workbook);
  if (new TextEncoder().encode(JSON.stringify({ rows })).length > 9 * 1024 * 1024) {
    throw new Error("The product data is too large for one import. Split the file into smaller batches.");
  }
  return rows;
}

export function buildFailedProductsWorkbook(failures: ProductImportFailure[]): XLSX.WorkBook {
  const extraHeaders = new Set<string>();
  const normalizedRows = failures.map(({ data }) => Object.fromEntries(Object.entries(data).map(([key, value]) => {
    const header = normalizeHeader(key);
    if (!PRODUCT_IMPORT_HEADERS.includes(header) && !reportHeaders.has(header)) extraHeaders.add(header);
    return [header, value];
  })));
  const dataHeaders = [...PRODUCT_IMPORT_HEADERS, ...extraHeaders];
  const sheet = XLSX.utils.aoa_to_sheet([
    [...dataHeaders, "Import Row", "Import Error"],
    ...failures.map((failure, index) => [
      ...dataHeaders.map((header) => normalizedRows[index][header] ?? ""),
      failure.rowNumber,
      failure.reason,
    ]),
  ]);
  sheet["!cols"] = dataHeaders.map(() => ({ wch: 24 })).concat([{ wch: 12 }, { wch: 80 }]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Failed Products");
  return workbook;
}

export function downloadFailedProducts(failures: ProductImportFailure[]) {
  if (failures.length) XLSX.writeFile(buildFailedProductsWorkbook(failures), "failed-products.xlsx");
}
