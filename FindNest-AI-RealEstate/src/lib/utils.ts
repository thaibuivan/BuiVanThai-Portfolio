import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " năm trước";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " tháng trước";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " ngày trước";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " giờ trước";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " phút trước";
  
  return "Vừa xong";
}
