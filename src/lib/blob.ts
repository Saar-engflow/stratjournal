import { put, del } from '@vercel/blob'

export async function uploadImage(file: File): Promise<{ url: string; pathname: string }> {
  const result = await put(`trade-images/${file.name}`, file, {
    access: 'public',
  })
  return { url: result.url, pathname: result.pathname }
}

export async function deleteImage(url: string): Promise<void> {
  await del(url)
}
