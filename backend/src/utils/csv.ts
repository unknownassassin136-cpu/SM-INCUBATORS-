export interface CSVProductRow {
  id?: string;
  slug: string;
  name: string;
  category: string;
  capacity?: number;
  price: number;
  originalPrice?: number;
  shortDescription?: string;
  description?: string;
  image?: string;
  images?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  warranty?: string;
  delivery?: string;
  availability?: string;
}

export function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function parseCSV(content: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        // ignore carriage return
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some((field) => field.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export function parseSpecsString(raw: string): Record<string, string> {
  const specs: Record<string, string> = {};
  if (!raw) return specs;

  // Format: "Model:SMI50FA;Brand:SM Incubators;Warranty:1 Year"
  const pairs = raw.split(';');
  for (const pair of pairs) {
    const [k, ...v] = pair.split(':');
    if (k && v.length > 0) {
      specs[k.trim()] = v.join(':').trim();
    }
  }
  return specs;
}

export function formatSpecsString(specs: Record<string, string> | null | undefined): string {
  if (!specs) return '';
  return Object.entries(specs)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
}

