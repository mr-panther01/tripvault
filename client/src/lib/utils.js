import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to conditionally join class names.
 * @param {...any} inputs - The class names or conditions.
 * @returns {string} The merged class names.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}