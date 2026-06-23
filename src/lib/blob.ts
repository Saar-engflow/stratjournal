import { put, del, getDownloadUrl } from '@vercel/blob'

export async function uploadImage(file: File): Promise<{ url: string; pathname: string }> {
  const result = await put(`trade-images/${file.name}`, file, {
    access: 'private',
  })
  return { url: result.url, pathname: result.pathname }
}

export async function getSignedImageUrl(blobUrl: string): Promise<string> {
  const result = await getDownloadUrl(blobUrl)
  return result
}

export async function deleteImage(url: string): Promise<void> {
  await del(url)
}
