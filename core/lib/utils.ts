import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge-core"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
