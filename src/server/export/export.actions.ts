'use server';

import { exportTrades } from './trade-export';
import { exportNotebook } from './notebook-export';

type ExportResultSuccess = { success: true; csv: string; filename: string };
type ExportResultError = { success: false; error: string };
export type ExportResult = ExportResultSuccess | ExportResultError;

export async function exportTradesAction(): Promise<ExportResult> {
  return exportTrades();
}

export async function exportNotebookAction(): Promise<ExportResult> {
  return exportNotebook();
}
