import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return format(date, 'MMM dd, yyyy')
}

export function formatDateRelative(dateString: string): string {
  const date = new Date(dateString)
  return formatDistanceToNow(date, { addSuffix: true })
}