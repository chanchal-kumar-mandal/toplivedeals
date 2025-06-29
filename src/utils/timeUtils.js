// utils/timeUtils.js
import dayjs from 'dayjs';

export function formatPostedTime(createdAt, updatedAt) {
  const now = dayjs();

  const parseToDayjs = (input) => {
    if (!input) return null;

    // If input is Firestore Timestamp object
    if (typeof input === 'object' && 'seconds' in input) {
      return dayjs(input.seconds * 1000);
    }

    // If input is number (Epoch time)
    if (typeof input === 'number') {
      return dayjs(input);
    }

    // If input is string (ISO format or something else)
    if (typeof input === 'string') {
      const parsed = dayjs(input);
      return parsed.isValid() ? parsed : null;
    }

    // Unsupported format
    return null;
  };

  const updatedTime = parseToDayjs(updatedAt);
  const createdTime = parseToDayjs(createdAt);

  const baseTime = updatedTime || createdTime;

  // Rule 3: If no valid date, fallback to "3d"
  if (!baseTime || !baseTime.isValid()) return '3d';

  const diffMins = now.diff(baseTime, 'minute');
  const diffHours = now.diff(baseTime, 'hour');
  const diffDays = now.diff(baseTime, 'day');

  // Rule 1: < 5 mins = Just now
  if (diffMins < 5) return 'Just now';

  // Rule 2: More than 3 days = 3d
  if (diffDays > 3) return '3d';

  // Rule 4: Compact
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
}
