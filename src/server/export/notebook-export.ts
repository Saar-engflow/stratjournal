import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { generateCSV } from './csv';
import type { ExportResult } from './export.actions';

export async function exportNotebook(): Promise<ExportResult> {
  const user = await requireUser();

  const entries = await prisma.notebookEntry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  if (entries.length === 0) {
    return { success: false, error: 'No notebook entries available to export.' };
  }

  const columns = [
    'Entry ID',
    'Title',
    'Content',
    'Created At',
    'Updated At'
  ];

  const data = entries.map(entry => [
    entry.id,
    entry.title,
    entry.content,
    entry.createdAt.toISOString(),
    entry.updatedAt.toISOString()
  ]);

  const csv = generateCSV(data, columns);

  const today = new Date();
  const filename = `notebook-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.csv`;

  return {
    success: true,
    csv,
    filename
  };
}
