import Papa from 'papaparse';

export function generateCSV<T>(data: T[], columns: string[]): string {
  return Papa.unparse({
    fields: columns,
    data
  });
}
