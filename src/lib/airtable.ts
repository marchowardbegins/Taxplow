import Airtable from "airtable";

const token = process.env.AIRTABLE_TOKEN!;
const baseId = process.env.AIRTABLE_BASE_ID!;
const tableId = process.env.AIRTABLE_TABLE_ID!;
const view = process.env.AIRTABLE_VIEW;

if (!token || !baseId || !tableId) {
  throw new Error("Missing Airtable env vars: AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID");
}

const base = new Airtable({ apiKey: token }).base(baseId);

export type AirtableRow = { id: string; fields: Record<string, unknown> };

export async function fetchRows(limit?: number): Promise<AirtableRow[]> {
  const rows: AirtableRow[] = [];
  const selectOptions: any = { pageSize: 100 };
  
  if (limit) {
    selectOptions.maxRecords = limit;
  }
  
  if (view) {
    selectOptions.view = view;
  }
  
  await base(tableId)
    .select(selectOptions)
    .eachPage((records, next) => {
      records.forEach(r => rows.push({ id: r.id, fields: r.fields }));
      next();
    });
  return rows;
}

export async function fetchHeaders(): Promise<string[]> {
  const rows = await fetchRows(1);
  return rows[0] ? Object.keys(rows[0].fields) : [];
}
