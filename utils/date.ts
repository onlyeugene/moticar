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
