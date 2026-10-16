import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Backend-served files (e.g. avatars) come back as paths like "/uploads/avatars/x.jpg",
// relative to the backend origin rather than the /api base URL.
export function resolveAssetUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return new URL(path, new URL(import.meta.env.VITE_API_BASE_URL).origin).toString()
}
