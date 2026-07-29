import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// TODO: Extend utility helpers for shadcn/ui class composition
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
