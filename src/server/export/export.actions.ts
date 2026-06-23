'use server';

import { exportTrades } from './trade-export';
import { exportNotebook } from './notebook-export';

export async function exportTradesAction() {
  return exportTrades();
}

export async function exportNotebookAction() {
  return exportNotebook();
}
