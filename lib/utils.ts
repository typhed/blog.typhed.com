import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind class names, resolving conflicts so later classes win.
 * Inlined from the shared @typhed/ui package.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
