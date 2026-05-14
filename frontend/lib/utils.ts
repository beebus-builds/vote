export function formatDate(dateValue?: string | number | Date) {
  if (!dateValue) return '—';
  const date = new Date(dateValue);
  return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export function formatDateShort(dateValue?: string | number | Date) {
  if (!dateValue) return '—';
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function timeRemaining(endDate?: string | number | Date) {
  if (!endDate) return 'Ended';
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h ${minutes}m`;
}

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  nomination_open: 'Nominations Open',
  voting_open: 'Voting Open',
  closed: 'Closed',
  results_published: 'Results Published'
};

export function statusLabel(value: string) {
  return STATUS_LABELS[value] || value;
}

export function getStatusBadgeClass(value: string) {
  return `badge badge-${value}`;
}

export function getInitials(name?: string) {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
}
