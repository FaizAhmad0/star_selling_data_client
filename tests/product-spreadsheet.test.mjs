import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as XLSX from "xlsx";
import { parseProductWorksheet, buildFailedProductsWorkbook, PRODUCT_IMPORT_HEADERS } from "../src/features/products/lib/product-spreadsheet.ts";

const sample = () => XLSX.read(readFileSync(new URL("../public/sample.xlsx", import.meta.url)), { type: "buffer" });

test("reads the real sample without discarding any template column", () => {
  const rows = parseProductWorksheet(sample());
  assert.equal(rows.length, 1);
  assert.equal(rows[0].rowNumber, 2);
  assert.equal(Object.keys(rows[0].data).length, 26);
  assert.deepEqual(Object.keys(rows[0].data).map((header) => header.trim()), PRODUCT_IMPORT_HEADERS);
  assert.equal(rows[0].data["BULLET POINT 2 "].length > 0, true);
  assert.equal(rows[0].data[" IMAGE 3"].startsWith("https://"), true);
  assert.equal(rows[0].data.STOCK, 150);
});

test("failure workbook preserves all values, includes errors, and can be imported again", () => {
  const [row] = parseProductWorksheet(sample());
  const failures = [{ ...row, reason: "STOCK must be a whole number" }];
  const report = buildFailedProductsWorkbook(failures);
  const encoded = XLSX.write(report, { type: "buffer", bookType: "xlsx" });
  const decoded = XLSX.read(encoded, { type: "buffer" });
  const sheet = decoded.Sheets[decoded.SheetNames[0]];
  const output = XLSX.utils.sheet_to_json(sheet)[0];
  assert.equal(output["Import Row"], 2);
  assert.equal(output["Import Error"], failures[0].reason);
  const [retry] = parseProductWorksheet(decoded);
  assert.equal(Object.keys(retry.data).length, 26);
  for (const [header, value] of Object.entries(row.data)) assert.equal(retry.data[header.trim()], value);
});

test("keeps worksheet row numbers through blank rows and zero-padded SKUs", () => {
  const workbook = sample();
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  workbook.Sheets[workbook.SheetNames[0]] = XLSX.utils.aoa_to_sheet([matrix[0], [], matrix[1]]);
  workbook.Sheets[workbook.SheetNames[0]].A3 = { t: "n", v: 123, w: "00123", z: "00000" };
  const [row] = parseProductWorksheet(workbook);
  assert.equal(row.rowNumber, 3);
  assert.equal(row.data.SKU, "00123");
});

test("rejects missing or duplicate headers and oversized worksheets", () => {
  const missing = sample();
  delete missing.Sheets[missing.SheetNames[0]].Z1;
  assert.throws(() => parseProductWorksheet(missing), /Missing columns: CATEGORY/);
  const duplicate = sample();
  duplicate.Sheets[duplicate.SheetNames[0]].Z1.v = " SKU ";
  assert.throws(() => parseProductWorksheet(duplicate), /Duplicate column: SKU/);
  const large = sample();
  large.Sheets[large.SheetNames[0]]["!ref"] = "A1:Z502";
  assert.throws(() => parseProductWorksheet(large), /Maximum 500/);
});

test("reports formula-looking strings as literal cells", () => {
  const [row] = parseProductWorksheet(sample());
  row.data.TITLE = '=HYPERLINK("https://example.com")';
  const workbook = buildFailedProductsWorkbook([{ ...row, reason: "Invalid title" }]);
  const cell = workbook.Sheets[workbook.SheetNames[0]].B2;
  assert.equal(cell.t, "s");
  assert.equal(cell.f, undefined);
});
