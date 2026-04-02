/**
 * Date Utilities
 */

/**
 * Returns a relative time string (e.g., "5 days ago", "2 hours ago")
 * or a formatted date if the date is more than a week old.
 */
export const getRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const expenseDate = new Date(dateStr);
  const diffInMs = now.getTime() - expenseDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMins = Math.floor(diffInMs / (1000 * 60));
      return diffInMins <= 0 ? "Just now" : `${diffInMins} mins ago`;
    }
    return `${diffInHours} hours ago`;
  }

  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return expenseDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

/**
 * Formats an ISO date string into a time (e.g., "4:30pm")
 */
export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const hours12 = hours % 12 || 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours12}:${minutesStr}${ampm}`;
};

/**
 * Formats minutes into a duration string (e.g., "2hr 15m")
 */
export const formatDuration = (mins?: number): string => {
  if (!mins) return "0m";
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}hr`;
  return `${hours}hr ${minutes}m`;
};

