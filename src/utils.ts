import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Relative path /api/${path}
 * @param path
 * @returns
 */
export async function fetchData(path: string) {
  const response = await fetch(`/api/${path}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export const arrayFromNumbers = (length: number) => (
  Array.from({length: length + 1}, (_, i) => i)
)
